const API_URL = 'http://localhost:3000';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('huex_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('huex_token', token);
        } else {
            localStorage.removeItem('huex_token');
        }
    }

    isLoggedIn() {
        return !!this.token;
    }

    getHeaders(requiresAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (requiresAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async handleResponse(response) {
        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                this.setToken(null);
                window.location.href = 'login.html';
            }
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Error en la petición');
        }
        return response.json();
    }

    // --- Auth Endpoints ---
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ email, password }),
            });
            const data = await this.handleResponse(response);
            if (data && data.accessToken) {
                this.setToken(data.accessToken);
                return data; // contains accessToken, user, etc.
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async getProfile() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: this.getHeaders(),
                cache: 'no-store'
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
    }

    logout() {
        this.setToken(null);
        window.location.href = 'index.html';
    }

    // --- History Endpoints ---
    async getHistory() {
        try {
            const response = await fetch(`${API_URL}/history`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('History fetch error:', error);
            return [];
        }
    }

    // --- Favorites Endpoints ---
    async getFavorites() {
        try {
            const response = await fetch(`${API_URL}/favorites`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Favorites fetch error:', error);
            return [];
        }
    }
}

// Global instance to use across pages
const api = new ApiService();
