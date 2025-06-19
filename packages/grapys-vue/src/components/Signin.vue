<template>
  <div class="mt-10 flex justify-center text-center">
    <div class="w-64">
      <SigninButton />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SigninButton from "./SigninButton.vue";
import { googleSignin } from "../utils/firebase/SocialLogin";

export default defineComponent({
  name: "Signin",
  components: {
    SigninButton,
  },
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
