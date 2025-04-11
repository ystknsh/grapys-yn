<template>
  <div class="layout">
    <div class="bg-warmgray-400 bg-opacity-20 flex min-h-screen flex-col">
      <div class="w-full flex-1">
        <div class="bg-blue-300">
          <div class="relative flex items-center">
            <div class="w-full items-center">GraphAI <span @click="logout">Demo</span></div>
          </div>
        </div>
        <div class="top-0 w-full sm:relative">
          <div v-if="enableFirebase">
            <div v-if="isSignedIn === null">
              loading...
            </div>
            <div v-if="isSignedIn === true">
              <router-view />
            </div>
            <div v-if="isSignedIn === false">
              <Signin />
            </div>
          </div>
          <div v-else>
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Signin from "./Signin.vue";
import { auth } from "../utils/firebase/firebase";
import { signOut } from "firebase/auth";
import { enableFirebase } from "../config/project";

export default defineComponent({
  name: "AppLayout",
  components: {
    Signin
  },
  setup() {
    const menu = ref(false);
    const isSignedIn = ref<boolean | null>(null);

    onMounted(() => {
      auth.onAuthStateChanged((fbuser) => {
        if (fbuser) {
          console.log("authStateChanged:");
          isSignedIn.value = true;
        } else {
          isSignedIn.value = false;
        }
      });
    });

    const toggleMenu = () => {
      menu.value = !menu.value;
    };
    const logout = () => {
      signOut(auth);
    };
    
    return {
      menu,
      toggleMenu,
      isSignedIn,
      logout,
    };
  },
});
</script>
