<script setup lang="ts">
import CenteredAppLayout from '@/components/CenteredAppLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, UserIcon, Lock, Eye, EyeOff, Mail } from 'lucide-vue-next'
import PasskeyRegistrationDialog from '@/components/PasskeyRegistrationDialog.vue'
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator.vue'
import { registerUserSchema, type RegisterUserInput } from '#shared/schemas/userSchema'
import { calculatePasswordStrength } from '@/utils/passwordValidation'
import { getAuthErrorMessage } from '#shared/constants/authMessages'

const route = useRoute()
const username = ref('')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const showPasskeyDialog = ref(false)
const registeredUsername = ref('')
const turnstileToken = ref('')
const fieldErrors = ref<Partial<Record<keyof RegisterUserInput, string>>>({})

// Check for error in URL query parameter
onMounted(() => {
  const errorCode = route.query.error as string
  if (errorCode) {
    error.value = getAuthErrorMessage(errorCode) || 'An error occurred during registration'
  }
})

const passwordStrength = computed(() => calculatePasswordStrength(password.value))

// Check if form is valid for submission
const isFormValid = computed(() => {
  const result = registerUserSchema.safeParse({
    'username': username.value,
    'name': name.value,
    'email': email.value,
    'password': password.value,
    'confirm-password': confirmPassword.value,
    'cf-turnstile-response': turnstileToken.value,
  })
  return result.success && passwordStrength.value.score >= 80
})

async function onSubmit(event: Event) {
  event.preventDefault()
  fieldErrors.value = {}
  error.value = ''

  const formData: RegisterUserInput = {
    'username': username.value,
    'name': name.value,
    'email': email.value,
    'password': password.value,
    'confirm-password': confirmPassword.value,
    'cf-turnstile-response': turnstileToken.value,
  }

  const result = registerUserSchema.safeParse(formData)

  if (!result.success) {
    // Map Zod errors to field errors
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof RegisterUserInput
      if (field) {
        fieldErrors.value[field] = err.message
      }
    })
    return
  }

  // Form is valid, proceed with submission
  isLoading.value = true
  try {
    // Your submit logic here
    const form = event.target as HTMLFormElement
    form.submit()
  }
  catch (err) {
    error.value = 'An error occurred during registration'
    console.error(err)
  }
  finally {
    isLoading.value = false
  }
}

function onPasskeyCreated() {
  window.location.href = '/'
}

function onPasskeySkipped() {
  window.location.href = '/'
}

definePageMeta({
  layout: 'empty',
  title: 'Sign Up',
  breadcrumb: 'Register',
})
</script>

<template>
  <CenteredAppLayout
    :center-content="true"
    :full-width="true"
    :hide-sidebar-trigger="true"
    title="Register"
  >
    <Card class="w-full max-w-md mx-4">
      <CardHeader class="text-center relative">
        <CardTitle>
          Create Account
        </CardTitle>
        <CardDescription>
          Join Gromet Reader and start your reading journey
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Alert
          v-if="error"
          variant="destructive"
          class="mb-4"
        >
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <form
          action="/api/auth/register-password"
          method="POST"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="space-y-2">
            <Label
              for="username"
              class="text-sm font-medium"
            >
              Username
            </Label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="username"
                v-model="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                class="pl-9 h-11"
                :class="{ 'border-destructive': fieldErrors.username }"
                :disabled="isLoading"
              />
            </div>
            <p
              v-if="fieldErrors.username"
              class="text-xs text-destructive"
            >
              {{ fieldErrors.username }}
            </p>
          </div>

          <div class="space-y-2">
            <Label
              for="name"
              class="text-sm font-medium"
            >
              Display Name
            </Label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="name"
                v-model="name"
                name="name"
                type="text"
                placeholder="Enter your display name"
                class="pl-9 h-11"
                :class="{ 'border-destructive': fieldErrors.name }"
                :disabled="isLoading"
              />
            </div>
            <p
              v-if="fieldErrors.name"
              class="text-xs text-destructive"
            >
              {{ fieldErrors.name }}
            </p>
          </div>

          <div class="space-y-2">
            <Label
              for="email"
              class="text-sm font-medium"
            >
              Email
            </Label>
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="email"
                v-model="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                class="pl-9 h-11"
                :class="{ 'border-destructive': fieldErrors.email }"
                :disabled="isLoading"
              />
            </div>
            <p
              v-if="fieldErrors.email"
              class="text-xs text-destructive"
            >
              {{ fieldErrors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <Label
              for="password"
              class="text-sm font-medium"
            >
              Password
            </Label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="password"
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="pl-9 pr-9 h-11"
                :class="{ 'border-destructive': fieldErrors.password }"
                :disabled="isLoading"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-transparent"
                @click="showPassword = !showPassword"
              >
                <Eye
                  v-if="!showPassword"
                  class="h-4 w-4"
                />
                <EyeOff
                  v-else
                  class="h-4 w-4"
                />
              </Button>
            </div>
            <p
              v-if="fieldErrors.password"
              class="text-xs text-destructive"
            >
              {{ fieldErrors.password }}
            </p>
            <!-- Password Strength Indicator -->
            <PasswordStrengthIndicator
              :password="password"
              :strength="passwordStrength"
            />
          </div>

          <div class="space-y-2">
            <Label
              for="confirmPassword"
              class="text-sm font-medium"
            >
              Confirm Password
            </Label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirm-password"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                class="pl-9 pr-9 h-11"
                :class="{ 'border-destructive': fieldErrors['confirm-password'] }"
                :disabled="isLoading"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-transparent"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Eye
                  v-if="!showConfirmPassword"
                  class="h-4 w-4"
                />
                <EyeOff
                  v-else
                  class="h-4 w-4"
                />
              </Button>
            </div>
            <p
              v-if="fieldErrors['confirm-password']"
              class="text-xs text-destructive"
            >
              {{ fieldErrors['confirm-password'] }}
            </p>
          </div>

          <NuxtTurnstile v-model="turnstileToken" />
          <Button
            type="submit"
            class="w-full h-11"
            :disabled="isLoading || !isFormValid"
          >
            <Loader2
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Lock
              v-else
              class="mr-2 h-4 w-4"
            />
            Create Account
          </Button>
          <p
            v-if="password && passwordStrength.score < 80"
            class="text-xs text-center text-muted-foreground"
          >
            Password must be strong to create an account
          </p>
        </form>

        <div class="text-center mt-6 space-y-3">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our
            <NuxtLink
              to="https://nnsvn.me/terms"
              class="underline"
              target="_blank"
              rel="noopener noreferrer"
            >Terms of Service</NuxtLink>
            and
            <NuxtLink
              to="https://nnsvn.me/privacy"
              class="underline"
              target="_blank"
              rel="noopener noreferrer"
            >Privacy Policy</NuxtLink>
          </div>

          <div class="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?
            <nuxt-link
              to="/auth/login"
              class="text-primary hover:underline font-medium"
            >
              Sign In
            </nuxt-link>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Passkey Registration Dialog -->
    <PasskeyRegistrationDialog
      v-model:open="showPasskeyDialog"
      :username="registeredUsername"
      @passkey-created="onPasskeyCreated"
      @skip-passkey="onPasskeySkipped"
    />
  </CenteredAppLayout>
</template>
