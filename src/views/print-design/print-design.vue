<template>
  <header
    v-hotkey="{ s: updateSchema, p: preview }"
    class="print-design-menu app-no-drag flex-shrink-0 flex-center pd-lr-8 fixed"
    style="top: 30px; z-index: 10; left: 18px"
  >
    <el-button-group key="align-control">
      <el-button @click="addTempItem({ type: 'controls-line' })">线条</el-button>
      <el-button @click="addTempItem({ type: 'controls-txt' })">文本</el-button>
      <el-button @click="addTempItem({ type: 'controls-image' })">图片</el-button>
      <el-button @click="addTempItem({ type: 'controls-code' })">条形码</el-button>
      <el-button @click="addTempItem({ type: 'controls-code', style: { codeType: 'QRCode' } })">二维码</el-button>
    </el-button-group>
  </header>
  <div class="flex-shrink-0 text-right fixed" style="top: 30px; right: 30px; z-index: 10; width: auto">
    <el-button type="primary" @click="preview">预览 (P)</el-button>
    <el-button type="success" @click="saveHandle">保存 (S)</el-button>
  </div>
  <div id="print-design-wrapper" class="print-design-wrapper flex-1-h">
    <SketchRuler
      v-model:horLineArr="sketchRulerInfo.lines.h"
      v-model:verLineArr="sketchRulerInfo.lines.v"
      :lang="sketchRulerInfo.lang"
      :thick="sketchRulerInfo.thick"
      :scale="sketchRulerInfo.scale"
      :width="sketchRulerInfo.width"
      :height="sketchRulerInfo.height"
      :startX="sketchRulerInfo.startX"
      :startY="sketchRulerInfo.startY"
      :shadow="shadow"
      :cornerActive="true"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
    >
    </SketchRuler>
    <div id="print-design-screens" ref="screensRef" @scroll="handleScroll">
      <div ref="containerRef" class="print-design-screen-container select-none">
        <div id="print-design-wrap" :style="canvasStyle">
          <div id="print-design-content" :style="contentStyle" @dragover.prevent @drop="onDataSourceDrop">
            <DraggableContainer referenceLineColor="#fa742b" :adsorbRows="sketchRulerInfo.lines.h" :adsorb-cols="sketchRulerInfo.lines.v" :adsorbParent="false">
              <Vue3DraggableResizable
                v-for="val in template.tempItems"
                :key="val.uuid"
                v-model:x="val.left"
                v-model:y="val.top"
                v-model:w="val.width"
                v-model:h="val.height"
                :active="activeItem?.uuid === val.uuid"
                :initW="isVerticalLine(val) ? 20 : val.width"
                :initH="isHorizontalLine(val) ? 20 : val.height"
                :draggable="true"
                :resizable="true"
                :minH="1"
                :minW="1"
                :disabledW="isVerticalLine(val)"
                :disabledH="isHorizontalLine(val)"
                tabindex="-1"
                @activated="changeActiveItem(val)"
                @keydown.prevent="controlsKeyDown"
              >
                <component :is="components[getPascalCase(val.type)]" :data-title="val.type" :val="val" :data-type="val.type" :data-uuid="val.uuid"></component>
              </Vue3DraggableResizable>
            </DraggableContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ControlsScale v-model="sketchRulerInfo.scale" @change="changeScaleHandle" />
  <LeftPanel />
  <RightPanel />
  <CheckPrintControl />
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { usePrintStore, paperData, storeToRefs, printTestData } from 'store';
import { useEventListener } from '@vueuse/core';
import { LodopTools } from 'plugins/lodop';

// 标尺
import SketchRuler from './components/sketchRuler/sketchRuler.vue';
import ControlsScale from './components/controls-scale.vue';
import LeftPanel from './components/left-panel.vue';
import RightPanel from './components/right-panel.vue';
// 控件
import ControlsCode from './components/widgets/controls-code.vue';
import ControlsHtml from './components/widgets/controls-html.vue';
import ControlsImage from './components/widgets/controls-image.vue';
import ControlsLine from './components/widgets/controls-line.vue';
import ControlsTable from './components/widgets/controls-table.vue';
import ControlsTxt from './components/widgets/controls-txt.vue';
import Vue3DraggableResizable, { DraggableContainer } from 'vue3-draggable-resizable';
import { IndexType } from 'uses';
import { getPascalCase } from 'utils';
import { useRoute } from 'vue-router';

const { isHorizontalLine, isVerticalLine } = paperData;

const route = useRoute();

const components: IndexType = {
  ControlsCode,
  ControlsHtml,
  ControlsImage,
  ControlsLine,
  ControlsTable,
  ControlsTxt
};

interface SketchRulerInfo {
  scale: number;
  startX: number;
  startY: number;
  lines: {
    h: number[];
    v: number[];
  };
  thick: number;
  width: number;
  height: number;
  lang: string;
}
const sketchRulerInfo = ref<SketchRulerInfo>({
  scale: 1,
  startX: 0,
  startY: 0,
  lines: {
    h: [0],
    v: [0]
  },
  thick: 20,
  width: 200,
  height: 400,
  lang: 'zh-CN'
});

