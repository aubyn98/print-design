<template>
  <div class="controls_scale select-none flex-y-center">
    <el-icon @click="substract"><minus /></el-icon>
    <span class="margin-lr-12">{{ scale * 100 }}%</span>
    <el-icon @click="add"><plus /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits(['change', 'update:modelValue'])
const scale = useVModel(props)
function substract() {
  if (scale.value >= 1) {
    scale.value -= 0.5
    emit('change')
  }
}
function add() {
  if (scale.value < 4) {
    scale.value += 0.5
    emit('change')
  }
}
</script>

<style lang="scss" scoped>
.controls_scale {
  position: absolute;
  right: 234px;
  top: 30px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  padding: 8px;
  z-index: 10;
}
</style>
