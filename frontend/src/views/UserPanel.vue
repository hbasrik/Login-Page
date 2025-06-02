<template>
  <div class="dashboard">
    <div class="header">
      <img src="@/assets/icon.png" alt="Logo" class="logo" />

      <div class="profile-dropdown">
        <button @click="toggleDropdown" class="profile-button">
          <i class="fas fa-user profile-icon"></i>
          <span class="dropdown-icon">&#x25BC;</span>
        </button>
        <div v-if="showDropdown" class="dropdown-menu">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>

    <!-- <table class="parameters-table">
      <thead>
        <tr>
          <th>Parameter Key</th>
          <th>Value</th>
          <th>Description</th>
          <th>Create Date &#x2193;</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(parameter, index) in parameters" :key="index">
          <td>
            <input
              v-if="parameter.isEditing"
              v-model="parameter.editKey"
              placeholder="New Parameter"
            />
            <span v-else>{{ parameter.key }}</span>
          </td>
          <td>
            <input v-if="parameter.isEditing" v-model="parameter.editValue" placeholder="Value" />
            <span v-else>{{ parameter.value }}</span>
          </td>
          <td>
            <input
              v-if="parameter.isEditing"
              v-model="parameter.editDescription"
              placeholder="Description"
            />
            <span v-else>{{ parameter.description }}</span>
          </td>
          <td>{{ formatDate(parameter.createDate) }}</td>
          <td>
            <div v-if="parameter.isEditing">
              <button @click="saveEdit(parameter)" class="save-button">Save</button>
              <button @click="cancelEdit(parameter)" class="cancel-button">Cancel</button>
            </div>
            <div v-else @click="editParameter(parameter)">
              <button class="edit-button">Edit</button>
              <button @click="deleteParameter(parameter.id)" class="delete-button">Delete</button>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <input v-model="newParameter.key" placeholder="New Parameter" />
          </td>
          <td>
            <input v-model="newParameter.value" placeholder="Value" />
          </td>
          <td>
            <input v-model="newParameter.description" placeholder="Description" />
          </td>

          <td><button @click="addParameter" class="add-button">ADD</button></td>
        </tr>
        <tr>
          <td>
            <p v-if="errors.key" class="error-text">{{ errors.key }}</p>
          </td>
          <td>
            <p v-if="errors.value" class="error-text">{{ errors.value }}</p>
          </td>
          <td>
            <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
          </td>
        </tr>
      </tbody>
    </table> -->
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
        <div>
          <p>Create Date</p>
        </div>
        <div>
          <p></p>
        </div>
      </div>

      <div
        v-for="(parameter, index) in parameters"
        :key="index"
        class="rounded-lg border-2 border-white-500 md:grid md:border-none grid-cols-6"
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
              v-if="parameter.isEditing"
              v-model="parameter.editValue"
              placeholder="Value"
              class="w-full rounded bg-gray-800 border border-gray-600 text-white"
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

        <div class="flex col-span-1 justify-center md:justify-start gap-2 py-2 max-h-[60px]">
          <template v-if="parameter.isEditing">
            <button
              @click="saveEdit(parameter)"
              class="bg-green-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
            </button>
            <button
              @click="cancelEdit(parameter)"
              class="bg-gray-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </template>

          <template v-else>
            <button
              @click="editParameter(parameter)"
              class="bg-blue-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Edit
            </button>
            <button
              @click="deleteParameter(parameter.id)"
              class="bg-red-500 text-white px-4 py-2 rounded transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
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
          v-model="newParameter.value"
          placeholder="Value"
          class="w-full rounded bg-gray-800 border border-gray-600 text-white p-2.5"
        />
      </div>

      <div class="mb-2 col-span-3">
        <input
          v-model="newParameter.description"
          placeholder="Description"
          class="w-full rounded bg-gray-800 border border-gray-600 text-white p-2.5"
        />
      </div>

      <div class="flex gap-2 py-2 max-h-[60px] justify-center md:justify-start">
        <button
          @click="addParameter"
          class="bg-cyan-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
import axios from 'axios'

const router = useRouter()
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
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
    const user = auth.currentUser
    const idToken = await user.getIdToken()

    const response = await axios.post(
      'http://localhost:3000/config',
      {
        key: newParameter.value.key,
        value: newParameter.value.value,
        description: newParameter.value.description,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )

    parameters.value.push({
      key: newParameter.value.key,
      value: newParameter.value.value,
      description: newParameter.value.description,
      createDate: new Date().toISOString(),
    })

    newParameter.value = {
      key: '',
      value: '',
      description: '',
    }

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

    const response = await axios.patch(
      `http://localhost:3000/config/${parameter.id}`,
      {
        key: parameter.editKey,
        value: parameter.editValue,
        description: parameter.editDescription,
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
    parameter.isEditing = false

    showAlert({ type: 'success', title: 'Success', message: 'Parameter updated successfully.' })
  } catch (error) {
    console.error('Update failed:', error)
    showAlert({ type: 'error', title: 'Update Error', message: 'Failed to update parameter.' })
  }
}

const deleteParameter = async (id) => {
  try {
    const user = auth.currentUser
    const idToken = await user.getIdToken()

    await axios.delete(`http://localhost:3000/config/${id}`, {
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
  try {
    const user = auth.currentUser
    const idToken = await user.getIdToken()

    const response = await axios.get('http://localhost:3000/config', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    parameters.value = response.data.parameters
  } catch (error) {
    console.error('Error fetching config:', error)
    showAlert({ type: 'error', title: 'Fetch Error', message: 'Failed to load parameters.' })
  }
})
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
  padding-bottom: 20px;
}

.logo {
  height: 40px;
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
  margin-left: 5px;
}

button {
  cursor: pointer;
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
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  text-align: left;
  width: 100%;
}

.dropdown-menu button:hover {
  background-color: #3a3a5e;
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
  background-color: #252548;
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
</style>
