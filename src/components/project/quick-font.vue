<template>
  <i class="iconfont" :class="[name]"></i>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineProps<{ name: string }>()
</script>

<style lang="scss" scoped></style>
