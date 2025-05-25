<template>
  <button @click="$emit('click')" :disabled="disabled" :type="type" :class="buttonClasses">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { PropType } from "vue";

type ColorVariant = "primary" | "danger";
type RoundedVariant = "none" | "left" | "right" | "full";

export default defineComponent({
  name: "SideMenuButton",
  emits: ["click"],
  props: {
    variant: {
      type: String as PropType<ColorVariant>,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: String as PropType<RoundedVariant>,
      default: "full",
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "button",
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const colorVariants = {
      primary: {
        default: "bg-sky-500",
        hover: "hover:bg-sky-700",
        disabled: "bg-sky-200",
      },
      danger: {
        default: "bg-red-400",
        hover: "hover:bg-red-500",
        disabled: "bg-red-200",
      },
    };

    const roundedClasses = {
      none: "",
      left: "rounded-l-full",
      right: "rounded-r-full",
      full: "rounded-full",
    };

    const buttonClasses = computed(() => [
      // ベースクラス
      "px-4 py-2 mb-1 text-sm font-medium text-white transition-colors duration-200 cursor-pointer items-center",
      // 幅
      props.fullWidth ? "w-full" : "",
      // 角丸
      roundedClasses[props.rounded],
      // 状態別カラー
      props.disabled
        ? `cursor-not-allowed ${colorVariants[props.variant].disabled}`
        : `${colorVariants[props.variant].default} ${colorVariants[props.variant].hover}`,
      // カスタムクラス
      props.customClass,
    ]);

    return {
      buttonClasses,
    };
  },
});
</script>
