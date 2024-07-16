<script setup lang="ts">
import { computed, toRef } from "vue";

const props = defineProps<{
  className?: string;
  variant?: "default" | "destructive" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
}>();
const size = toRef(props, "size");
const variant = toRef(props, "variant");

const buttonSize = computed(() => {
  switch (size.value) {
    case "sm":
      return "min-w-12 h-6 rounded-md px-3 text-xs";
    case "lg":
      return "min-w-48";
    default:
      return "min-w-38 px-3 py-1.5 rounded-md text-sm";
  }
});

const buttonVariant = computed(() => {
  switch (variant.value) {
    case "destructive":
      return "bg-red-500 text-white hover:bg-red-600 shadow-sm";
    case "secondary":
      return "bg-gray-200 text-black hover:bg-gray-300 shadow-sm";
    case "outline":
      return "border border-gray-200 text-black hover:bg-gray-200";
    default:
      return "bg-black text-white hover:bg-black/90 shadow-sm";
  }
});
</script>

<template>
  <button
    :class="`inline-flex select-none items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${className} ${buttonSize} ${buttonVariant}`"
  >
    <slot></slot>
  </button>
</template>
