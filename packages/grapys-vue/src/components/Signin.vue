<template>
  <div class="mt-10 text-center">
    <a
      class="bg-opacity-5 inline-flex h-12 items-center justify-center rounded-lg bg-blue-400 px-6 shadow-lg hover:bg-blue-600 hover:text-white"
      @click="googleSignin"
    >
      Signin with Google account
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { googleSignin } from "../utils/firebase/SocialLogin";

export default defineComponent({
  name: "AccountPage",
  setup() {
    return {
      googleSignin: googleSignin(
        () => {
          console.log("success");
        },
        (err) => {
          console.log(err.message);
        },
      ),
    };
  },
});
</script>
