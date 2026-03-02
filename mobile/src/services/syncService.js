import api from './apiService';
import authService from './authService';
import localStorageService from './localStorageService';

class SyncService {
    constructor() {
        this.isSyncing = false;
        this.syncListeners = [];
    }

    // Add listener for sync events
    addSyncListener(callback) {
        this.syncListeners.push(callback);
    }

    removeSyncListener(callback) {
        this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
    }

    notifyListeners(event, data) {
        this.syncListeners.forEach(callback => callback(event, data));
    }

    // Check if user is authenticated
    async isAuthenticated() {
        return await authService.isAuthenticated();
    }

    // Sync favorites
    async syncFavorites() {
        try {
            const isAuth = await this.isAuthenticated();
            if (!isAuth) {
                console.log('Not authenticated, skipping favorites sync');
                return { success: false, reason: 'not_authenticated' };
            }

            // 1. Get local favorites
            const localFavorites = await localStorageService.getFavorites();

            // 2. Get server favorites
            const response = await api.get('/favorites');
            const serverFavorites = response.data;

            // 3. Upload unsynced local favorites
            const unsyncedLocal = localFavorites.filter(f => !f.synced);
            for (const favorite of unsyncedLocal) {
                try {
                    // Only send fields allowed by CreateFavoriteDto
                    const favoriteData = {
                        hex: favorite.hex,
                        name: favorite.name,
                        rgb: favorite.rgb,
                        cmyk: favorite.cmyk,
                        lab: favorite.lab,
                    };
                    const uploadResponse = await api.post('/favorites', favoriteData);

                    // Update local favorite with server ID
                    const index = localFavorites.findIndex(f => f.localId === favorite.localId);
                    if (index !== -1) {
                        localFavorites[index] = {
                            ...uploadResponse.data,
                            synced: true,
                        };
                    }
                } catch (error) {
                    console.error('Error uploading favorite:', error);
                }
            }

            // 4. Merge server favorites (last-write-wins based on updatedAt)
            const mergedFavorites = this.mergeFavorites(localFavorites, serverFavorites);

            // 5. Save merged data locally
            await localStorageService.saveFavorites(mergedFavorites);

            return { success: true, count: mergedFavorites.length };
        } catch (error) {
            console.error('Error syncing favorites:', error);
            return { success: false, error: error.message };
        }
    }

    // Sync history
    async syncHistory() {
        try {
            const isAuth = await this.isAuthenticated();
            if (!isAuth) {
                console.log('Not authenticated, skipping history sync');
                return { success: false, reason: 'not_authenticated' };
            }

            // 1. Get local history
            const localHistory = await localStorageService.getHistory();

            // 2. Get server history
            const response = await api.get('/history');
            const serverHistory = response.data;

            // 3. Upload unsynced local history
            const unsyncedLocal = localHistory.filter(h => !h.synced);
            for (const historyItem of unsyncedLocal) {
                try {
                    // Only send fields allowed by CreateHistoryDto
                    const historyData = {
                        hex: historyItem.hex,
                        name: historyItem.name,
                        rgb: historyItem.rgb,
                        cmyk: historyItem.cmyk,
                        lab: historyItem.lab,
                    };
                    const uploadResponse = await api.post('/history', historyData);

                    // Update local history with server ID
                    const index = localHistory.findIndex(h => h.localId === historyItem.localId);
                    if (index !== -1) {
                        localHistory[index] = {
                            ...uploadResponse.data,
                            synced: true,
                        };
                    }
                } catch (error) {
                    console.error('Error uploading history:', error);
                }
            }

            // 4. Merge server history (last-write-wins)
            const mergedHistory = this.mergeHistory(localHistory, serverHistory);

            // 5. Save merged data locally (keep only last 50)
            const limitedHistory = mergedHistory.slice(0, 50);
            await localStorageService.saveHistory(limitedHistory);

            return { success: true, count: limitedHistory.length };
        } catch (error) {
            console.error('Error syncing history:', error);
            return { success: false, error: error.message };
        }
    }

    // Process sync queue
    async processSyncQueue() {
        try {
            const queue = await localStorageService.getSyncQueue();

            for (const operation of queue) {
                try {
                    switch (operation.type) {
                        case 'DELETE_FAVORITE':
                            await api.delete(`/favorites/${operation.data.id}`);
                            break;
                        case 'DELETE_HISTORY':
                            await api.delete(`/history/${operation.data.id}`);
                            break;
                        case 'CLEAR_HISTORY':
                            await api.delete('/history');
                            break;
                        default:
                            console.warn('Unknown operation type:', operation.type);
                    }

                    // Remove from queue after successful sync
                    await localStorageService.removeSyncQueueItem(operation.id);
                } catch (error) {
                    console.error('Error processing queue item:', operation, error);
                    // Keep in queue for retry
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error processing sync queue:', error);
            return { success: false, error: error.message };
        }
    }

    // Full sync
    async sync() {
        if (this.isSyncing) {
            console.log('Sync already in progress');
            return { success: false, reason: 'already_syncing' };
        }

        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            console.log('Not authenticated, skipping sync');
            return { success: false, reason: 'not_authenticated' };
        }

        this.isSyncing = true;
        this.notifyListeners('sync_start', {});

        try {
            // 1. Process pending operations
            await this.processSyncQueue();

            // 2. Sync favorites
            const favoritesResult = await this.syncFavorites();
            this.notifyListeners('favorites_synced', favoritesResult);

            // 3. Sync history
            const historyResult = await this.syncHistory();
            this.notifyListeners('history_synced', historyResult);

            // 4. Update last sync time
            await localStorageService.setLastSync();

            this.notifyListeners('sync_complete', {
                favorites: favoritesResult,
                history: historyResult,
            });

            return { success: true };
        } catch (error) {
            console.error('Sync error:', error);
            this.notifyListeners('sync_error', { error: error.message });
            return { success: false, error: error.message };
        } finally {
            this.isSyncing = false;
        }
    }

    // Merge strategies (last-write-wins)
    mergeFavorites(local, server) {
        const merged = new Map();

        // Add all server items (they are the source of truth for synced data)
        server.forEach(item => {
            merged.set(item.id, { ...item, synced: true });
        });

        // Add local items that don't exist on server (unsynced)
        local.forEach(item => {
            if (!item.synced && item.localId) {
                merged.set(item.localId, item);
            }
        });

        return Array.from(merged.values())
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    mergeHistory(local, server) {
        const merged = new Map();

        // Add all server items
        server.forEach(item => {
            merged.set(item.id, { ...item, synced: true });
        });

        // Add local unsynced items
        local.forEach(item => {
            if (!item.synced && item.localId) {
                merged.set(item.localId, item);
            }
        });

        return Array.from(merged.values())
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

export default new SyncService();
