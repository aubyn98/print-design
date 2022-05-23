<template>
  <div class="left-panel flex flex-col">
    <header class="_header flex-y-center justify-between">
      <span>数据源</span>
      <quick-svg class="pointer" :name="visible ? 'icon-icon_dropdown' : 'icon-icon_intothe'" size="12px" @click="visible = !visible" />
    </header>
    <el-scrollbar class="flex-1-h _scroll" always>
      <el-collapse-transition>
        <div v-show="visible" class="flex flex-wrap">
          <el-tag
            v-for="data in datasource"
            :key="data.id"
            class="margin-r-8 margin-b-8 select-none block flex-y-center move"
            :type="data.type === 'controls-table' ? 'warning' : data.name.startsWith('_system_') ? 'danger' : 'info'"
            plain
            draggable="true"
            @click="addDataSourceHandle(data)"
            @dragstart="onDataSourceDragstart($event, data)"
          >
            <el-icon v-if="data.type === 'controls-table' ? 'warning' : ''" class="_icon"><grid /></el-icon> {{ data.label }}
          </el-tag>
        </div>
      </el-collapse-transition>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { usePrintStore, storeToRefs } from 'store'
import { ref } from 'vue'

const designStore = usePrintStore()
const { datasource } = storeToRefs(designStore)
const { onDataSourceDragstart, addDataSourceHandle } = designStore

const visible = ref(true)
</script>

<style lang="scss" scoped>
@use '../styles/print-design.scss';

.el-tag {
  background: #fff;
}
.el-tag .el-icon._icon {
  line-height: 22px;
  vertical-align: middle;
  top: 0;
}
</style>
