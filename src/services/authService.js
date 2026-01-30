import { apiService } from './apiService';

export const authService = {
    // Login admin
    async login(email, password) {
        return apiService.post('/auth/login', { email, password });
    },

    // Store admin info
    setAdmin(adminData) {
        localStorage.setItem('admin', JSON.stringify(adminData));
    },

    // Get admin info
    getAdmin() {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    },

    // Check if logged in
    isLoggedIn() {
        return this.getAdmin() !== null;
    },

    // Logout
    logout() {
        localStorage.removeItem('admin');
    },
};
