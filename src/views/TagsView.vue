<template>
  <UContainer>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Quản Lý Thẻ</h1>
      <UButton icon="i-heroicons-plus" color="neutral" @click="showCreateDialog">
        Thêm Thẻ Mới
      </UButton>
    </div>

    <UCard>
      <UTable v-model:sorting="sorting" :data="tags" :loading="loading" :columns="columns" />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { onMounted, h, resolveComponent, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useTags, type Tag } from '../composables/useTags'
import type { Row, Column } from '@tanstack/vue-table'
import LazyTagModal from '@/components/TagModal.vue'
import LazyConfirmDialog from '@/components/ConfirmDialog.vue'
import '@/assets/main.css'
const { tags, loading, fetchTags, createTag, updateTag, deleteTag } = useTags()

const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const sorting = ref([{ id: 'name', desc: false }])

interface TagsForm {
  name: string
  parentId: string | null
}

function getRowItems(row: Row<Tag>) {
  const toast = useToast()

  return [
    {
      type: 'label',
      label: 'Hành Động',
    },
    {
      label: 'Sửa thẻ',
      icon: 'i-heroicons-pencil-square',
      onSelect() {
        showEditDialog(row.original)
      },
    },
    {
      label: 'Sao chép ID thẻ',
      icon: 'i-heroicons-document-duplicate',
      onSelect() {
        navigator.clipboard.writeText(row.original.id)
        toast.add({
          title: 'ID thẻ đã được sao chép vào clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Xóa thẻ',
      icon: 'i-heroicons-trash',
      color: 'red',
      onSelect() {
        confirmDelete(row.original)
      },
    },
  ]
}

const columns: TableColumn<Tag>[] = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Tên'),
  },
  {
    accessorKey: 'parent',
    header: ({ column }) => getHeader(column, 'Thẻ Cha'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => getHeader(column, 'Ngày'),
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('vi-VN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
            }),
        ),
      )
    },
  },
]

function getHeader(column: Column<Tag>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start',
      },
      items: [
        {
          label: 'Tăng dần',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          },
        },
        {
          label: 'Giảm dần',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-(--ui-bg-elevated)',
      }),
  )
}

const overlay = useOverlay()
const modal = overlay.create(LazyTagModal)

async function showCreateDialog() {
  await modal.open({
    isEditing: false,
    parentOptions: tags.value.filter((tag) => !tag.parent),
    async onSubmit(formData: TagsForm) {
      try {
        await createTag(formData)
        useToast().add({ title: 'Thành công', description: 'Thẻ đã được tạo thành công' })
      } catch {
        useToast().add({
          title: 'Lỗi',
          description: 'Không thể tạo thẻ',
          color: 'error',
        })
      } finally {
        modal.close()
      }
    },
    onCancel() {
      modal.close()
    },
  })
}

async function showEditDialog(tag: Tag) {
  await modal.open({
    isEditing: true,
    tag,
    parentOptions: tags.value.filter((t) => t.id !== tag.id),
    async onSubmit(formData: TagsForm) {
      try {
        await updateTag(tag.id, formData)
        useToast().add({ title: 'Thành công', description: 'Thẻ đã được cập nhật thành công' })
        modal.close()
      } catch {
        useToast().add({
          title: 'Lỗi',
          description: 'Không thể cập nhật thẻ',
          color: 'error',
        })
      }
    },
    onCancel() {
      modal.close()
    },
  })
}

onMounted(() => {
  fetchTags()
})

const modal2 = overlay.create(LazyConfirmDialog)
const confirmDelete = async (tag: Tag) => {
  await modal2.open({
    title: 'Xác nhận xóa',
    message: `Bạn có chắc chắn muốn xóa thẻ "${tag.name}"?`,
    confirmLabel: 'Xóa',
    cancelLabel: 'Hủy',
    async onConfirm() {
      try {
        await deleteTag(tag.id)
        useToast().add({
          title: 'Thành công',
          description: 'Thẻ đã được xóa thành công',
        })
        modal2.close()
      } catch {
        useToast().add({
          title: 'Lỗi',
          description: 'Xóa thất bại',
          color: 'error',
        })
      }
    },
    onCancel() {
      modal2.close()
    },
  })
}
</script>
