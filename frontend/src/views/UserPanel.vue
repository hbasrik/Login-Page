<template>
  <div class="dashboard">
    <div class="header">
      <button @click="goHome">
        <img src="@/assets/icon.png" alt="Logo" class="logo" />
      </button>
      <div class="profile-dropdown">
        <button @click="toggleDropdown" class="profile-button">
          <i class="fas fa-user profile-icon"></i>
          <span class="dropdown-icon text-[8px]">&#x25BC;</span>
        </button>
        <div v-if="showDropdown" class="dropdown-menu">
          <button
            class="hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="hidden md:grid grid-cols-6 justify-between p-1 text-xl">
        <div>
          <p>Parameter Key</p>
        </div>
        <div>
          <p>Value</p>
        </div>
        <div class="col-span-2">
          <p>Description</p>
        </div>
        <div class="flex gap-2 items-center">
          <p>Create Date</p>
          <i class="fa-solid fa-arrow-down"></i>
        </div>
        <div>
          <p></p>
        </div>
      </div>

      <div
        v-for="(parameter, index) in parameters"
        :key="index"
        class="rounded-lg border-2 border-white-500 md:grid md:border-none grid-cols-6 items-center"
      >
        <div class="md:grid grid-cols-5 justify-between col-span-5 items-center p-1">
          <div class="">
            <p v-if="!parameter.isEditing">
              <strong class="md:hidden text-white">Parameter Key:</strong> {{ parameter.key }}
            </p>
            <input
              v-if="parameter.isEditing"
              v-model="parameter.editKey"
              placeholder="New Parameter"
              class="w-full rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          <div class="">
            <p v-if="!parameter.isEditing">
              <strong class="md:hidden text-white">Value:</strong> {{ parameter.value }}
            </p>
            <input
              type="number"
              v-if="parameter.isEditing"
              v-model="parameter.editValue"
              placeholder="Value"
              class="w-full rounded bg-gray-800 border border-gray-600 text-white no-spinner"
            />
          </div>

          <div class="col-span-2">
            <p v-if="!parameter.isEditing">
              <strong class="text-white md:hidden">Description:</strong> {{ parameter.description }}
            </p>
            <input
              v-if="parameter.isEditing"
              v-model="parameter.editDescription"
              placeholder="Description"
              class="w-full rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>
          <div class="col-span-1">
            <p class="text-white">
              <strong class="md:hidden">Create Date:</strong> {{ formatDate(parameter.createDate) }}
            </p>
          </div>
        </div>

        <div
          class="flex col-span-1 justify-center md:justify-start gap-2 py-2 max-h-[60px] items-end"
        >
          <template v-if="parameter.isEditing">
            <button
              @click="saveEdit(parameter)"
              class="bg-green-600 text-white px-4 py-1 rounded transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
            </button>
            <button
              @click="cancelEdit(parameter)"
              class="bg-gray-600 text-white px-4 py-1 rounded transition duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </template>

          <template v-else>
            <button
              @click="editParameter(parameter)"
              class="bg-blue-600 text-white px-4 py-1 rounded transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Edit
            </button>
            <button
              @click="deleteParameter(parameter.id)"
              class="bg-red-500 text-white px-4 py-1 rounded transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <span class="hidden md:inline">Delete</span>
              <span class="inline md:hidden">Del</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="rounded-lg md:grid grid-cols-6 mt-4 text-sm text-center md:text-start">
      <div class="mb-2">
        <input
          v-model="newParameter.key"
          placeholder="New Parameter"
          class="w-full rounded bg-gray-800 border border-gray-600 text-white p-2.5"
        />
      </div>

      <div class="mb-2">
        <input
          type="number"
          v-model="newParameter.value"
          placeholder="Value"
          class="w-full rounded bg-gray-800 border border-gray-600 text-white p-2.5 no-spinner"
        />
      </div>

      <div class="mb-2 col-span-3">
        <input
          v-model="newParameter.description"
          placeholder="Description"
          class="w-full rounded bg-gray-800 border border-gray-600 text-white p-2.5"
        />
      </div>

      <div class="flex gap-2 py-1 justify-center md:justify-start">
        <button
          @click="addParameter"
          class="bg-cyan-600 text-white px-4 rounded transition duration-200 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          ADD
        </button>
      </div>
    </div>
    <div class="grid-cols-6 grid justify-start">
      <div
        v-if="alert.visible"
        :class="[
          'fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full rounded shadow-lg px-6 py-4 text-white transition-opacity duration-300',
          alert.type === 'success'
            ? 'bg-green-600'
            : alert.type === 'error'
              ? 'bg-red-600'
              : 'bg-gray-800',
        ]"
      >
        <strong class="block text-lg mb-1">{{ alert.title }}</strong>
        <span>{{ alert.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/firebase/firebase'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const viewKey = ref(Date.now())
const errors = ref({
  key: '',
  value: '',
  description: '',
})

const alert = ref({
  visible: false,
  type: 'success',
  title: '',
  message: '',
})
let alertTimeout = null

const showAlert = ({ type = 'success', title = '', message = '' }) => {
  alert.value = { visible: true, type, title, message }
  if (alertTimeout) clearTimeout(alertTimeout)
  alertTimeout = setTimeout(() => {
    alert.value.visible = false
  }, 2000)
}

const showDropdown = ref(false)
const parameters = ref([])
const newParameter = ref({
  key: '',
  value: '',
  description: '',
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const d = date.toLocaleDateString('en-GB')
  const t = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${d} ${t}`
}

const addParameter = async () => {
  errors.value = { key: '', value: '', description: '' }
  let hasError = false

  if (!newParameter.value.key.trim()) {
    errors.value.key = 'Parameter key is required.'
    hasError = true
  }
  if (!newParameter.value.value.toString().trim()) {
    errors.value.value = 'Value is required.'
    hasError = true
  }
  if (!newParameter.value.description.trim()) {
    errors.value.description = 'Description is required.'
    hasError = true
  }

  if (hasError) {
    showAlert({
      type: 'error',
      title: 'Validation Error',
      message: 'Please fill in all required fields.',
    })
    return
  }

  try {
    const now = new Date()
    const datePart = now.toLocaleDateString('en-GB')
    const timePart = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const formattedNow = `${datePart} ${timePart}`

    const user = auth.currentUser
    const idToken = await user.getIdToken()

    const response = await api.post(
      '/config',
      {
        key: newParameter.value.key,
        value: newParameter.value.value,
        description: newParameter.value.description,
        updatedAt: now,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )

    parameters.value.push({
      id: response.data.id,
      key: newParameter.value.key,
      value: newParameter.value.value,
      description: newParameter.value.description,
      createDate: formattedNow,
      updatedAt: formattedNow,
    })

    newParameter.value = { key: '', value: '', description: '' }
    showAlert({ type: 'success', title: 'Success', message: 'Parameter added successfully.' })
  } catch (error) {
    console.error('Error while adding parameter!', error)
    showAlert({ type: 'error', title: 'Add Error', message: 'Failed to add parameter.' })
  }
}

const editParameter = (parameter) => {
  parameter.isEditing = true
  parameter.editKey = parameter.key
  parameter.editValue = parameter.value
  parameter.editDescription = parameter.description
}

const cancelEdit = (parameter) => {
  parameter.editKey = parameter.key
  parameter.editValue = parameter.value
  parameter.editDescription = parameter.description
  parameter.isEditing = false
  errors.value = { key: '', value: '', description: '' }
}

const saveEdit = async (parameter) => {
  let hasError = false
  errors.value = { key: '', value: '', description: '' }

  if (!parameter.editKey.trim()) {
    errors.value.key = 'Parameter key is required.'
    hasError = true
  }
  if (!parameter.editValue.toString().trim()) {
    errors.value.value = 'Value is required.'
    hasError = true
  }
  if (!parameter.editDescription.trim()) {
    errors.value.description = 'Description is required.'
    hasError = true
  }

  if (hasError) {
    showAlert({
      type: 'error',
      title: 'Validation Error',
      message: 'Please fill in all required fields.',
    })
    return
  }

  try {
    const user = auth.currentUser
    const idToken = await user.getIdToken()
    const response = await api.patch(
      `/config/${parameter.id}`,
      {
        key: parameter.editKey,
        value: parameter.editValue,
        description: parameter.editDescription,
        updatedAt: parameter.updatedAt,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )

    parameter.key = parameter.editKey
    parameter.value = parameter.editValue
    parameter.description = parameter.editDescription
    parameter.updatedAt = response.data.updatedAt
    parameter.isEditing = false

    showAlert({
      type: 'success',
      title: 'Success',
      message: 'Parameter updated successfully.',
    })
  } catch (error) {
    console.error('Update failed:', error)

    if (error.response?.status === 409) {
      showAlert({
        type: 'error',
        title: 'Conflict Error',
        message: 'This parameter was updated by another user. Please refresh and try again.',
      })
    } else {
      showAlert({
        type: 'error',
        title: 'Update Error',
        message: 'Failed to update parameter.',
      })
    }
  }
}

const deleteParameter = async (id) => {
  try {
    const user = auth.currentUser
    const idToken = await user.getIdToken()

    await api.delete(`/config/${id}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    parameters.value = parameters.value.filter((param) => param.id !== id)

    showAlert({ type: 'success', title: 'Deleted', message: 'Parameter deleted successfully.' })
  } catch (error) {
    console.error('Delete failed:', error)
    showAlert({ type: 'error', title: 'Delete Error', message: 'Failed to delete parameter.' })
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const logout = async () => {
  await auth.signOut()
  router.push('/signin')
}

onMounted(async () => {
  parameters.value.forEach((param) => {
    param.isEditing = false
    param.editKey = ''
    param.editValue = ''
    param.editDescription = ''
  })

  newParameter.value = { key: '', value: '', description: '' }
  errors.value = { key: '', value: '', description: '' }

  try {
    const user = auth.currentUser
    const idToken = await user.getIdToken()
    const response = await api.get('/config', {
      headers: { Authorization: `Bearer ${idToken}` },
    })
    parameters.value = response.data.parameters
  } catch (error) {
    console.error('Error fetching config:', error)
    showAlert({
      type: 'error',
      title: 'Fetch Error',
      message: 'Failed to load parameters.',
    })
  }
})

const goHome = () => {
  parameters.value.forEach((param) => {
    param.isEditing = false
    param.editKey = ''
    param.editValue = ''
    param.editDescription = ''
  })
  newParameter.value = { key: '', value: '', description: '' }
  errors.value = { key: '', value: '', description: '' }
}
</script>

<style scoped>
.dashboard {
  background: linear-gradient(to top, #1b222c 0%, #0e1939 100%);
  color: #e5eaf5;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  color: #ccc;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
}

.logo {
  height: 2rem;
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.profile-icon {
  margin-right: 5px;
  font-size: 18px;
}

.dropdown-icon {
  margin-left: 4px;
}

button {
  cursor: pointer;
  height: 2rem;
}
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #252548;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.dropdown-menu button {
  background: none;
  border: none;
  border-radius: 5%;
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  text-align: left;
  width: 100%;
}

.dropdown-menu button:hover {
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.5);
}

.dropdown-menu button:focus {
  box-shadow: 0 0 0 2px #3f3f5d;
}

.actions {
  display: flex;
  gap: 5px;
}

input {
  padding: 0.5rem;
  width: 90%;
  border-radius: 0.5rem;
  border: 1px solid #8b7591;
  background: none;
  color: #fff;
  outline: none;
}
input:focus {
  border: 1px solid rgb(126, 7, 126);
  box-shadow: 0 0 5px rgb(126, 7, 126);
}

input::placeholder {
  color: #aaa;
}
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
