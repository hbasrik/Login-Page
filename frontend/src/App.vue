<template>
  <RouterView :key="viewKey" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const viewKey = ref(Date.now())

watch(
  () => route.fullPath,
  () => {
    viewKey.value = Date.now()
  },
)
</script>
