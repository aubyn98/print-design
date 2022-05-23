<template>
  <svg class="svg-icon" :style="{ fontSize: size, ...(fill && { fill: color }) }" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
defineProps({
  name: String,
  color: { type: String, default: '#505050' },
  size: { type: String, default: '24px' },
  fill: {
    type: Boolean,
    default: true,
  },
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
}
</style>
