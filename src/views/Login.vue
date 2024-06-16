<script setup lang="ts">
import MatrixModal from '../components/MatrixModal.vue'
</script>
<template>
  <MatrixModal>
    <form class="login-box p-8 flex flex-col gap-4">
      <fieldset class="flex flex-col gap-2">
        <label for="username">Username</label>
        <input class="bg-slate-900 rounded p-4" type="text" id="username" name="username" />
      </fieldset>
      <fieldset class="flex flex-col gap-2">
        <label for="password">Password</label>
        <input class="bg-slate-900 rounded p-4" type="password" id="password" name="password" />
      </fieldset>
    </form>
  </MatrixModal>
</template>
<style scoped>
.login-box input {
  /* background: var(--background); */
  border-radius: 8px;
  height: 40px;
  padding: 10px 16px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.login-box input:hover,
.login-box input:focus {
  /* background: white; */
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 0 0 3px rgb(22, 163, 74, 0.4);
}
.login-box input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(22, 163, 74, 1);
}
</style>
