<template>
  <c-el-dialog
    title="打印控件"
    relativeTo="app"
    top="20vh"
    :show-close="!downloadStart"
    :model-value="control.visible"
    :close-on-click-modal="!downloadStart"
    :close-on-press-escape="!downloadStart"
    width="390px"
    :content-style="{ height: '150px', padding: '0' }"
    @update:model-value="changeControlVisible($event)"
  >
    <div class="check-printer-control">
      <p v-if="!downloadStart">{{ control.message }}</p>
      <div v-else class="_download">
        <div class="_progress-wraper">
          <div class="_progress" :style="{ '--width': percentage + '%' }"></div>
          <div class="_percentage">{{ percentage + '%' }}</div>
        </div>
        <p v-if="downloadEnd" class="_downloaded">下载完成，请安装控件后重启软件</p>
        <p v-else class="_size">
          <span :style="{ color: downloadEnd ? '' : '$clr-blue' }">{{ loadedSize }}MB</span>
          <span style="margin: 0 4px">/</span>
          <span>{{ totalSize }}MB</span>
        </p>
      </div>
    </div>
    <template #footer>
      <div class="_custom-footer select-none _border">
        <button v-if="downloadEnd" class="_cancel" @click="relaunch">重启</button>
        <button v-if="!downloadStart" class="_confirm" @click="download">下载</button>
      </div>
    </template>
  </c-el-dialog>
</template>

<script tang="ts">
import { mapState, mapActions } from 'pinia'
import usePrintStore from 'store/print-design'
import { exportFile } from 'utils'
import { commonApi } from 'apis'
import { ElMessage } from 'element-plus'
export default {
  name: 'CheckPrintControl',
  data() {
    return {
      loadedSize: 0,
      totalSize: 0,
      percentage: 0,
      downloadStart: false,
      downloadEnd: false,
    }
  },
  computed: {
    ...mapState(usePrintStore, { control: 'checkPrintControl' }),
  },
  methods: {
    ...mapActions(usePrintStore, ['changeControlVisible']),
    relaunch() {
      ipcRenderer.send('relaunch')
    },
    download() {
      const file = this.control.file
      exportFile({
        type: 'exe',
        method: commonApi.get_printer_control,
        params: { file },
        name: file,
        downloadStart: () => {
          this.downloadStart = true
        },
        onDownloadProgress: ({ loaded, total }) => {
          this.loadedSize = (loaded / (1 << 20)).toFixed(2)
          this.totalSize = (total / (1 << 20)).toFixed(2)
          this.percentage = ((loaded / total).toString().slice(0, 6) * 100).toFixed(2)
        },
      })
        .then(() => {
          this.downloadEnd = true
        })
        .catch(e => {
          console.error(e)
          ElMessage.error(JSON.stringify(e))
          this.downloadStart = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.check-printer-control {
  padding: 20px;
  height: 100%;
  @include center;

  ._size {
    margin: 10px 0;
  }
  ._downloaded {
    margin: 10px 0;
  }
  ._download {
    flex-direction: column;
    @include center;
  }
  ._progress-wraper {
    display: flex;
    align-items: center;
  }
  ._percentage {
    margin-left: 5px;
    color: $clr-blue;
  }
  ._progress {
    display: block;
    width: 188px;
    height: 6px;
    border-radius: 3px;
    background-color: #f5f5f5;
    margin-right: 8px;
    overflow: hidden;
    &::after {
      content: '';
      display: block;
      width: var(--width);
      transition: width 0.3s linear;
      border-radius: inherit;
      height: inherit;
      background-color: $clr-blue;
    }
  }
  ._custom-footer {
    height: 66px;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 0px 0px 4px 4px;
    &._border {
      border-top: 1px solid #f5f5f5;
    }
    &._shadow {
      box-shadow: 0px -2px 10px 0px rgba(213, 220, 224, 0.5);
    }
  }
  ._confirm,
  ._cancel {
    font-size: 14px;
    margin-left: 12px;
    min-width: 88px;
    height: 36px;
    border-radius: 2px;
    padding: 0 16px;
  }
  ._confirm {
    background: $clr-blue;
    color: #fff;
  }
  ._cancel {
    color: #505050;
    border: 1px solid #e0e0e0;
  }
}
</style>
