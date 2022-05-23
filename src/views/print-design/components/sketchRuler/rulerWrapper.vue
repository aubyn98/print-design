<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :vertical="vertical"
      :scale="scale"
      :width="width"
      :height="height"
      :start="start"
      :selectStart="selectStart"
      :selectLength="selectLength"
      :canvasConfigs="canvasConfigs"
      @onAddLine="handleNewLine"
      @onIndicatorShow="handleIndicatorShow"
      @onIndicatorMove="handleIndicatorMove"
      @onIndicatorHide="handleIndicatorHide"
    >
    </CanvasRuler>
    <div v-show="isShowReferLine" class="lines">
      <LineRuler
        v-for="(v, i) in lines"
        :key="v + i"
        :index="i"
        :value="v >> 0"
        :scale="scale"
        :start="start"
        :thick="thick"
        :palette="palette"
        :vertical="vertical"
        :isShowReferLine="isShowReferLine"
        @onRemove="handleLineRemove"
        @onMouseDown="handleLineDown"
        @onRelease="handleLineRelease"
      >
      </LineRuler>
    </div>
    <div v-show="showIndicator" class="indicator" :style="indicatorStyle">
      <div class="value">{{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RulerWrapper',
}
</script>
<script lang="ts" setup>
import LineRuler from './line.vue'
import CanvasRuler from './canvasRuler/canvasRuler.vue'
import { CanvasConfigs, Palette } from './canvasRuler/utils'
import { computed, ref } from 'vue'
const props = defineProps<{
  vertical: boolean
  scale: number
  width: number
  thick: number
  height: number
  start: number
  lines: Array<number>
  selectStart: number
  selectLength: number
  canvasConfigs: CanvasConfigs
  palette: Palette
  isShowReferLine: boolean
  onShowRightMenu?: (...argv: any[]) => void
  handleShowReferLine?: (...argv: any[]) => void
}>()

const emit = defineEmits(['onLineChange', 'update:lines'])

const isDraggingLine = ref(false)
const showIndicator = ref(false)
const value = ref(0)

const rwClassName = computed(() => {
  const className = props.vertical ? 'v-container' : 'h-container'
  return className
})
const rwStyle = computed(() => {
  const thick = props.thick
  const hContainer = {
    width: `calc(100% - ${thick}px)`,
    height: `${thick + 1}px`,
    left: `${thick}` + 'px',
  }
  const vContainer = {
    width: `${thick + 1}px`,
    height: `calc(100% - ${thick}px)`,
    top: `${thick}` + 'px',
  }
  return props.vertical ? vContainer : hContainer
})
/* const lineStyle = computed(() => {
  return {
    borderTop: `1px solid ${props.palette.lineColor}`,
    cursor: props.isShowReferLine ? 'ns-resize' : 'none',
  }
}) */
const indicatorStyle = computed(() => {
  const indicatorOffset = (value.value - props.start) * props.scale
  let positionKey = 'top'
  let boderKey = 'borderLeft'
  positionKey = props.vertical ? 'top' : 'left'
  boderKey = props.vertical ? 'borderBottom' : 'borderLeft'
  return {
    [positionKey]: indicatorOffset + 'px',
    [boderKey]: `1px solid ${props.palette.lineColor}`,
  }
})

function handleNewLine(value: number) {
  const temp = [...props.lines, value]
  emit('update:lines', temp)
  emit('onLineChange', temp, props.vertical)
  // !isShowReferLine && handleShowReferLine()
}
function handleIndicatorShow(val: number) {
  if (!isDraggingLine.value) {
    showIndicator.value = true
    value.value = val
  }
}
function handleIndicatorMove(val: number) {
  if (showIndicator.value) {
    value.value = val
  }
}
function handleIndicatorHide() {
  showIndicator.value = false
}
function handleLineDown() {
  isDraggingLine.value = true
}
function handleLineRelease(value: number, index: number) {
  isDraggingLine.value = false
  // 左右或上下超出时, 删除该条对齐线
  const offset = value - props.start
  const maxOffset = (props.vertical ? props.height : props.width) / props.scale

  const tmepLines = [...props.lines]
  if (offset < 0 || offset > maxOffset) {
    handleLineRemove(index)
  } else {
    tmepLines.splice(index, 1, value)
    emit('update:lines', tmepLines)
    emit('onLineChange', tmepLines, props.vertical)
  }
}
function handleLineRemove(index: number) {
  const tmepLines = [...props.lines]
  tmepLines.splice(index, 1)
  emit('update:lines', tmepLines)
  emit('onLineChange', tmepLines, props.vertical)
}
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
}
.h-container,
.v-container {
  position: absolute;
  .lines {
    pointer-events: auto;
  }
  /* &:hover .lines { // 在标尺上时才更改
    pointer-events: auto;
  } */
}
.h-container {
  top: 0;
  .line {
    height: 100vh;
    top: 0;
    padding-left: 5px;
    .action {
      transform: translateX(-24px);
      .value {
        margin-left: 4px;
      }
    }
  }
  .indicator {
    top: 0;
    height: 100vw;
    .value {
      padding: 0 2px;
      width: auto;
      margin-left: 4px;
      margin-top: 4px;
    }
  }
}

.v-container {
  left: 0;
  .line {
    width: 100vw;
    left: 0;
    padding-top: 5px;
    .action {
      transform: translateY(-24px);
      flex-direction: column;
      .value {
        margin-top: 4px;
      }
    }
  }
  .indicator {
    width: 100vw;
    .value {
      padding: 0 2px;
      width: auto;
      left: 0px;
      margin-left: 2px;
      margin-top: -5px;
      transform-origin: 0 0;
      transform: rotate(-90deg);
    }
  }
}
</style>
