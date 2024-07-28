<script lang="ts" setup>
const emit=defineEmits(['gameMode','showModeModal'])

</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
    <div class="bg-[#061a32] flex flex-col gap-4  p-8 rounded-lg">
      <h2 class="text-4xl font-bold">
        Select Mode
      </h2>
     <div  class="flex flex-col gap-4">
       <button @click="()=>{
        emit('gameMode','pvp')
        emit('showModeModal',false)
       }" class="bg-blue-500 text-white px-4 py-2 rounded"> Player Vs Player</button>
      <button @click="
      emit('gameMode','pvc'),
      emit('showModeModal',false)
      " class="bg-blue-500 text-white px-4 py-2 rounded"> Player Vs Computer</button>

      </div>

    </div>
    
  </div>
</template>