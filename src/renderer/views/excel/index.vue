<template>
  <div class="app-container">
    <el-button @click="handleClick">导出</el-button>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')
const data = [
  { name: '1', age: '2' }
]
const excelModel = new Blob([data], { type: 'application/octet-stream' })
export default {
  data() {
    return {
    }
  },
  methods: {
    handleClick() {
      const reader = new FileReader()
      reader.readAsDataURL(excelModel)
      reader.addEventListener('loadend', function() {
        ipcRenderer.send('saveDialog', {
          baseCode: reader.result,
          fileType: 'excel',
          fileName: '封神榜'
        })
        ipcRenderer.once('succeedDialog', event => {
        })
        ipcRenderer.once('defeatedDialog', event => {
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

