<template>
  <div
    class="widgets"
    :style="{
      width: (isVertical ? 1 : val.width) + 'px',
      height: (isVertical ? val.height : 1) + 'px',
      background: val.style.Background || '#000',
    }"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ControlsTxt',
  props: {
    val: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isVertical() {
      return this.val.direction === 'vertical'
    },
  },
})
</script>
