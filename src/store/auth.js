import { defineStore } from 'pinia'
import api from '../utils/api'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
        user: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async login(username, password, remember = false) {
            try {
                const response = await api.post('/users/login', {
                    username: username,
                    password: password
                });

                const token = response.data.token;
                if (!token) throw new Error('No token received');

                this.token = token;

                // Remember me: localStorage (persistent) vs sessionStorage (tab-only)
                if (remember) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('rememberMe', 'true');
                    sessionStorage.removeItem('token');
                } else {
                    sessionStorage.setItem('token', token);
                    localStorage.removeItem('token');
                    localStorage.removeItem('rememberMe');
                }

                if (response.data.username) {
                    this.user = {
                        name: response.data.username,
                        role: response.data.role
                    };
                } else {
                    this.parseUserFromToken(token);
                }

                return true;
            } catch (error) {
                console.error('Login error', error);
                throw new Error(error.response?.data?.message || error.response?.data || 'Invalid credentials');
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
            sessionStorage.removeItem('token');
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
