<script setup lang="ts">

defineProps({
  hover: Boolean,
  firstMove: Boolean

})

</script>

<template>
  <div class='bg-slate-700 p-4 rounded-xl relative flex justify-center items-center flex-col ' :class="(hover ? 'cursor-pointer hover:opacity-75 ' : '') + (firstMove ? ' animate-pulse ' : '')">
    <slot>
    </slot>
  </div>
</template>