<template>
  <div
    class="controls-code"
    :style="{
      width: val.width + 'px',
      height: val.height + 'px',
    }"
  >
    <quick-img :name="codeUrl" />
    <div
      class="text"
      :style="{
        display: val.style.ShowBarText ? '' : 'none',
        fontSize: val.style.FontSize + 'pt',
        fontWeight: val.style.Bold ? 'bold' : 'normal',
      }"
    >
      1234567890
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ControlsCode',
  props: {
    val: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    codeUrl() {
      if (this.val.style.codeType === 'QRCode') {
        return 'QRCode'
      } else if (this.val.style.codeType === 'PDF417') {
        return 'PDF417'
      }
      return 'barCode'
    },
  },
})
</script>
<style lang="scss" scoped>
.controls-code {
  position: relative;
  &:hover {
    outline: 1px solid #ddd !important;
  }
  &.active {
    outline: 1px solid #2196f3 !important;
    &:hover {
      outline: 1px solid #2196f3 !important;
    }
  }
  img {
    width: 100%;
    height: 100%;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }
  .text {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: #ffffff;
  }
}
</style>
