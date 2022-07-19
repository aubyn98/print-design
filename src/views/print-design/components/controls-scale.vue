<template>
  <div class="controls_scale select-none flex-y-center">
    <el-icon @click="substract"><minus /></el-icon>
    <span class="margin-lr-12">{{ multiply(scale, 100) }}%</span>
    <el-icon @click="addHandle"><plus /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { add, subtract, multiply } from 'utils'
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits(['change', 'update:modelValue'])
const scale = useVModel(props)
function substract() {
  if (scale.value > 0.5) {
    scale.value = subtract(scale.value, 0.1)
    emit('change')
  }
}
function addHandle() {
  if (scale.value < 4) {
    scale.value = add(scale.value, 0.1)
    emit('change')
  }
}
</script>

<style lang="scss" scoped>
.controls_scale {
  position: absolute;
  right: 234px;
  top: 30px;
  width: 96px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  padding: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
