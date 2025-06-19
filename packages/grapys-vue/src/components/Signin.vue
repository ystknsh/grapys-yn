<template>
  <div class="mt-10 text-center flex justify-center">
    <div class="w-64">
      <SigninButton />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SigninButton from "./SigninButton.vue";
import signin from "./signin";

export default defineComponent({
  components: {
    SigninButton,
  },
  ...signin as any,
});
</script>
