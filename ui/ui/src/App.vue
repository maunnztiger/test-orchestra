<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Test Orchestra</h1>
    <button
      @click="runHelloWorld"
      class="mt-4 px-4 py-2 bg-green-600 text-white rounded"
    >
      Run Hello World Test
    </button>
    <pre class="mt-4 bg-gray-100 p-4 rounded">{{ message }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const message = ref("Noch nichts ausgeführt.");

    async function runHelloWorld() {
      const res = await fetch("http://localhost:5000/run-test", {
        method: "POST",
      });
      const data = await res.json();
      message.value = `Status: ${data.status}, Result: ${data.result}`;
    }

    return { message, runHelloWorld };
  },
});
</script>

<style>
body {
  font-family: sans-serif;
}
</style>