<template>
  <button
    @click="googleSignin"
    class="mb-1 w-full cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
  >
    Sign in with Google
  </button>
</template>

<script lang="ts">
import signin from "./signin";
export default signin;
</script>
