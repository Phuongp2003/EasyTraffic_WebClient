<template>
  <div class="max-w-6xl mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Vai Trò</h1>
      <UButton @click="openCreateModal">Tạo Vai Trò</UButton>
    </div>

    <UTable :data="columns" :rows="rolesStore.roles" :loading="rolesStore.loading">
      <template #empty-state>
        <div class="text-center py-4 text-gray-500">Không tìm thấy vai trò nào</div>
      </template>
    </UTable>

    <!-- Create Role Modal -->
    <UModal v-model="showCreateModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Tạo Vai Trò Mới</h3>
        </template>

        <UForm :state="formState" @submit="onCreateRole">
          <UFormField label="Tên" name="name">
            <UInput v-model="formState.name" placeholder="Nhập tên vai trò" />
          </UFormField>
        </UForm>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showCreateModal = false">
              Hủy
            </UButton>
            <UButton :loading="isCreating" @click="onCreateRole"> Tạo </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRolesStore } from '@/stores/roles'

const rolesStore = useRolesStore()
const showCreateModal = ref(false)
const isCreating = ref(false)
const toast = useToast()
const formState = ref({
  name: '',
})

const columns = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Tên',
  },
]

async function openCreateModal() {
  formState.value.name = ''
  showCreateModal.value = true
}

async function onCreateRole() {
  try {
    isCreating.value = true
    await rolesStore.createRole({
      name: formState.value.name,
    })
    showCreateModal.value = false
    toast.add({
      title: 'Thành công',
      description: 'Vai trò đã được tạo thành công',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: 'Lỗi',
      description: String(error) || 'Không thể tạo vai trò',
      color: 'error',
    })
  } finally {
    isCreating.value = false
  }
}

onMounted(async () => {
  await rolesStore.fetchRoles()
})
</script>
