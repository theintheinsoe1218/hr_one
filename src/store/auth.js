import { defineStore } from 'pinia'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async login(email, password) {
            // In a real app this would call an API
            // We will mock this response for now
            try {
                // Mock API call
                if (email === 'admin@synergy.com' && password === 'password') {
                    const mockToken = btoa(JSON.stringify({
                        alg: "HS256",
                        typ: "JWT"
                    })) + "." + btoa(JSON.stringify({
                        sub: "1234567890",
                        name: "John Doe",
                        email: "admin@synergy.com",
                        role: "Admin",
                        iat: 1516239022
                    })) + ".SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

                    this.token = mockToken;
                    localStorage.setItem('token', mockToken);
                    this.parseUserFromToken(mockToken);

                    return true;
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (error) {
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
        },
        parseUserFromToken(token) {
            if (!token) return;
            try {
                const decoded = jwtDecode(token);
                this.user = decoded;
            } catch (e) {
                console.error('Invalid token', e);
                this.logout();
            }
        },
        initialize() {
            if (this.token) {
                this.parseUserFromToken(this.token)
            }
        }
    }
})
