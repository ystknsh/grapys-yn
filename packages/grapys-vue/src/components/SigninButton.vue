<template>
  <button @click="googleSignin" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Signin with Google</button>
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
