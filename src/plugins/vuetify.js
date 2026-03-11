import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#8b5cf6', // Indigo/Purple tone to match user reference image
                    secondary: '#475569',
                    accent: '#7dd3fc',
                    error: '#ef4444',
                    info: '#3b82f6',
                    success: '#22c55e',
                    warning: '#f59e0b',
                    background: '#f8fafc',
                    surface: '#ffffff'
                }
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#3b82f6',
                    secondary: '#94a3b8',
                    accent: '#0369a1',
                    error: '#f87171',
                    info: '#60a5fa',
                    success: '#4ade80',
                    warning: '#fbbf24',
                    background: '#0f172a',
                    surface: '#1e293b'
                }
            }
        }
    }
})
