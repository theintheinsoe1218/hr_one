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
                    primary: '#6366f1', // Indigo (Eye-friendly, professional)
                    secondary: '#64748b', // Slate
                    accent: '#06b6d4',
                    error: '#ef4444',
                    info: '#3b82f6',
                    success: '#10b981',
                    warning: '#f59e0b',
                    background: '#f8fafc',
                    surface: '#ffffff',
                    'on-surface': '#1e293b',
                    'on-background': '#1e293b'
                }
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#818cf8', // Lighter Indigo for contrast
                    secondary: '#94a3b8',
                    accent: '#22d3ee',
                    error: '#f87171',
                    info: '#60a5fa',
                    success: '#34d399',
                    warning: '#fbbf24',
                    background: '#0f172a', // Deep Slate
                    surface: '#1e293b', // Lighter Slate for cards
                    'on-surface': '#f1f5f9',
                    'on-background': '#f1f5f9'
                }
            }
        }
    }
})
