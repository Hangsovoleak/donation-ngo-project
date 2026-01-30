import { apiService } from './apiService';

export const ngoService = {
    // Get all NGOs with optional filters
    async getAllNGOs(filters = {}) {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.city && filters.city !== 'All Province') params.append('city', filters.city);
        if (filters.category && filters.category.length > 0) {
            filters.category.forEach(id => params.append('category_ids', id));
        }
        if (filters.beneficiaries && filters.beneficiaries.length > 0) {
            filters.beneficiaries.forEach(id => params.append('beneficiary_ids', id));
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/ngos/?${queryString}` : '/ngos/';

        return apiService.get(endpoint);
    },

    // Get single NGO by ID
    async getNGOById(id) {
        return apiService.get(`/ngos/${id}`);
    },

    // Create new NGO
    async createNGO(ngoData) {
        return apiService.post('/ngos/', ngoData);
    },

    // Update existing NGO
    async updateNGO(id, ngoData) {
        return apiService.put(`/ngos/${id}`, ngoData);
    },

    // Delete NGO
    async deleteNGO(id) {
        return apiService.delete(`/ngos/${id}`);
    },

    // Get all categories
    async getCategories() {
        return apiService.get('/ngos/categories/all');
    },

    // Get all beneficiaries
    async getBeneficiaries() {
        return apiService.get('/ngos/beneficiaries/all');
    },
};
