<template>
  <el-dialog ref="dialog" :custom-class="customClass" :model-value="props.modelValue" :fullscreen="false" destroy-on-close append-to-body v-bind="$attrs" @close="close" @closed="closed()">
    <div class="_custom-wraper" :class="{ _message: type === 'message', _choose: type === 'choose' }" :style="wraperStyle">
      <div v-if="header" class="_custom-header select-none" :class="{ _border: headerBorder, _move: canDrag && !positionCenter }" :style="headerStyle" @mousedown="mousedown">
        <slot name="header">
          <div class="_title c-label-title flex-y-center" @mousedown.stop>
            {{ title }}
          </div>
          <quick-svg v-if="showClose" class="_close pointer" size="12px" name="icon-icon_shutdown" @mousedown.stop @click="close" />
        </slot>
      </div>
      <div class="_custom-content" :style="[{ height, maxHeight }, contentStyle]">
        <slot />
      </div>
      <slot v-if="footer" name="footer">
        <div class="_custom-footer select-none" :class="{ _border: footerBorder }" :style="footerStyle">
          <button v-if="cancel" class="_cancel" @click="$emit('cancel')">{{ cancelText }}</button>
          <button v-if="coordinate" class="_confirm" @click="$emit('coordinate')">坐标</button>
          <button v-if="hotkey && !hideConfirm" v-hotkey="{ s: () => modelValue && $emit('confirm') }" class="_confirm" @click="$emit('confirm')">
            {{ confirmText + '(S)' }}
          </button>
          <button v-else-if="!hideConfirm" ref="btn" class="_confirm" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
      </slot>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { buildDirective } from '@/common/directives/hotkey'
export default {
  name: 'CElDialog',
  directives: {
    hotkey: buildDirective(),
  },
}
</script>
<script lang="ts" setup>
import { useAttrs, computed, ref, onMounted, nextTick } from 'vue'
import { getProps, useWatchModel, useMove } from './uses'
import { ElDialog } from 'element-plus'
import QuickSvg from '../../project/quick-svg.vue'
import { useEventListener } from '@vueuse/core'
const btn = ref<HTMLElement>()
const props = defineProps(getProps)
const emit = defineEmits(['confirm', 'close', 'cancel', 'coordinate'])
const attrs: { 'onUpdate:modelValue'?: (b: boolean) => void; 'close-on-click-modal'?: boolean } = useAttrs()
const close = () => {
  const updateModel = attrs['onUpdate:modelValue']
  updateModel && updateModel(false)
  emit('close')
}
const dialog = ref()
onMounted(() => {
  nextTick(() => {
    btn.value?.focus()
  })
})
useWatchModel(props, attrs)
const { mousedown, closed } = useMove(props, attrs)
const customClass = computed(() => {
  let str = 'c-el-dialog'
  if (props.positionCenter) str += ' _positionCenter'
  return str
})
</script>

<style lang="scss">
:root {
  --formDialogTop: 32px;
  --formDialogLeft: 0;
}
$color-bor: #f0f0f0;

@mixin overlay {
  top: var(--formDialogTop);
  left: var(--formDialogLeft);
}
.el-overlay:not(.is-message-box) {
  background-color: rgba(0, 0, 0, 0.1);
  @include overlay;
  .el-overlay-dialog {
    @include overlay;
    top: 0 !important;
    overflow: hidden !important;
  }
}

.c-el-dialog.el-dialog {
  background: transparent;
  box-shadow: none;
  &._positionCenter {
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__headerbtn {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  ._custom-wraper {
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    &._message {
      ._title::before {
        content: none;
      }
      ._custom-header {
        height: 32px;
        border-bottom: none;
        padding: 0 12px;
      }
      ._custom-content {
        padding: 12px;
      }
      ._custom-footer {
        border-top: none;
        padding: 0 12px;
      }
      ._confirm,
      ._cancel {
        margin-left: 12px;
        min-width: 62px;
        height: 28px;
      }
    }
    &._choose {
      ._custom-header {
        background-color: #f5f5f5;
        height: 32px;
        padding: 6px 12px;
        ._title {
          font-size: 12px;
          &::before {
            height: 10px;
            margin-right: 6px;
          }
        }
      }
      ._custom-content {
        padding: 0 12px;
      }
      ._custom-footer {
        border-top: none;
        padding: 0 12px;
      }
    }
  }
  ._custom-header {
    padding: 8px 12px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    &._move {
      cursor: move;
    }
    &._border {
      border-bottom: 1px solid $color-bor;
    }

    ._close {
    }
  }
  ._custom-content {
    padding: 12px;
    overflow-y: auto;
  }
  ._custom-footer {
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &._border {
      border-top: 1px solid $color-bor;
    }
  }
  ._confirm,
  ._cancel {
    font-size: 12px;
    margin-left: 12px;
    min-width: 72px;
    height: 28px;
    padding: 0 16px;
  }
  ._confirm {
    background: #206ef7;
    color: #fff;
  }
  ._cancel {
    color: #666666;
    border: 1px solid #e0e0e0;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
}
</style>
