<template>
  <el-main>

    <searchform/>
    <!-- 展示组件 -->

  </el-main>
</template>

<style>
  .el-header {
    /* background-color: rgb(0, 128, 100); */
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-main {
    width: 100%
  }

  .span {
    font-family: "Helvetica Neue"
  }
</style>

<script>
  import searchform from '../components/searchform'
  import axios from 'axios'
  import qs from 'qs'

  export default {
    name: 'compare',
    data() {
      return {}
    },
    components: {
      searchform,
    },
    methods: {
      // eventHandler
      deleteEventHandler(formData) {
        let timeRange = formData.timeRange
        for (let hostName of formData.chosedhost) {
          let req_data = {
            endpoint: hostName,
            metric: '*',
            s_time: Date.parse(timeRange[0]) / 1000,
            e_time: Date.parse(timeRange[1]) / 1000
          }
          let req_info = qs.stringify(req_data);

          axios.delete('http://' + this.$apiHost + '/monitor/v1/items', {
            data: req_data
          })
            .then((res) => {
              // alert('delete succeed!')
              this.$notify({
                title: "成功",
                message: hostName + "数据删除成功",
                type: "success"
              });
            })
            .catch((err) => {
              console.log(err)
              this.$notify({
                title: "失败",
                message: '数据删除失败！',
                type: 'error'
              })
            })
        }
      },
    },
    created() {
      this.$bus.$on('delete-event', this.deleteEventHandler)
    },
  };
</script>
