<template>
  <div
    class="widgets"
    :style="{
      width: val.width + 'px',
      height: val.height + 'px',
      textAlign: val.style.Alignment,
      fontSize: val.style.FontSize + 'pt',
      color: val.style.FontColor,
      fontFamily: val.style.FontName,
    }"
    style="position: absolute; overflow: hidden"
  >
    <table
      border="1"
      width="100%"
      cellspacing="0"
      cellpadding="2"
      style="border-collapse: collapse"
      :bordercolor="val.style.BorderColor || '#000000'"
    >
      <tr>
        <th v-for="item in columns" :key="item.name" :width="item.width ? item.width + 'px' : ''">{{ item.title }}</th>
      </tr>
      <tr>
        <td v-for="item in columns" :key="item.name">{{ item.value }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { IndexType } from 'uses'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ControlsTable',
  props: {
    val: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    // 去掉type='row'的数据
    columns() {
      return this.val.columns.filter((it: IndexType) => it.visible) || []
    },
  },
})
</script>
