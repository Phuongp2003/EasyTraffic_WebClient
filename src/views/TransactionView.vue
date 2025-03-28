<template>
    <div class="p-4">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Quản lý Giao dịch</h2>
          </div>
        </template>
  
        <UTable v-model:sorting="sorting" :data="teamMembers" :columns="columns" :loading="loading">
          <template #actions-data="{ row }">
            <UDropdownMenu :items="getRowItems(row)">
              <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" />
            </UDropdownMenu>
          </template>
        </UTable>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, h, resolveComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTeamMembers, type TeamMember } from '@/composables/useTeamMembers'
  import { useRolesStore } from '@/stores/roles'
  import type { TableColumn } from '@nuxt/ui'
  import type { Row, Column } from '@tanstack/vue-table'
  
  const router = useRouter()
  const { teamMembers, loading, fetchTeamMembers } = useTeamMembers()
  const rolesStore = useRolesStore()
  const toast = useToast()
  const sorting = ref([{ id: 'email', desc: false }])
  
  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  
  function getRowItems(row: Row<TeamMember>) {
    return [
      {
        label: 'Sao chép ID thành viên',
        icon: 'i-heroicons-document-duplicate',
        onSelect: () => {
          navigator.clipboard.writeText(row.original.id)
          toast.add({
            title: 'ID thành viên đã được sao chép vào clipboard!',
            color: 'success',
            icon: 'i-lucide-circle-check',
          })
        },
      },
      {
        type: 'separator',
      },
    ]
  }
  
  const columns: TableColumn<TeamMember>[] = [
    {
      accessorKey: 'userId',
      header: ({ column }) => getHeader(column, 'Người đóng tiền'),
      cell: ({ row }) => {
        const role = rolesStore.roles.find((role) => role.id === row.getValue('roleId'))
        return role ? role.name : 'Không xác định'
      },
    },
    {
      accessorKey: 'money',
      header: ({ column }) => getHeader(column, 'Số tiền'),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => getHeader(column, 'Thời gian giao dịch'),
      cell: ({ row }) => {
        return new Date(row.getValue('updatedAt')).toLocaleString('vi-VN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      },
    },
    {
      accessorKey: 'transactionId',
      header: ({ column }) => getHeader(column, 'Loại giao dịch'),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => getHeader(column, 'Trạng thái'),
        cell: ({ row }) => {
        const status = row.getValue('status');
        const statusMap = {
            'READY': 'Công khai',
            'HIDING': 'Ẩn',
            'DESIGNING': 'Nháp'
        };
        return statusMap[status as keyof typeof statusMap] || status;
        }
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
  
  function getHeader(column: Column<TeamMember>, label: string) {
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
  
  const navigateToCreate = () => {
    router.push('/users/create')
  }
  
  onMounted(async () => {
    await rolesStore.fetchRoles()
    fetchTeamMembers()
  })
  </script>
  