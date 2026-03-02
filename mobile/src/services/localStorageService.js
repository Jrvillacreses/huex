import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    FAVORITES: '@huex_favorites',
    HISTORY: '@huex_history',
    SYNC_QUEUE: '@huex_sync_queue',
    LAST_SYNC: '@huex_last_sync',
};

class LocalStorageService {
    // Favorites
    async getFavorites() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    }

    async saveFavorites(favorites) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
            return { success: true };
        } catch (error) {
            console.error('Error saving favorites:', error);
            return { success: false, error };
        }
    }

    async addFavorite(favorite) {
        const favorites = await this.getFavorites();
        const newFavorite = {
            ...favorite,
            id: Date.now(), // Temporary local ID
            localId: Date.now(),
            synced: false,
            createdAt: new Date().toISOString(),
        };
        favorites.unshift(newFavorite);
        await this.saveFavorites(favorites);
        return newFavorite;
    }

    async removeFavorite(id) {
        const favorites = await this.getFavorites();
        const filtered = favorites.filter(f => f.id !== id && f.localId !== id);
        await this.saveFavorites(filtered);
        return { success: true };
    }

    // History
    async getHistory() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting history:', error);
            return [];
        }
    }

    async saveHistory(history) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
            return { success: true };
        } catch (error) {
            console.error('Error saving history:', error);
            return { success: false, error };
        }
    }

    async addHistory(historyItem) {
        let history = await this.getHistory();
        const newItem = {
            ...historyItem,
            id: Date.now(),
            localId: Date.now(),
            synced: false,
            createdAt: new Date().toISOString(),
        };

        history.unshift(newItem);

        // Keep only last 50 items locally
        if (history.length > 50) {
            history = history.slice(0, 50);
        }

        await this.saveHistory(history);
        return newItem;
    }

    async clearHistory() {
        await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
        return { success: true };
    }

    // Sync Queue
    async getSyncQueue() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting sync queue:', error);
            return [];
        }
    }

    async addToSyncQueue(operation) {
        const queue = await this.getSyncQueue();
        queue.push({
            ...operation,
            timestamp: Date.now(),
            id: `${operation.type}_${Date.now()}`,
        });
        await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
        return { success: true };
    }

    async clearSyncQueue() {
        await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
        return { success: true };
    }

    async removeSyncQueueItem(id) {
        const queue = await this.getSyncQueue();
        const filtered = queue.filter(item => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filtered));
        return { success: true };
    }

    // Last Sync
    async getLastSync() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
            return data ? new Date(data) : null;
        } catch (error) {
            console.error('Error getting last sync:', error);
            return null;
        }
    }

    async setLastSync(date = new Date()) {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, date.toISOString());
        return { success: true };
    }

    // Clear all data
    async clearAll() {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.FAVORITES,
                STORAGE_KEYS.HISTORY,
                STORAGE_KEYS.SYNC_QUEUE,
                STORAGE_KEYS.LAST_SYNC,
            ]);
            return { success: true };
        } catch (error) {
            console.error('Error clearing all data:', error);
            return { success: false, error };
        }
    }
}

export default new LocalStorageService();
