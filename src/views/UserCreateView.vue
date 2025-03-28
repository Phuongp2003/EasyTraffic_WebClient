<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Tạo Người Dùng Mới</h1>

    <UForm :state="formState" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="formState.email" type="email" placeholder="Nhập địa chỉ email" />
      </UFormField>

      <UFormField label="Mật Khẩu" name="password" class="mt-4">
        <UInput v-model="formState.password" type="password" placeholder="Nhập mật khẩu" />
      </UFormField>
      <UFormField label="Vai Trò" name="role" class="mt-4">
        <USelectMenu
          v-model="formState.role"
          :items="roleOptions || []"
          :loading="rolesStore.loading"
          placeholder="Chọn vai trò"
          class="z-50"
          value-attribute="name"
        />
      </UFormField>

      <div class="mt-6">
        <UButton type="submit" :loading="isLoading">Tạo Người Dùng</UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRolesStore } from '@/stores/roles'

const router = useRouter()
const authStore = useAuthStore()
const rolesStore = useRolesStore()
const toast = useToast()
const isLoading = ref(false)

const formState = ref({
  email: '',
  password: '',
  role: '', // Changed from roleId to role
})

// Transform roles data for select options
const roleOptions = ref<string[]>([])

// Fetch roles on component mount
onMounted(async () => {
  try {
    await rolesStore.fetchRoles()
    roleOptions.value = rolesStore.roles.map((role) => role.name)
  } catch (error) {
    toast.add({
      title: 'Lỗi',
      description: 'Không thể tải vai trò',
      color: 'error',
    })
    console.error(error)
  }
})

async function onSubmit() {
  try {
    isLoading.value = true
    await authStore.register({
      email: formState.value.email,
      password: formState.value.password,
      role: formState.value.role, // Changed from roleId to role
    })
    toast.add({
      title: 'Thành công',
      description: 'Người dùng đã được tạo thành công',
      color: 'success',
    })
    router.push('/users')
  } catch (error) {
    toast.add({
      title: 'Lỗi',
      description: String(error) || 'Không thể tạo người dùng',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
