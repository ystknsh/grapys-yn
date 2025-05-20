<template>
  <div class="item-center mb-2 flex space-x-1">
    <input type="password" v-model="apiKey" class="h-8 w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-black" placeholder="API Key" />
    <div>
      <button @click="save" class="h-8 cursor-pointer items-center rounded-full bg-sky-500 px-2 py-1 text-sm text-white hover:bg-sky-700">Save</button>
    </div>
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
