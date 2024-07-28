<script setup lang="ts">

defineProps(
  {
    currentPlayer: String,
    handleReset: Function
  }
)

</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
    <div class="bg-[#061a32] p-8 flex flex-col gap-4 rounded-lg">
      <h2 class="text-4xl font-bold">
        {{ currentPlayer }} wins!
      </h2>

      <button @click="$emit('handleReset'), $emit('showWinnerModal',false)" class="bg-blue-500 text-white px-4 py-2 rounded">Close</button>

    </div>
    
  </div>

</template>