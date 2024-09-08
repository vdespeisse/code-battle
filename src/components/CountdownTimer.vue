<script setup lang="ts">
import { ref, onMounted } from 'vue'
const timeElapsed = ref(4)
onMounted(() => {
  timeElapsed.value = 3
  const timer = setInterval(() => {
    timeElapsed.value--
    if (timeElapsed.value < 1) {
      clearInterval(timer)
    }
  }, 1000)
})
</script>
<template>
  <div class="countdown-timer h-20 flex flex-row items-center justify-center">
    <Transition name="pop">
      <div v-if="timeElapsed === 1">1</div>
    </Transition>
    <Transition name="pop">
      <div v-if="timeElapsed === 2">2</div>
    </Transition>
    <Transition name="pop">
      <div v-if="timeElapsed === 3">3</div>
    </Transition>
  </div>
</template>
<style scoped>
.pop-enter-active {
  transition: transform 1s ease;
}
.pop-leave-active {
  display: none;
}

.pop-enter-to {
  transform: scale(3);
}
</style>
