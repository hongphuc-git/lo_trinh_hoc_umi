<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-semibold">
          Users
        </h2>
        <p class="text-sm text-muted-foreground mt-1">
          Manage user accounts and permissions
        </p>
      </div>
      <Button @click="openAddDialog">
        <UserPlus
          class="mr-2 h-4 w-4"
        />
        Add User
      </Button>
    </div>

    <!-- Users DataTable -->
    <DataTable
      ref="dataTableRef"
      :columns="columns"
      :data="users"
      @update:data="fetchUsers"
    />

    <!-- Batch Delete Action -->
    <div
      v-if="selectedUserIds.length > 0"
      class="flex gap-2 p-4 bg-muted rounded-lg border"
    >
      <div class="flex-1 flex items-center gap-2">
        <InfoIcon
          class="h-4 w-4 text-muted-foreground"
        />
        <span class="text-sm text-muted-foreground">
          {{ selectedUserIds.length }} user(s) selected
        </span>
      </div>
      <Button
        variant="destructive"
        :disabled="loading"
        @click="handleBatchDelete"
      >
        <Trash2Icon
          class="mr-2 h-4 w-4"
        />
        Delete Selected
      </Button>
    </div>

    <!-- Add/Edit User Dialog -->
    <Dialog
      v-model:open="showDialog"
    >
      <DialogContent class="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {{ isEditing ? 'Edit User' : 'Add New User' }}
          </DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Update user information and permissions.' : 'Create a new user account with the details below.' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSave">
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel for="username">
                    Username
                  </FieldLabel>
                  <Input
                    id="username"
                    v-model="formData.username"
                    placeholder="Enter username"
                    :disabled="isEditing"
                    autocomplete="off"
                  />
                  <FieldDescription
                    v-if="isEditing"
                  >
                    Username cannot be changed
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel for="name">
                    Full Name
                  </FieldLabel>
                  <Input
                    id="name"
                    v-model="formData.name"
                    placeholder="Enter full name"
                  />
                </Field>

                <Field>
                  <FieldLabel for="email">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    placeholder="Enter email"
                  />
                </Field>

                <Field>
                  <FieldLabel for="password">
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    v-model="formData.password"
                    type="password"
                    :placeholder="isEditing ? 'Leave blank to keep current password' : 'Enter password'"
                    autocomplete="new-password"
                  />
                  <FieldDescription
                    v-if="isEditing"
                  >
                    Only fill this if you want to change the password
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Settings</FieldLegend>
              <FieldGroup>
                <Field>
                  <div class="flex items-center justify-between">
                    <div>
                      <FieldLabel for="isAdmin">
                        Administrator
                      </FieldLabel>
                      <FieldDescription>
                        Mark as an admin user with elevated permissions
                      </FieldDescription>
                    </div>
                    <Switch
                      id="isAdmin"
                      v-model="formData.isAdmin"
                    />
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              :disabled="loading"
              @click="closeDialog"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="loading || !isFormValid"
            >
              <Loader2Icon
                v-if="loading"
                class="mr-2 h-4 w-4 animate-spin"
              />
              {{ isEditing ? 'Save Changes' : 'Create User' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from '@/components/ui/field'
import { toast } from 'vue-sonner'
import DataTable from '@/components/DataTable.vue'
import { createColumns } from './columns'
import type { User } from '#shared/db'
import { InfoIcon, Loader2Icon, Trash2Icon, UserPlus } from 'lucide-vue-next'
import type { ApiResponse } from '~~/server/utils/apiResponse'

const dataTableRef = ref()
const users = ref<User[]>([])
const loading = ref(false)
const showDialog = ref(false)
const editingUserId = ref<number | null>(null)
const defaultFormData = {
  username: '',
  email: '',
  name: '',
  password: '',
  isAdmin: false,
}

const formData = ref({ ...defaultFormData })
const isEditing = computed(() => editingUserId.value !== null)

const isFormValid = computed(() => {
  if (isEditing.value) {
    return formData.value.name!.trim().length > 0 && formData.value.email!.trim().length > 0
  }
  return (
    formData.value.username!.trim().length > 0
    && formData.value.name!.trim().length > 0
    && formData.value.email!.trim().length > 0
    && formData.value.password!.trim().length > 0
  )
})

const selectedUserIds = computed(() => {
  if (!dataTableRef.value?.table) return []
  const selectedRows = dataTableRef.value.table.getFilteredSelectedRowModel().rows
  return selectedRows.map((row: { original: User }) => row.original.id)
})

// Create columns with callbacks
const columns = computed(() => createColumns(handleEdit, handleDeleteConfirm))

async function fetchUsers() {
  try {
    loading.value = true
    const res = await $fetch<ApiResponse<User[]>>('/api/admin/users')
    if (!res.success) throw new Error('Unsuccessful response')
    users.value = res.data
  }
  catch (error) {
    createError({ message: 'Failed to save user', statusCode: 500, data: error })
  }
  finally {
    loading.value = false
  }
}

function openAddDialog() {
  editingUserId.value = null
  resetForm()
  showDialog.value = true
}

function handleEdit(user: User) {
  editingUserId.value = user.id
  formData.value.username = user.username
  formData.value.email = user.email
  formData.value.name = user.name
  formData.value.isAdmin = user.isAdmin
  formData.value.password = user.password
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editingUserId.value = null
  resetForm()
}

function resetForm() {
  formData.value = { ...defaultFormData }
}

async function handleSave() {
  if (!isFormValid.value) return

  try {
    loading.value = true

    if (isEditing.value) {
      await $fetch(`/api/admin/users/${editingUserId.value}`, {
        method: 'PUT',
        body: formData.value,
      })
      toast.success('User updated successfully')
    }
    else {
      // Create new user
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: formData.value,
      })
      toast.success('User created successfully')
    }

    closeDialog()
    await fetchUsers()
  }
  catch (error) {
    createError({ message: 'Failed to save user', statusCode: 500, data: error })
  }
  finally {
    loading.value = false
  }
}

function handleDeleteConfirm(userId: number) {
  const user = users.value.find(u => u.id === userId)
  if (!user) return

  if (confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
    handleDelete(userId)
  }
}

async function handleDelete(userId: number) {
  try {
    loading.value = true
    await $fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    })
    toast.success('User deleted successfully')
    await fetchUsers()
  }
  catch (error) {
    createError({ message: 'Failed to save user', statusCode: 500, data: error })
  }
  finally {
    loading.value = false
  }
}

async function handleBatchDelete() {
  if (selectedUserIds.value.length === 0) return

  const count = selectedUserIds.value.length
  if (!confirm(`Are you sure you want to delete ${count} user(s)? This action cannot be undone.`)) {
    return
  }

  try {
    loading.value = true
    await $fetch('/api/admin/users/delete', {
      method: 'POST',
      body: { userIds: selectedUserIds.value },
    })
    toast.success(`Successfully deleted ${count} user(s)`)

    // Clear selection
    if (dataTableRef.value?.table) {
      dataTableRef.value.table.resetRowSelection()
    }
    await fetchUsers()
  }
  catch (error) {
    createError({ message: 'Failed to save user', statusCode: 500, data: error })
  }
  finally {
    loading.value = false
  }
}

// Fetch users on mount
onMounted(() => {
  fetchUsers()
})
</script>
