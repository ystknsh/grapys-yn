<template>
  <input type="password" v-model="apiKey" class="w-full rounded-md border-2 border-gray-300 px-2 py-1 text-black mb-1" :placeholder="keyName" />
  <div>
    <button @click="save" class="cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-700 mb-1">Save Key</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    storageKey: {
      type: String,
      required: true,
    },
    keyName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const apiKey = ref("");
    const keyName = props.storageKey;

    const save = () => {
      window.localStorage.setItem(keyName, apiKey.value);
    };

    const load = () => {
      const data = window.localStorage.getItem(keyName);
      if (data) {
        apiKey.value = data;
      }
    };
    load();
    return {
      apiKey,
      save,
    };
  },
});
</script>
