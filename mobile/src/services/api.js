import api from './apiService';

export const saveHistory = async (colorData) => {
    try {
        const response = await api.post('/history', colorData);
        return response.data;
    } catch (error) {
        console.error('Error saving history:', error.response?.data || error.message);
        throw error;
    }
};

export const getHistory = async () => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error.response?.data || error.message);
        throw error;
    }
};

export const clearHistory = async () => {
    try {
        const response = await api.delete('/history');
        return response.data;
    } catch (error) {
        console.error('Error clearing history:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteHistoryItem = async (id) => {
    try {
        const response = await api.delete(`/history/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting history item:', error.response?.data || error.message);
        throw error;
    }
};

// --- Favorites API ---

export const getFavorites = async () => {
    try {
        const response = await api.get('/favorites');
        return response.data;
    } catch (error) {
        console.error('Error fetching favorites:', error.response?.data || error.message);
        throw error;
    }
};

export const saveFavorite = async (colorData) => {
    try {
        const response = await api.post('/favorites', colorData);
        return response.data;
    } catch (error) {
        console.error('Error saving favorite:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteFavorite = async (id) => {
    try {
        const response = await api.delete(`/favorites/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting favorite:', error.response?.data || error.message);
        throw error;
    }
};
