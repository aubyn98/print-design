<template>
  <div id="mb-ruler" class="style-ruler mb-ruler">
    <!-- 水平方向 -->
    <RulerWrapper
      :vertical="false"
      :width="width"
      :height="thick"
      :isShowReferLine="isShowReferLine"
      :thick="thick"
      :start="startX"
      :lines="horLineArr"
      :selectStart="shadow.x"
      :selectLength="shadow.width"
      :scale="scale"
      :palette="palette"
      :canvasConfigs="canvasConfigs"
      @onLineChange="handleLineChange"
      @update:lines="$emit('update:horLineArr', $event)"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :vertical="true"
      :width="thick"
      :height="height"
      :isShowReferLine="isShowReferLine"
      :thick="thick"
      :start="startY"
      :lines="verLineArr"
      :selectStart="shadow.y"
      :selectLength="shadow.height"
      :scale="scale"
      :palette="palette"
      :canvasConfigs="canvasConfigs"
      @onLineChange="handleLineChange"
      @update:lines="$emit('update:verLineArr', $event)"
    />
    <a class="corner" :class="cornerActiveClass" :style="cornerStyle" @click="onCornerClick"></a>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SketchRuler',
}
</script>

<script lang="ts" setup>
import RulerWrapper from './rulerWrapper.vue'
import { DEFAULTMENU, Palette } from './canvasRuler/utils'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    scale: number
    ratio?: number
    thick: number
    width: number
    height: number
    startX: number
    startY: number
    shadow: {
      x: number
      y: number
      width: number
      height: number
    }
    horLineArr: number[]
    verLineArr: number[]
    cornerActive?: boolean
    lang?: string
    isOpenMenuFeature?: boolean
    handleShowRuler?: () => void
    isShowReferLine?: boolean
    handleShowReferLine?: () => void
    palette?: Palette
  }>(),
  {
    scale: 1,
    ratio: window.devicePixelRatio || 1,
    thick: 16,
    startX: 0,
    startY: 0,
    shadow: () => ({
      x: 200,
      y: 100,
      width: 200,
      height: 400,
    }),
    horLineArr: () => [100, 200],
    verLineArr: () => [100, 200],
    isOpenMenuFeature: false,
    handleShowRuler: () => {
      /*  */
    },
    isShowReferLine: true,
    handleShowReferLine: () => {
      /*  */
    },
    palette: () => ({
      bgColor: 'rgba(225,225,225, 0)', // ruler bg color rgba(225,225,225, 0)
      fontColor: '#7D8694', // ruler font color
      shadowColor: '#E8E8E8', // ruler shadow color #E8E8E8   rgba(250,116,43,.3)
      longfgColor: '#BABBBC', // ruler longer mark color
      shortfgColor: '#C8CDD0', // ruler shorter mark color
      lineColor: '#fa742b',
      borderColor: '#DADADC',
      cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
      menu: DEFAULTMENU,
    }),
  }
)
const emit = defineEmits(['onCornerClick', 'handleLine', 'update:horLineArr', 'update:verLineArr'])

const cornerActiveClass = computed(() => {
  return props.cornerActive ? ' active' : ''
})
const cornerStyle = computed(() => {
  const { palette, thick } = props
  return {
    backgroundColor: palette.bgColor,
    width: thick + 'px',
    height: thick + 'px',
    borderRight: `1px solid ${palette.borderColor}`,
    borderBottom: `1px solid ${palette.borderColor}`,
  }
})
const canvasConfigs = computed(() => {
  const { bgColor, longfgColor, shortfgColor, fontColor, shadowColor, lineColor, borderColor, cornerActiveColor } = props.palette
  return {
    ratio: props.ratio,
    bgColor,
    longfgColor,
    shortfgColor,
    fontColor,
    shadowColor,
    lineColor,
    borderColor,
    cornerActiveColor,
  }
})

function onCornerClick(e: MouseEvent) {
  emit('onCornerClick', e)
}
function handleLineChange(arr: number[], vertical: boolean) {
  const newLines = vertical ? { h: props.horLineArr, v: [...arr] } : { h: [...arr], v: props.verLineArr }
  emit('handleLine', newLines)
}
</script>

<style lang="scss">
.style-ruler {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%; /* scrollbar width */
  height: 100%;
  z-index: 3; /* 需要比resizer高 */
  pointer-events: none;
  font-size: 12px;
  overflow: hidden;
  span {
    line-height: 1;
  }
}
.corner {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;
  // &.active {
  //     background-color: ${props => props.cornerActiveColor} !important;
  // }
}

.indicator {
  position: absolute;
  pointer-events: none;
  .value {
    position: absolute;
    background: white;
  }
}
.corner {
  position: absolute;
  left: 0;
  top: 0;

  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;
  /* &.active {
    background-color: ${props => props.cornerActiveColor} !important;
  } */
}
.ruler {
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
