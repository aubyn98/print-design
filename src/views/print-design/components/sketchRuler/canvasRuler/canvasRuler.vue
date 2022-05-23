<template>
  <canvas ref="$canvas" class="ruler" @click="handleClick" @mouseenter="handleEnter" @mousemove="handleMove" @mouseleave="handleLeave" />
</template>

<script lang="ts">
export default {
  name: 'CanvasRuler',
}
</script>
<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from 'vue'
import { drawHorizontalRuler, drawVerticalRuler, CanvasConfigs } from './utils'
const getValueByOffset = (offset: number, start: number, scale: number) => Math.round(start + offset / scale)

const props = defineProps<{
  vertical: boolean
  start: number
  scale: number
  width: number
  height: number
  canvasConfigs: CanvasConfigs
  selectStart: number
  selectLength: number
}>()
const { start, selectLength, width, height } = toRefs(props)
const emit = defineEmits(['onAddLine', 'onIndicatorShow', 'onIndicatorMove', 'onIndicatorHide'])

const $canvas = ref<HTMLCanvasElement>()
const canvasContext = ref<CanvasRenderingContext2D | null>(null)

watch([start, selectLength], () => {
  drawRuler()
})
watch([width, height], () => {
  updateCanvasContext()
  drawRuler()
})
onMounted(() => {
  initCanvasRef()
  updateCanvasContext()
  drawRuler()
})

function initCanvasRef() {
  if ($canvas.value) canvasContext.value = $canvas.value.getContext('2d')
}
function updateCanvasContext() {
  const { ratio } = props.canvasConfigs
  const canvas = $canvas.value
  if (!canvas) return
  // 比例宽高
  canvas.width = width.value * ratio
  canvas.height = height.value * ratio

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.font = `${12 * ratio}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
  ctx.lineWidth = 1
  ctx.textBaseline = 'middle'
}
function drawRuler() {
  const options = {
    scale: props.scale,
    width: width.value,
    height: height.value,
    canvasConfigs: props.canvasConfigs,
  }
  const ctx = canvasContext.value
  if (!ctx) return
  if (props.vertical) {
    drawVerticalRuler(ctx, start.value, { y: props.selectStart, height: selectLength.value }, options)
  } else {
    drawHorizontalRuler(ctx, start.value, { x: props.selectStart, width: selectLength.value }, options)
  }
}
function handleClick(e: MouseEvent) {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, start.value, props.scale)
  emit('onAddLine', value)
}
function handleEnter(e: MouseEvent) {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, start.value, props.scale)
  emit('onIndicatorShow', value)
}
function handleMove(e: MouseEvent) {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, start.value, props.scale)
  emit('onIndicatorMove', value)
}
function handleLeave() {
  emit('onIndicatorHide')
}
</script>
