<script setup lang="ts">
import { onMounted, ref } from 'vue'
const canvasRef = ref()
onMounted(() => {
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')
  const W = window.innerWidth
  const H = window.innerHeight
  context.fillRect(0, 0, W, H)

  canvas.width = W
  canvas.height = H

  const fontSize = 12

  const columns = Math.floor(W / fontSize)
  const drops: number[] = []
  for (let i = 0; i < columns; i++) {
    drops.push(0)
  }
  const str = '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯABCDEF0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ'
  function draw() {
    context.fillStyle = 'rgba(0,0,0,0.05)'
    context.fillRect(0, 0, W, H)

    context.font = '700 ' + fontSize + 'px' + ' sans-serif'
    // context.font = '700 ' + fontSize + 'px'
    context.fillStyle = 'rgb(34 197 94)'
    for (let i = 0; i < columns; i++) {
      const index = Math.floor(Math.random() * str.length)
      const x = i * fontSize
      const y = drops[i] * fontSize
      context.fillText(str[index], x, y)
      if (y >= canvas.height && Math.random() > 0.99) {
        drops[i] = 0
      }
      drops[i]++
    }
  }
  draw()
  setInterval(draw, 60)
})
</script>
<template>
  <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
    <canvas ref="canvasRef" class="inset-0"></canvas>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
        <div
          class="relative text-beige transform overflow-hidden rounded-lg bg-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* .matrix-bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}
.content {
  z-index: 1;
} */
</style>
