<template>
  <el-row>
    <el-col :span="24">

      <el-form :inline="true" :model="formInline" class="demo-form-inline"
               style="float: left">

        <el-form-item label="Host">
          <el-select v-model="formInline.chosedhost"
                     filterable
                     placeholder="Host"
                     v-if="this.$route.path == '/datasearch'">
            <el-option v-for="(host, index) in hostList" :label="host" :value="host" :key="index"></el-option>
          </el-select>

          <el-select v-model="formInline.chosedhost"
                     filterable
                     multiple
                     placeholder="Host"
                     style="width: 280px"
                     v-else>
            <el-option v-for="(host, index) in hostList" :label="host" :value="host" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <br> -->
        <el-form-item label="Item" v-if="this.$route.path != '/datamanage'">
          <el-select v-model="formInline.chosedItem" filterable placeholder="Item">
            <el-option v-for="(item, index) in itemList" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Time Range">

          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="formInline.timeRange"
              type="datetimerange"
              :picker-options="pickerOptions2"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']">
            </el-date-picker>
          </div>
        </el-form-item>


        <el-form-item>
          <el-popover
            ref="deleteHelp"
            placement="top-start"
            title="提示"
            width="200"
            trigger="hover"
            content="将指定Host除Time Range之外的数据全部删除">
          </el-popover>
          <el-button type="danger" v-popover:deleteHelp @click="onDelete" v-if="this.$route.path == '/datamanage'">
            Delete
          </el-button>
          <el-button type="primary" @click="onSubmit" v-else>Search</el-button>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import qs from 'qs'
  import axios from 'axios'

  export default {
    name: 'hostform',
    data() {
      return {
        hostList: '',
        itemList: '',
        formInline: {
          timeRange: '',
          chosedhost: '',
          chosedItem: ''
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近六小时',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三十天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    watch: {
      'formInline.chosedhost': {
        handler(val, oldVal) {
          let req_data = "";
          if (Object.prototype.toString.call(val) === '[object Array]') {
            if (val.length != 0) {
              req_data = {'endpoint': val[0]}
            }
          } else {
            req_data = {'endpoint': val}
          }
          if (this.$route.path !== '/datamanage') {
            axios.get('http://' + this.$apiHost + '/monitor/v1/metrics', {
              params: req_data,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            })
              .then((res) => {
                this.itemList = res.data
              })
              .catch((err) => {
                console.log(err)
              })
          }
        },
      }
    },
    methods: {
      onSubmit() {
        if (this.$route.path === '/datasearch') {
          this.$bus.$emit('submit-event', this.formInline)
        } else {
          this.$bus.$emit('compare-event', this.formInline)
        }
      },
      onDelete() {
        this.$confirm('此操作将删除所选定时间范围外的所有监控数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$bus.$emit('delete-event', this.formInline)
          //   this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'delete opration cancel'
          });
        });
      }
    },
    mounted() {
      axios.get('http://' + this.$apiHost + '/monitor/v1/hosts', {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
        .then((res) => {
          this.hostList = res.data;
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
</script>


<style>

</style>
