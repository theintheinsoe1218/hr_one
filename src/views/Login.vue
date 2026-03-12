<template>
  <v-container fluid class="fill-height bg-grey-lighten-4" style="min-height: 100vh">
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
                v-model="email"
                label="Email Address"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="primary"
                :rules="[v => !!v || 'Email is required']"
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
                <a href="#" class="text-primary text-decoration-none text-body-2">Forgot password?</a>
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
              Demo Credentials: user: <strong>admin@synergy.com</strong> | password: <strong>password</strong>
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@synergy.com')
const password = ref('password')
const showPassword = ref(false)
const remember = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) return;
  
  loading.value = true
  errorMsg.value = ''
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    errorMsg.value = error.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
