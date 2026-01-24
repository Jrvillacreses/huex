import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBackendUrl = () => {
    // 1. If running on Android Emulator, Use 10.0.2.2
    // 2. If running on physical device via Expo Go, try to get debuggerHost IP
    // 3. Fallback to localhost (web/simulator)

    if (Platform.OS === 'android') {
        // Check if it is an emulator roughly (this isn't perfect but 10.0.2.2 is safe for emulator)
        // For physical device, we prefer the LAN IP.
        const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
        if (debuggerHost) {
            const ip = debuggerHost.split(':')[0];
            return `http://${ip}:3000`;
        }
        return 'http://10.0.2.2:3000';
    }

    // iOS or Web
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    if (debuggerHost && Platform.OS !== 'web') {
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:3000`;
    }

    return 'http://localhost:3000';
};

const API_URL = getBackendUrl();

console.log("API URL configured as:", API_URL);

export const saveHistory = async (colorData) => {
    try {
        const response = await fetch(`${API_URL}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(colorData),
        });
        if (!response.ok) {
            // Log response text for debugging
            const text = await response.text();
            console.error('Save History Error Response:', text);
            throw new Error(`Failed to save history: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error saving history:', error);
        throw error;
    }
};

export const getHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) {
            const text = await response.text();
            console.error('Get History Error Response:', text);
            throw new Error(`Failed to fetch history: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const clearHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/history`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to clear history');
        }
        return await response.json();
    } catch (error) {
        console.error('Error clearing history:', error);
        throw error;
    }
};

export const deleteHistoryItem = async (id) => {
    try {
        const response = await fetch(`${API_URL}/history/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete history item');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting history item:', error);
        throw error;
    }
};

// --- Favorites API ---

export const getFavorites = async () => {
    try {
        const response = await fetch(`${API_URL}/favorites`);
        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};

export const saveFavorite = async (colorData) => {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(colorData),
        });
        if (!response.ok) {
            const text = await response.text();
            console.error('Save Favorite Error:', text);
            throw new Error('Failed to save favorite');
        }
        return await response.json();
    } catch (error) {
        console.error('Error saving favorite:', error);
        throw error;
    }
};

export const deleteFavorite = async (id) => {
    try {
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete favorite');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting favorite:', error);
        throw error;
    }
};
