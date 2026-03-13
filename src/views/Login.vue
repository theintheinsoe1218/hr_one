<template>
  <v-container fluid class="fill-height bg-background" style="min-height: 100vh">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-xl" pa-6>
          <v-card-title class="text-h4 font-weight-bold text-center mt-6 text-primary">
            Aura HR
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Sign in to access your dashboard
          </v-card-subtitle>
          
          <v-card-text>
            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="errorMsg = ''"
            >
              {{ errorMsg }}
            </v-alert>

            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'Username is required']"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'Password is required']"
                required
                class="mt-2"
              ></v-text-field>

              <div class="d-flex justify-space-between align-center my-4">
                <v-checkbox
                  v-model="remember"
                  label="Remember me"
                  hide-details
                  color="primary"
                  density="compact"
                ></v-checkbox>
                <router-link to="/forgot-password" class="text-primary text-decoration-none text-body-2">Forgot password?</router-link>
              </div>

              <v-btn
                type="submit"
                color="primary"
                size="x-large"
                block
                class="mt-2 rounded-lg font-weight-bold"
                :loading="loading"
              >
                Sign In
              </v-btn>
            </v-form>
            
            <!-- <div class="text-center mt-6 text-body-2 text-grey-darken-1">
              Demo Credentials: user: <strong>admin</strong> | password: <strong>admin123</strong>
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(true)
const loading = ref(false)
const errorMsg = ref('')

// Restore saved username if "Remember me" was checked previously
onMounted(() => {
  const savedUsername = localStorage.getItem('rememberedUsername')
  const wasRemembered = localStorage.getItem('rememberMe') === 'true'
  if (savedUsername && wasRemembered) {
    username.value = savedUsername
    remember.value = true
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  
  loading.value = true
  errorMsg.value = ''
  
  try {
    await authStore.login(username.value, password.value, remember.value)

    // Save or clear username based on remember me
    if (remember.value) {
      localStorage.setItem('rememberedUsername', username.value)
    } else {
      localStorage.removeItem('rememberedUsername')
    }

    router.push('/dashboard')
  } catch (error) {
    errorMsg.value = error.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
