<template>
  <v-container fluid class="fill-height bg-background" style="min-height: 100vh">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">

        <!-- Step 1: Enter Email -->
        <v-card v-if="!emailSent" class="elevation-12 rounded-xl pa-2">
          <v-card-title class="text-h4 font-weight-bold text-center mt-6 text-primary">
            Aura HR
          </v-card-title>
          <v-card-subtitle class="text-center mb-2">
            Reset your password
          </v-card-subtitle>

          <v-card-text>
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
              density="compact"
              icon="mdi-information-outline"
            >
              Enter your registered email address and we'll send you a password reset link.
            </v-alert>

            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="email"
                label="Email Address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                color="primary"
                type="email"
                :rules="emailRules"
                required
                autofocus
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                size="x-large"
                block
                class="mt-2 rounded-lg font-weight-bold"
                :loading="loading"
              >
                Send Reset Link
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              <router-link to="/login" class="text-primary text-decoration-none text-body-2">
                <v-icon size="small" class="me-1">mdi-arrow-left</v-icon>
                Back to Login
              </router-link>
            </div>
          </v-card-text>
        </v-card>

        <!-- Step 2: Success State -->
        <v-card v-else class="elevation-12 rounded-xl pa-2">
          <v-card-title class="text-h4 font-weight-bold text-center mt-6 text-primary">
            Aura HR
          </v-card-title>

          <v-card-text class="text-center py-6">
            <v-icon size="80" color="success" class="mb-4">mdi-email-check-outline</v-icon>

            <div class="text-h6 font-weight-bold mb-2">Check Your Email</div>
            <div class="text-body-2 text-medium-emphasis mb-2">
              We've sent a password reset link to:
            </div>
            <div class="text-body-1 font-weight-bold text-primary mb-6">
              {{ email }}
            </div>
            <div class="text-body-2 text-medium-emphasis mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </div>

            <v-btn
              variant="tonal"
              color="primary"
              class="mb-3"
              block
              :loading="resendLoading"
              @click="handleResend"
            >
              <v-icon start>mdi-refresh</v-icon>
              Resend Email
            </v-btn>

            <router-link to="/login" class="text-primary text-decoration-none text-body-2">
              <v-icon size="small" class="me-1">mdi-arrow-left</v-icon>
              Back to Login
            </router-link>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

    <!-- Resend Success Snackbar -->
    <v-snackbar v-model="snackbar" color="success" location="top" :timeout="3000">
      <v-icon start>mdi-check-circle</v-icon>
      Reset link resent successfully!
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const form = ref(null)
const email = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const emailSent = ref(false)
const snackbar = ref(false)

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
]

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  loading.value = false
  emailSent.value = true
}

const handleResend = async () => {
  resendLoading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200))

  resendLoading.value = false
  snackbar.value = true
}
</script>
