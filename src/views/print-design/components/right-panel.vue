<template>
  <div class="right-panel flex flex-col">
    <header class="_header flex-y-center justify-between">
      <span>参数</span>
      <quick-svg class="pointer" :name="visible ? 'icon-icon_dropdown' : 'icon-icon_intothe'" size="12px" @click="visible = !visible" />
    </header>
    <el-scrollbar class="_scroll flex-1-h" always>
      <el-collapse-transition>
        <div v-show="visible">
          <el-form class="child-window items-mrb-12 print-design-window flex-shrink-0">
            <el-form-item class="flex" label="模板名称">
              <el-input v-model="template.title" />
            </el-form-item>
            <div class="flex">
              <el-form-item label="模板宽度" class="margin-r-10">
                <el-input-number v-model="template.width" controls-position="right" />
              </el-form-item>
              <el-form-item label="模板高度">
                <el-input-number v-model="template.height" controls-position="right" />
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item label="纸张宽度" class="margin-r-10">
                <el-input-number :model-value="Number(pageRect.paperWidth)" controls-position="right" @update:model-value="changePageSize({ width: $event })" />
              </el-form-item>
              <el-form-item label="纸张高度">
                <el-input-number :model-value="Number(pageRect.paperHeight)" controls-position="right" @update:model-value="changePageSize({ height: $event })" />
              </el-form-item>
            </div>
            <el-form-item label="常用纸张">
              <el-select :model-value="pageType" @update:model-value="changePageType" @change="$emit('update-page-size')" clearable>
                <el-option v-for="size in sizeList" :key="size" :label="size" :value="size"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="activeItem" class="flex flex-col">
            <header class="lh-20 fs-13 margin-b-12 select-none flex-shrink-0">样式</header>
            <el-form class="child-window print-design-window flex-shrink-0">
              <el-form-item class="flex" label="组件类型">
                <el-input readonly :model-value="controlsType[activeItem.type]" borderColor="transparent" />
              </el-form-item>
              <el-form-item class="flex" label="标题">
                <el-input :model-value="activeItem.title" @input="changeTempItem('title', $event)" />
              </el-form-item>
              <el-form-item class="flex" label="内容">
                <el-input :readonly="activeItem.name.length > 0" :model-value="activeItem.value" @input="changeTempItem('value', $event)" />
              </el-form-item>
              <div class="flex">
                <el-form-item v-show="!activeType.isVerticalLine" label="宽度" class="margin-r-10">
                  <el-input-number :model-value="activeItem.width" controls-position="right" @update:model-value="changeTempItem('width', $event)" />
                </el-form-item>
                <el-form-item v-show="!activeType.isHorizontalLine" label="高度">
                  <el-input-number :model-value="activeItem.height" controls-position="right" @update:model-value="changeTempItem('height', $event)" />
                </el-form-item>
              </div>
              <div class="flex">
                <el-form-item label="X坐标" class="margin-r-10">
                  <el-input-number :model-value="activeItem.left" controls-position="right" @update:model-value="changeTempItem('left', $event)" />
                </el-form-item>
                <el-form-item label="Y坐标">
                  <el-input-number :model-value="activeItem.top" controls-position="right" @update:model-value="changeTempItem('top', $event)" />
                </el-form-item>
              </div>
              <div v-show="activeType.hasFontStyle" class="flex">
                <el-form-item label="字号" class="margin-r-10">
                  <el-input-number :model-value="activeItem.style.FontSize" controls-position="right" @update:model-value="changeTempItemStyle('FontSize', $event)" />
                </el-form-item>
                <el-form-item label="对齐">
                  <el-select :clearable="false" :model-value="activeItem.style.Alignment" style="width: 73px" @change="changeTempItemStyle('Alignment', $event)">
                    <el-option
                      v-for="align in [
                        { label: '左对齐', value: 'left' },
                        { label: '居中', value: 'center' },
                        { label: '右对齐', value: 'right' },
                      ]"
                      :key="align.value"
                      :label="align.label"
                      :value="align.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <el-form-item v-show="activeType.hasFontStyle" class="flex" label="字体">
                <el-select :clearable="false" :model-value="activeItem.style.FontName" @change="changeTempItemStyle('FontName', $event)">
                  <el-option v-for="fontName in ['微软雅黑', '微软雅黑 Light', '宋体', '黑体', '仿宋', '新宋体', '楷体']" :key="fontName" :label="fontName" :value="fontName"></el-option>
                </el-select>
              </el-form-item>
              <div v-show="activeType.hasFontStyle" class="flex">
                <el-form-item class="flex" label="字体颜色">
                  <el-color-picker :model-value="activeItem.style.FontColor" @change="changeTempItemStyle('FontColor', $event)" />
                </el-form-item>
                <el-form-item v-show="activeType.isTable" class="flex" label="边框颜色">
                  <el-color-picker :model-value="activeItem.style.BorderColor" @change="changeTempItemStyle('BorderColor', $event)" />
                </el-form-item>
              </div>
              <el-form-item v-show="activeType.isLine" class="flex" label="线条类型">
                <el-select :clearable="false" :model-value="activeItem.direction" @change="changeTempItem('direction', $event)">
                  <el-option
                    v-for="lineType in [
                      { label: '水平', value: 'horizontal' },
                      { label: '垂直', value: 'vertical' },
                    ]"
                    :key="lineType.value"
                    :label="lineType.label"
                    :value="lineType.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div v-show="activeType.isCode">
                <el-form-item class="flex-y-center" label="条码值">
                  <el-switch :model-value="activeItem.style.ShowBarText" @change="changeTempItemStyle('ShowBarText', $event)" />
                </el-form-item>
                <el-form-item class="flex" label="条码类型">
                  <el-select :model-value="activeItem.style.codeType" @change="changeTempItemStyle('codeType', $event)" clearable>
                    <el-option v-for="codeType in codeTypeList" :key="codeType" :label="codeType" :value="codeType"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
            <template v-if="activeType.isTable">
              <header class="lh-20 fs-13 margin-b-12 select-none flex-shrink-0">表格列</header>
              <el-scrollbar tag="ul" class="flex-1-h _scroll pd-b-12" always>
                <li v-for="(col, i) in activeItem.columns" :key="col.name" class="flex">
                  <el-checkbox style="margin-right: 20px" :model-value="col.visible" @update:model-value="changeColsHandle(i, $event, 'visible')">
                    {{ col.title }}
                  </el-checkbox>
                  <el-form>
                    <el-form-item label="宽" class="margin-r-10" labelPadding="0 8px 0 0">
                      <el-input-number :model-value="Number(col.width)" controls-position="right" @update:model-value="changeColsHandle(i, $event, 'width')" />
                    </el-form-item>
                  </el-form>
                </li>
              </el-scrollbar>
            </template>
          </div>
        </div>
      </el-collapse-transition>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { usePrintStore, storeToRefs, paperData } from 'store'
import { ElInputNumber } from 'element-plus'
import { ref } from 'vue'

const { sizeList, codeTypeList, controlsType } = paperData

defineEmits(['update-page-size'])

const designStore = usePrintStore()
const { template, pageRect, pageType, activeItem, activeType } = storeToRefs(designStore)
const { changePageSize, changePageType, changeTempItem, changeTempItemStyle, changeColsHandle } = designStore

const visible = ref(true)
</script>

<style lang="scss" scoped>
@use '../styles/print-design.scss';

.el-form.child-window {
  &:deep() {
    .el-form-item.el-form-item--small {
      .el-form-item__label {
        width: 60px;
      }
    }
  }
}
.el-input-number--small.is-controls-right:deep() {
  width: 73px;
  .el-input__inner {
    border-color: #f0f0f0;
  }
  .el-input-number__increase,
  .el-input-number__decrease {
    border-color: #f0f0f0;
  }
}
</style>
