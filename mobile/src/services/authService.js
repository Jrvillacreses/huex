import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './apiService';

class AuthService {
    async register(email, username, password) {
        try {
            const response = await api.post('/auth/register', {
                email,
                username,
                password,
            });

            const { user, accessToken, refreshToken } = response.data;

            // Store tokens and user info
            await AsyncStorage.multiSet([
                ['accessToken', accessToken],
                ['refreshToken', refreshToken],
                ['user', JSON.stringify(user)],
            ]);

            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            console.error('Register error:', error.response?.data || error.message);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    async login(email, password) {
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const { user, accessToken, refreshToken } = response.data;

            // Store tokens and user info
            await AsyncStorage.multiSet([
                ['accessToken', accessToken],
                ['refreshToken', refreshToken],
                ['user', JSON.stringify(user)],
            ]);

            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            console.error('Login error:', error.response?.data || error.message);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    async logout() {
        try {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Logout failed' };
        }
    }

    async getCurrentUser() {
        try {
            const userJson = await AsyncStorage.getItem('user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            return null;
        }
    }

    async isAuthenticated() {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            return !!token;
        } catch (error) {
            return false;
        }
    }

    async getAccessToken() {
        try {
            return await AsyncStorage.getItem('accessToken');
        } catch (error) {
            return null;
        }
    }
}

export default new AuthService();
