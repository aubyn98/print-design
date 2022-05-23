<template>
  <div
    class="widgets"
    :style="{
      width: val.width + 'px',
      height: val.height + 'px',
    }"
  >
    <img class="controls-image" :title="val.title" :src="val.value || val.defaultValue" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ControlsImage',
  props: {
    val: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    imageUrl() {
      return this.val.value
    },
  },
  watch: {
    val(newVal) {
      this.imageUrl = newVal.value
    },
  },
})
</script>

<style scoped>
.controls-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}
</style>
