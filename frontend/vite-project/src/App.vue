<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">
      🧪 Test Orchestra Dashboard
    </h1>

    <button
      @click="fetchHealth"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Check Backend
    </button>

    <p v-if="health" class="mt-4 text-green-600">
      {{ health }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const health = ref<string | null>(null)

async function fetchHealth() {
  const res = await fetch('http://localhost:4000/api/health')
  const data = await res.json()
  health.value = `Backend OK – DB Time: ${data.dbTime}`
}
</script>
