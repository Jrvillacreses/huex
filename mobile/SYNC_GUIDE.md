# HueX Sync Service - Usage Guide

## Overview

The HueX mobile app implements an **offline-first** architecture, meaning:
- ✅ App works completely offline
- ✅ Data is stored locally first
- ✅ Syncs with server when online and authenticated
- ✅ Automatic conflict resolution (last-write-wins)

## Services

### 1. localStorageService

Manages all local data storage using AsyncStorage.

```javascript
import localStorageService from './services/localStorageService';

// Favorites
const favorites = await localStorageService.getFavorites();
await localStorageService.addFavorite({ hex: '#FF5733', name: 'Coral', ... });
await localStorageService.removeFavorite(favoriteId);

// History
const history = await localStorageService.getHistory();
await localStorageService.addHistory({ hex: '#3498db', ... });
await localStorageService.clearHistory();

// Sync Queue
const queue = await localStorageService.getSyncQueue();
await localStorageService.addToSyncQueue({
  type: 'CREATE_FAVORITE',
  data: favoriteData
});

// Last Sync
const lastSync = await localStorageService.getLastSync();
await localStorageService.setLastSync();
```

### 2. syncService

Handles bidirectional synchronization with the backend.

```javascript
import syncService from './services/syncService';

// Full sync (favorites + history + queue)
const result = await syncService.sync();

// Individual syncs
await syncService.syncFavorites();
await syncService.syncHistory();
await syncService.processSyncQueue();

// Listen to sync events
syncService.addSyncListener((event, data) => {
  switch(event) {
    case 'sync_start':
      console.log('Sync started');
      break;
    case 'favorites_synced':
      console.log('Favorites synced:', data);
      break;
    case 'history_synced':
      console.log('History synced:', data);
      break;
    case 'sync_complete':
      console.log('Sync complete:', data);
      break;
    case 'sync_error':
      console.error('Sync error:', data);
      break;
  }
});
```

## Usage Examples

### Example 1: Adding a Favorite (Offline-First)

```javascript
import localStorageService from './services/localStorageService';
import syncService from './services/syncService';
import authService from './services/authService';

async function addFavorite(colorData) {
  // 1. Save locally first (works offline)
  const favorite = await localStorageService.addFavorite(colorData);
  
  // 2. If authenticated, try to sync immediately
  const isAuth = await authService.isAuthenticated();
  if (isAuth) {
    try {
      await syncService.syncFavorites();
    } catch (error) {
      // If sync fails, it will be queued for later
      console.log('Will sync later');
    }
  }
  
  return favorite;
}
```

### Example 2: Pull-to-Refresh Sync

```javascript
import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import syncService from './services/syncService';

function FavoritesScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncService.sync();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Your content */}
    </ScrollView>
  );
}
```

### Example 3: Automatic Sync on Login

```javascript
import authService from './services/authService';
import syncService from './services/syncService';

async function handleLogin(email, password) {
  const result = await authService.login(email, password);
  
  if (result.success) {
    // Sync data after successful login
    await syncService.sync();
    navigation.replace('Main');
  }
  
  return result;
}
```

### Example 4: Background Sync

```javascript
import { useEffect } from 'react';
import { AppState } from 'react-native';
import syncService from './services/syncService';
import authService from './services/authService';

function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, sync if authenticated
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          syncService.sync();
        }
      }
    });

    return () => subscription.remove();
  }, []);

  return <AppNavigator />;
}
```

## Conflict Resolution

The sync service uses **last-write-wins** strategy:

1. **Server data is source of truth** for synced items
2. **Local unsynced data** is preserved and uploaded
3. **Duplicates** are resolved by comparing IDs
4. **Timestamps** determine which version is newer

### Example Scenario:

**Offline:**
- User adds Favorite A locally (localId: 123, synced: false)

**Online:**
- Sync uploads Favorite A to server (gets server ID: 456)
- Local favorite updated: (id: 456, synced: true)
- Next sync: no duplicates because localId is replaced

## Data Flow

```
┌─────────────┐
│   Mobile    │
│     App     │
└──────┬──────┘
       │
       │ 1. User Action (add/delete)
       ▼
┌─────────────────┐
│ Local Storage   │ ◄── Always saves here first
│  (AsyncStorage) │
└──────┬──────────┘
       │
       │ 2. If online + authenticated
       ▼
┌─────────────────┐
│  Sync Service   │
│   (syncQueue)   │
└──────┬──────────┘
       │
       │ 3. HTTP Request
       ▼
┌─────────────────┐
│  Backend API    │
│ (NestJS + JWT)  │
└──────┬──────────┘
       │
       │ 4. Save to DB
       ▼
┌─────────────────┐
│   PostgreSQL    │
│   (or SQLite)   │
└─────────────────┘
```

## Best Practices

### ✅ DO:
- Always save to local storage first
- Sync in background (don't block UI)
- Handle sync errors gracefully
- Show sync status to user
- Use pull-to-refresh for manual sync
- Sync on app foreground if authenticated

### ❌ DON'T:
- Don't wait for sync to complete before showing data
- Don't block user actions during sync
- Don't show errors for failed background syncs
- Don't sync too frequently (respect battery/data)

## Sync Queue Operations

The sync queue stores operations that couldn't be completed immediately:

```javascript
// Operation types
{
  type: 'CREATE_FAVORITE',
  data: { hex, name, rgb, cmyk, lab }
}

{
  type: 'DELETE_FAVORITE',
  data: { id }
}

{
  type: 'CREATE_HISTORY',
  data: { hex, name, rgb, cmyk, lab }
}

{
  type: 'DELETE_HISTORY',
  data: { id }
}

{
  type: 'CLEAR_HISTORY',
  data: {}
}
```

Queue is processed automatically during sync and cleared on success.

## Testing Offline Functionality

1. **Disable network**: Turn off WiFi/data
2. **Use app normally**: Add favorites, scan colors
3. **Verify local storage**: Data should be saved
4. **Enable network**: Turn WiFi/data back on
5. **Trigger sync**: Pull to refresh or login
6. **Verify server**: Check data appears in backend

## Troubleshooting

### Sync not working?
- Check authentication: `await authService.isAuthenticated()`
- Check network: Try API call manually
- Check sync queue: `await localStorageService.getSyncQueue()`
- Check last sync: `await localStorageService.getLastSync()`

### Duplicates appearing?
- Clear local data: `await localStorageService.clearAll()`
- Re-sync: `await syncService.sync()`

### Data not persisting?
- Check AsyncStorage permissions
- Check error logs in console
- Verify data structure matches DTOs
