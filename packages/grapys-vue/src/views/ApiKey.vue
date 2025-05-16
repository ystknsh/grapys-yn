<template>
  <input type="password" v-model="apiKey" class="w-full rounded-md border-2 border-gray-300 px-2 py-1 text-black" :placeholder="keyName" />
  <div>
    <button @click="save" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-700">Save Key</button>
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
