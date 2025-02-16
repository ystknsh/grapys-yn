<template>
  <div class="layout">
    <div class="bg-warmgray-400 bg-opacity-20 flex min-h-screen flex-col">
      <div class="w-full flex-1">
        <div class="bg-blue-300">
          <div class="relative flex items-center">
            <div @click="toggleMenu()" class="inline-flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center">
              <span class="material-icons text-warmgray-900 text-opacity-60">menu</span>
            </div>
            <div class="w-full items-center">GraphAI Demo</div>
            <div v-show="menu" class="fixed top-0 left-0 z-30 flex h-screen w-screen">
              <div class="bg-warmgray-100 flex w-64 flex-col bg-white shadow-sm"></div>
              <div @click="toggleMenu()" class="flex-1 cursor-pointer bg-black/40"></div>
            </div>
          </div>
        </div>
        <div class="top-0 w-full sm:relative">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// import { useI18nParam } from "@/i18n/utils";

// import Languages from "@/components/Languages.vue";
// import MenuList from "./MenuList.vue";

export default defineComponent({
  name: "AppLayout",
  components: {
    // Languages,
    // MenuList,
  },
  setup() {
    const menu = ref(false);

    //    useI18nParam();

    const toggleMenu = () => {
      menu.value = !menu.value;
    };
    return {
      menu,
      toggleMenu,
    };
  },
});
</script>