const screensRef = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();

const designStore = usePrintStore();
const { activeItem, template, previewTemplateData, finalTemplate } = storeToRefs(designStore);
const { changeActiveItem, changeTempItem, addTempItem, delActiveItem, onDataSourceDrop, getSchemaDetail, resetData, updateSchema } = designStore;
const shadow = computed(() => {
  const { width, height } = template.value;
  return {
    x: 0,
    y: 0,
    width: Number(width),
    height: Number(height)
  };
});

const canvasStyle = computed(() => {
  const { width, height } = template.value;
  return {
    width: width + 'px',
    height: height + 'px',
    transform: `scale(${sketchRulerInfo.value.scale})`
  };
});
const contentStyle = computed(() => {
  const { width, height } = canvasStyle.value;
  return {
    width,
    height
  };
});

useEventListener(window, 'resize', initSize);
onMounted(() => {
  initData(route.query.id as unknown);
});

function saveHandle() {
  return updateSchema();
}

function initData(id: unknown) {
  // 滚动居中
  if (id) getSchemaDetail(id as number).then(initSize);
  else {
    resetData();
    initSize();
  }
}

function preview() {
  // LodopTools.preview(finalTemplate.value, [previewTemplateData.value])
  LodopTools.preview(finalTemplate.value, printTestData.testData);
}

function controlsKeyDown(e: KeyboardEvent) {
  const item = activeItem.value;
  if (e.key === 'Delete') return delActiveItem();
  if (!item) return;
  let key,
    { left, top } = item;
  if (e.key === 'ArrowLeft') (key = 'left'), left--;
  if (e.key === 'ArrowRight') (key = 'left'), left++;
  if (e.key === 'ArrowUp') (key = 'top'), top--;
  if (e.key === 'ArrowDown') (key = 'top'), top++;
  key && changeTempItem(key, key === 'left' ? left : top);
}

function handleLine(lines: SketchRulerInfo['lines']) {
  sketchRulerInfo.value.lines = lines;
}

function handleCornerClick() {
  return;
}

function handleScroll() {
  const info = sketchRulerInfo.value;
  const screensRect = document.querySelector('#print-design-screens')?.getBoundingClientRect();
  const canvasRect = document.querySelector('#print-design-wrap')?.getBoundingClientRect();
  if (!screensRect || !canvasRect) return;
  // 标尺开始的刻度
  const startX = (screensRect.left + info.thick - canvasRect.left) / info.scale;
  const startY = (screensRect.top + info.thick - canvasRect.top) / info.scale;
  info.startX = startX >> 0;
  info.startY = startY >> 0;
}

/** 控制缩放值 */
function changeScaleHandle() {
  nextTick(() => {
    handleScroll();
  });
}

function initSize() {
  nextTick(() => {
    const info = sketchRulerInfo.value;
    if (!screensRef.value || !containerRef.value) return;
    screensRef.value.scrollLeft = containerRef.value.getBoundingClientRect().width / 2 - 330;
    const wrapperRect = document.querySelector('#print-design-wrapper')?.getBoundingClientRect();
    if (!wrapperRect) return;
    const borderWidth = 1;
    info.width = wrapperRect.width - info.thick - borderWidth;
    info.height = wrapperRect.height - info.thick - borderWidth;
  });
}
</script>
<style lang="scss" scoped>
@use './styles/print-design.scss' as *;

.widgets {
  outline: none;
}
.print-design-wrapper {
  background-color: #f5f5f5;
  position: relative;
  /* top: 64px;
  bottom: 0;
  left: 0;
  right: 0; */
  /* top: 100px;
  left: 100px;
  width: 700px;
  height: 500px; */
  border: 1px solid #dadadc;
}

#print-design-screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.print-design-screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
  background-color: #fff;
  background-image: linear-gradient(45deg, #f5f5f5 25%, transparent 0, transparent 75%, #f5f5f5 0),
    linear-gradient(45deg, #f5f5f5 25%, transparent 0, transparent 75%, #f5f5f5 0);
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
}

.scale-value {
  position: absolute;
  left: 0;
  bottom: 100%;
}

.button {
  position: absolute;
  left: 100px;
  bottom: 100%;
}

.button-ch {
  position: absolute;
  left: 200px;
  bottom: 100%;
}
.button-en {
  position: absolute;
  left: 230px;
  bottom: 100%;
}

#print-design-wrap {
  position: absolute;
  top: 120px;
  left: 50%;
  margin-left: -80px;
  transform-origin: 50% 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  background: white;
}
#print-design-content {
  width: 100px;
  height: 500px;
  position: relative;
}
</style>
<style lang="scss">
@use './styles/reset-vdr';
</style>
