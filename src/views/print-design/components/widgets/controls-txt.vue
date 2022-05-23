<template>
  <div
    class="widgets"
    :style="{
      width: val.width + 'px',
      minHeight: val.height + 'px',
      fontSize: val.style.FontSize + 'pt',
      color: val.style.FontColor,
      textAlign: val.style.Alignment,
      fontWeight: val.style.Bold ? 'bold' : 'normal',
      fontFamily: val.style.FontName,
    }"
  >
    {{ val.value }}
  </div>
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
})
</script>
