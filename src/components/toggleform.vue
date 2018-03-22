<template>
    <el-row>
        <el-col :span="24">

         <el-form :inline="true" :model="formInline" class="demo-form-inline" 
            style="float: left">
            
            <el-form-item label="Host">
                <el-select v-model="formInline.chosedhost" 
                           filterable
                           placeholder="Host">
                    <el-option v-for="(host, index) in hostList" :label="host" :value="host" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">Toggle</el-button>
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
        formInline: {
          chosedhost: '',
        }
      }
    },
    methods: {
      onSubmit() {
        this.$bus1.$emit('toggle-event', this.formInline)
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
