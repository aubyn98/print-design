<template>
  <div v-show="showLine" class="line" :style="[offset, border]">
    <div class="action" :style="actionStyle">
      <span class="del" @click="handleRemove">
        <el-icon><close /></el-icon>
      </span>
      <span class="value select-none">{{ startValue }}</span>
    </div>
    <div class="move" :style="cursor" @mousedown="handleDown"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LineRuler',
}
</script>
<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { Palette } from './canvasRuler/utils'

const props = defineProps<{
  index: number
  start: number
  vertical: boolean
  scale: number
  value: number
  palette: Palette
  isShowReferLine: boolean
  thick: number
}>()
const emit = defineEmits(['onMouseDown', 'onRelease', 'onRemove'])

const startValue = ref(0)
const showLine = ref(true)

const offset = computed(() => {
  const offset = (startValue.value - props.start) * props.scale
  changeShowLine(offset < 0 ? false : true)
  const positionValue = offset + 'px'
  return props.vertical ? { top: positionValue } : { left: positionValue }
})
const border = computed(() => {
  const borderValue = `1px solid ${props.palette.lineColor}`
  return props.vertical ? { borderTop: borderValue } : { borderLeft: borderValue }
})
const cursor = computed(() => {
  const cursorValue = /* props.isShowReferLine ? */ props.vertical ? 'ns-resize' : 'ew-resize' /* : 'none' */
  return {
    cursor: cursorValue,
  }
})
const actionStyle = computed(() => {
  const actionStyle = props.vertical ? { left: props.thick / 2 + 'px' } : { top: props.thick / 2 + 'px' }
  return actionStyle
})

onMounted(() => {
  initStartValue()
})

function changeShowLine(val: boolean) {
  showLine.value = val
}
function handleDown(e: MouseEvent) {
  const startD = props.vertical ? e.clientY : e.clientX
  const initValue = startValue.value
  emit('onMouseDown')
  const onMove = (e: MouseEvent) => {
    const currentD = props.vertical ? e.clientY : e.clientX
    const newValue = Math.round(initValue + (currentD - startD) / props.scale)
    startValue.value = newValue
  }
  const stopMoveEvent = useEventListener(document, 'mousemove', onMove)
  const stopUpEvent = useEventListener(document, 'mouseup', () => {
    emit('onRelease', startValue.value, props.index)
    stopMoveEvent()
    stopUpEvent()
  })
}
function handleRemove() {
  emit('onRemove', props.index)
}
function initStartValue() {
  startValue.value = props.value
}
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
  .action {
    position: absolute;
    display: flex;
    color: $clr-orange;
  }

  .value {
    white-space: nowrap;
    flex-shrink: 0;
    pointer-events: none;
    transform: scale(0.83);
  }
  .del {
    line-height: 0;
    font-size: 10px;
    flex-shrink: 0;
    cursor: pointer;
  }
  &:hover .del {
    visibility: visible;
  }
  .move {
    position: absolute;

    background: #fa742b;
  }
}
.h-container {
  .line {
    height: 100vh;
    top: 0;
    padding-left: 5px;
    .action {
      width: 20px;
      justify-content: space-between;
      align-items: center;
      transform: translateX(-24px);
      text-align: right;
      .value {
        width: 10px;
        padding-left: 5px;
        margin-left: 4px;
      }
      .del {
        width: 15px;
      }
    }
    .move {
      width: 3px;
      left: -2px;
      height: 20px;
      top: 36px;
    }
  }
}

.v-container {
  .line {
    width: 100vw;
    left: 0;
    padding-top: 5px;
    .action {
      height: 30px;
      justify-content: center;
      flex-direction: column;
      transform: translateY(-24px);
      .value {
        height: 15px;
        padding-top: 5px;
        margin-top: 4px;
      }
      .del {
        padding-top: 6px;
        height: 15px;
      }
    }
    .move {
      width: 20px;
      left: 36px;
      height: 3px;
      top: -2px;
    }
  }
}
</style>
