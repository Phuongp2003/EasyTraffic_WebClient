<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { api } from '../plugins/axios'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(5, 'Phải có ít nhất 5 ký tự'),
})

type LoginForm = z.infer<typeof schema>

const state = reactive({
  email: '',
  password: '',
})

const toast = useToast()
const router = useRouter()
const { setTokens } = useAuth()
const userPayload = useLocalStorage('userPayload', {})

async function onSubmit(event: FormSubmitEvent<LoginForm>) {
  try {
    const response = await api.post('/auth/login', event.data)
    const { accessToken, refreshToken } = response.data.data

    // Store tokens in cookies with proper expiration
    setTokens(accessToken, refreshToken)

    // Decode token payload and store in localStorage
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    userPayload.value = payload

    toast.add({ title: 'Thành công', description: 'Đăng nhập thành công.', color: 'success' })
    router.push('/')
  } catch (error) {
    toast.add({
      title: 'Lỗi',
      description: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.',
      color: 'error',
    })
    console.error(error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <UCard class="w-full max-w-md m-4 shadow-xl border-2 border-gray-200 dark:border-gray-700">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Chào Mừng Trở Lại</h1>
        <p class="text-gray-600 dark:text-gray-400">Vui lòng đăng nhập vào tài khoản của bạn</p>
      </div>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            class="w-full"
            placeholder="Nhập email của bạn"
          />
        </UFormField>
        <UFormField label="Mật Khẩu" name="password">
          <UInput
            v-model="state.password"
            type="password"
            class="w-full"
            placeholder="Nhập mật khẩu của bạn"
          />
        </UFormField>
        <div class="mt-8">
          <UButton
            type="submit"
            color="primary"
            block
            class="py-3 font-semibold text-lg hover:bg-blue-700 bg-blue-500"
            :ui="{}"
          >
            Đăng Nhập
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
