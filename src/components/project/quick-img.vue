<template>
  <img class="quick-img" :src="src" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})
const src = computed(() => new URL(`../../assets/images/${props.name}.png`, import.meta.url).href)
</script>
