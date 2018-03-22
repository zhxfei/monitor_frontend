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
            <el-form-item label="Item">
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
                <el-button type="primary" @click="onSubmit">Search</el-button>
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
          },{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          },{
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
        handler(val, oldVal){
          if(Object.prototype.toString.call(val)=='[object Array]'){
            if (val.length != 0){
              var req_data = { 'endpoint': val[0]}
            }
          }else{
            var req_data = { 'endpoint': val}          
          }
          console.log(req_data)
          axios.get('http://localhost:11111/monitor/v1/metrics', {
            params: req_data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          })
          .then((res) => {
            this.itemList = res.data
          })
          .catch((err)=>{
            console.log(err)
          })
        },
      }
    },
    methods: {
      onSubmit() {
        if(this.$route.path == '/datasearch'){
          this.$bus.$emit('submit-event', this.formInline)
        }else{
          this.$bus.$emit('compare-event', this.formInline)
        }
      }
    },
    mounted(){
      axios.get('http://10.83.3.46:11111/monitor/v1/hosts',{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then((res) => {
        this.hostList = res.data;
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  }
</script>


<style>

</style>
