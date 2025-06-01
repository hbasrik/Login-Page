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

    <table class="parameters-table">
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
            <button v-if="parameter.isEditing" @click="saveEdit(parameter)">Save</button>
            <button v-if="parameter.isEditing" @click="cancelEdit(parameter)">Cancel</button>
            <button v-else @click="editParameter(parameter)">Edit</button>
            <button @click="deleteParameter(parameter.id)">Delete</button>
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
          <td></td>
          <td><button @click="addParameter">ADD</button></td>
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
    </table>
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

  if (hasError) return

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

    console.log('Parameter is added.', response.data)

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
  } catch (error) {
    console.error('Error while adding parameter!', error)
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

  if (hasError) return

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
  } catch (error) {
    console.error('Update failed:', error)
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
  } catch (error) {
    console.error('Delete failed:', error)
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
  border-radius: 10px;
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

.parameters-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.parameters-table table tr {
  text-decoration: none !important;
}

.parameters-table th,
.parameters-table td {
  padding: 10px 14px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #444;
  text-decoration: none;
  border-bottom: none;
}

.parameters-table th {
  color: #8b94bc;
}

.actions {
  display: flex;
  gap: 5px;
}

.edit-button,
.delete-button,
.save-button,
.cancel-button,
.add-button {
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}

.edit-button {
  background-color: #3a86ff;
  color: white;
}

.delete-button {
  background-color: #ef476f;
  color: white;
}

.save-button {
  background-color: #28a745;
  color: white;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

input[type='text'] {
  font-size: 18px;
  width: 90%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #8b7591;
  background-color: #252548;
  color: #fff;
  outline: none;
}

.add-parameter-row td:nth-child(1),
.add-parameter-row td:nth-child(2) {
  width: 20%;
}

.add-parameter-row td:nth-child(3) {
  width: 40%;
}

.add-button {
  background-color: #00b4d8;
  color: white;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
