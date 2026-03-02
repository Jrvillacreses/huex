import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the backend URL dynamically (same as api.js)
const getBackendUrl = () => {
    let host = 'localhost';

    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

    if (debuggerHost) {
        host = debuggerHost.split(':')[0];

        // If it's a tunnel URL (like *.exp.direct), appending :3000 is usually wrong
        // because the tunnel only forwards to the expo dev server port.
        if (host.includes('exp.direct')) {
            console.warn('⚠️ Expo Tunnel detected. Backend must also be tunneled or use a local IP.');
            // Fallback: If we're on a tunnel, we might still want to try localhost if it's an emulator
            // but for a physical device, this tunnel URL:3000 will NOT work.
            if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
            return 'http://localhost:3000';
        }

        return `http://${host}:3000`;
    }

    if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
};

const API_URL = getBackendUrl();

console.log('API Service URL configured as:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic for auth endpoints to prevent infinite loops
        if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken: refreshToken
                    });

                    const { accessToken } = response.data;
                    await AsyncStorage.setItem('accessToken', accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Refresh failed, logout user
                await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
