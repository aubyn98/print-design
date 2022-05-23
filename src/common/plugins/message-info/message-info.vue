<template>
  <transition name="message-info-fade" @before-leave="$emit('close')" @after-leave="$emit('destroy')">
    <div v-show="visible" class="info" @mouseenter="clearTimer" @mouseleave="startTimer">
      <p class="_message">{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { _setTimeout } from 'utils'

const props = defineProps({
  type: {
    type: String,
    default: 'success',
  },
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 1500,
  },
})
const emit = defineEmits(['close', 'destroy'])

let removeTimer = null
function startTimer() {
  if (props.duration > 0) {
    removeTimer = _setTimeout(() => {
      if (visible.value) {
        close()
      }
    }, props.duration)
  }
}

function clearTimer() {
  removeTimer && removeTimer()
}

const visible = ref(false)
function close() {
  visible.value = false
}
onMounted(() => {
  startTimer()
  visible.value = true
})
onBeforeUnmount(clearTimer)
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  z-index: 4008;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0px 3px 6px rgba(203, 203, 203, 0.4);
  display: flex;
  align-items: flex-start;
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  overflow: hidden;
  .icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
  ._message {
    line-height: 16px;
    color: #505050;
    font-size: 13px;
    margin-left: 8px;
  }
}
.message-info-fade-enter-from,
.message-info-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>
