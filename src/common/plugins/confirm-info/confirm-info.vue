<template>
  <CElDialog v-model="visible" type="message" :content-style="{ height: '52px' }" v-bind="$attrs">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot>
      <div style="height: 100%" class="flex-y-center">
        <quick-svg :fill="false" size="18px" class="info_icon" name="icon-icon_tsalert" />
        <span class="color-66 fs-13 lh-20">{{ message }}</span>
      </div>
    </slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </CElDialog>
</template>

<script lang="ts" setup>
import QuickSvg from 'comps/project/quick-svg.vue'
import CElDialog from 'comps/element-custom/dialog/c-el-dialog.vue'
import { ref, onMounted } from 'vue'
defineProps<{ message?: string }>()
const visible = ref(false)
onMounted(() => {
  visible.value = true
})
function changeVisible(e: boolean) {
  visible.value = e
}
defineExpose({
  changeVisible,
})
</script>

<style lang="scss" scoped>
.info_icon {
  margin-right: 6px;
}
</style>
