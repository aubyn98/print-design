<template>
  <div
    class="widgets"
    :contenteditable="!!val.isEdit"
    :style="{
      width: val.width + 'px',
      minHeight: val.height + 'px',
      fontSize: val.style.FontSize + 'pt',
      color: val.style.FontColor,
    }"
    @blur="e => updateText(/* e, val.uuid */)"
    v-html="val.value"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ControlsHtml',
  props: {
    val: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    updateText(/* e, uuid */) {
      // let text = e.target.innerHTML
    },
  },
})
</script>
