<template>
    <div class="login-container">
      <div class="login-box">
        <img src="@/assets/icon.png" alt="Login Image" class="login-image" />
        <h2>Please sign in</h2>
        <form @submit.prevent="handleSubmit">
          <div class="input-container">
            <input
              type="email"
              placeholder="E-mail address"
              v-model="email"
              required
            />
          </div>
          <div class="input-container">
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              required
            />
          </div>
          <div class="sign-button">
            <button type="submit" :disabled="loading">
              {{ loading ? "Signing in..." : "Sign in" }}
            </button>
          </div>
          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { auth } from '..//firebase/firebase'
  
  
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const errorMessage = ref('')
  const router = useRouter()
  
  const handleSubmit = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      
    } catch (error) {
      errorMessage.value = error.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0b0b28;
  }
  
  .login-box {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    width: 380px;
  }
  
  .login-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  h2 {
    color: #8e8eb9;
    margin-bottom: 20px;
  }
  
  input[type="email"],
  input[type="password"] {
    font-size: 18px;
    width: 90%;
    padding: 1rem;
    border-radius: .5rem .5rem 0 0;
    border: 1px solid #8b7591;
    background-color: #252548;
    color: #fff;
    outline: none;
    margin-bottom: 12px;
  }
  
  input[type="password"] {
    border-radius: 0 0 .5rem .5rem;
  }
  
  input:focus {
    border: 1px solid rgb(126, 7, 126);
    box-shadow: 0 0 5px rgb(126, 7, 126);
  }
  
  input::placeholder {
    color: #aaa;
  }
  
  button {
    font-weight: 600;
    margin-top: .5rem;
    font-size: 18px;
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: .5rem;
    background-color: #4169e1;
    color: #fff;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #3659c6;
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .error-msg {
    margin-top: 12px;
    color: #f66;
  }
  </style>
  