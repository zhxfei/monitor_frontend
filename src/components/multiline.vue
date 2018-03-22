<template>
  
  <div class="chart-container">
      <div :id="this.echartsid" style="height: 400px" >图表加载失败</div>
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'

export default {
    name: 'multiline',
    data(){
        return  {
            myChart : '',
            showHost: 'newbie-unknown85822.i.nease.net',   // default
            // id_name : 'gauge1',
            showdate: [],
            showdata: []
        }
    },
    props: [
      'initMetricList',
      'echartsid'  
    ],
    watch:{
        showdata: {
            handler(){
                this.chart.setOption(this.getOption());
                this.chart.hideLoading();
            }
        },
        showHost: {
            handler(){
                console.log('show host changed')
                this.getDataInit()
                this.chart.setOption(this.getOption());
                this.chart.hideLoading();                
            }
        }
    },
    methods: {
        getOption(){
            let option = {
                    title: {
                        text: this.getTitle()
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: this.initMetricList
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                      feature: {
                          restore: {},
                          saveAsImage: {}
                      }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.showdate
                    },
                    yAxis: this.getYaxis(),
                    series: this.showdata
            };
            return option
        },
        getTitle(){
            let markArray = this.initMetricList[0].split(".", 2)
            return this.showHost + ":" +markArray[0] + '.' + markArray[1]
        },
        getYaxis(){
          let args = this.initMetricList[0].split('.')
          if (args[args.length-1] === 'percent' || args[3] === 'percent'){
            return {
              type : 'value',
              axisLabel : {
                formatter: '{value} %'
              }
            }
          }
          else if (args[0] == 'mem'){
            return {
              type : 'value',
              axisLabel : {
                formatter: '{value} M'
              }
            }
          }else{
            return {
              type : 'value',
              axisLabel : {
                formatter: '{value}'
              }
            }
          }
      },
        dateFormat (t1) {
            var newDate = new Date();
            newDate.setTime(t1 * 1000);
            return [
              newDate.getFullYear(), 
              newDate.getMonth()+1,     // 这是个坑....
              newDate.getDate()
              ].join("/")+' '+ [
              newDate.getHours(), 
              newDate.getMinutes()].join(':');
        },
        getUserChartInit() {
            this.getDataInit()

            this.chart = echarts.init(document.getElementById(this.echartsid));
            this.chart.showLoading()
            this.chart.setOption(this.getOption());
            this.chart.hideLoading();
        },
        getDataInit(){
            this.showdata = []
            this.showdate = []

            let e_time = new Date();
            let s_time = new Date();
            s_time.setTime(e_time.getTime() - 3600 * 1000 * 6);
            for (let metric_name of this.initMetricList){
                let req_data = {
                    endpoint: this.showHost,
                    metric: metric_name,
                    s_time: Date.parse(s_time)/ 1000,
                    e_time: Date.parse(e_time)/ 1000
                }
                let req_info = qs.stringify(req_data);

                axios.post('http://localhost:11111/monitor/v1/items', req_info,
                    {
                        headers:{
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Accept': '*/*'
                        }
                    })
                .then((res) => {
                    this.showdata.push({
                        name: metric_name,
                        type:'line',
                        data: this.genShowData(metric_name, res.data)
                    });
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
        },
        genShowData(metric_name, data){
            let rData = [];
            for (var obj of data) {
                rData.push(this.getDataFormater(metric_name, obj.value));
            }
            if (this.showdate.length == 0){
                for (var obj of data) {
                    this.showdate.push(this.dateFormat(obj.timestamp));
                }    
            }
            return rData;
        },getDataFormater(metric_name, data){
          let args = metric_name.split('.')
          let metricType = args[0]
          let percent = args[args.length-1]
          if (metricType == 'mem' && percent !== 'percent'){
            return Math.floor(data/1024/1024)
          }else{
            return data
          }
        },
        // eventHandler
        toggleEventHandler(formData){
            this.showdate = []
            this.showdata = []
            this.showHost = formData.chosedhost
        },
    },
    mounted () {
      this.$nextTick(function () {
        this.getUserChartInit();
      })
    },
    created() {
        this.$bus1.$on('toggle-event', this.toggleEventHandler)
    },
    beforeDestroy() {
      this.$bus1.$off('toggle-event', this.handleMyEvent)
    }

}

</script>

<style>

</style>
