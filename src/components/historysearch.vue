<template>
  <div class="chart-container">
    <el-row>
      <el-col :span="24" class="chart chart_left">
        <div id="userChart" style="height: 500px" >图表加载失败</div>
      </el-col>
    </el-row>
  </div>
  
</template>

<script>
  import echarts from 'echarts'
  import qs from 'qs'
  import axios from 'axios'


  export default {
    data() {
      return {
        myChart : {},
        showDataObj : {
          reqInfo: {
            endpoint: 'newbie-unknown85822.i.nease.net',  // default
            metric: 'system.load.avg.1min/core', // default
            e_time: Date.parse(new Date()),  // default
            s_time: 0,  // default
          },
        data: [],
        date: []        
        },
      }
    },
    watch: {
      showDataObj: {
        handler(val, oldVal){
          
          this.myChart.showLoading();
          this.myChart.setOption(this.getOption(val));
          this.myChart.hideLoading();
        },
        deep: true
      }
    },
    methods: {
      eventHandler(formData){
          let req_data = {
              endpoint: formData.chosedhost,
              metric: formData.chosedItem,
              s_time: Date.parse(formData.timeRange[0]) / 1000,
              e_time: Date.parse(formData.timeRange[1]) / 1000
          }
          let req_info = qs.stringify(req_data);

          axios.post('http://localhost:11111/monitor/v1/items', req_info,
            {
              headers:{
              'Content-type': 'application/x-www-form-urlencoded',
              'Accept': '*/*'
            }})
          .then((res) => {
            this.showDataObj = {
              reqInfo: req_data,
            }
            this.showDataObj.data = []
            this.showDataObj.date = []
            for (var obj of res.data) {
                this.showDataObj.date.push(this.dateFormat(obj.timestamp))
                this.showDataObj.data.push(this.getDataFormater(this.showDataObj.reqInfo.metric, obj.value));
            }

          })
          .catch((err)=>{
            console.log(err)
          })
      },getYaxis(){
          let args = this.showDataObj.reqInfo.metric.split('.')
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
      getOption (val) {
        let option = {
                  tooltip: {
                      trigger: 'axis',
                      position: function (pt) {
                          return [pt[0], '10%'];
                      }
                  },
                  title: {
                      left: 'center',
                      text: val.reqInfo.endpoint + '.' + val.reqInfo.metric,
                  },
                  toolbox: {
                      feature: {
                          dataZoom: {
                              yAxisIndex: 'none'
                          },
                          restore: {},
                          saveAsImage: {}
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: val.date
                  },
                  yAxis: this.getYaxis(),
                  dataZoom: [{
                      type: 'inside',
                      start: 50,
                      end: 100
                  }, {
                      start: 0,
                      end: 10,
                      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                      handleSize: '80%',
                      handleStyle: {
                          color: '#fff',
                          shadowBlur: 3,
                          shadowColor: 'rgba(0, 0, 0, 0.6)',
                          shadowOffsetX: 2,
                          shadowOffsetY: 2
                      }
                  }],
                  series: [
                      {
                          name:val.reqInfo.metric,
                          type:'line',
                          smooth:true,
                          symbol: 'none',
                          sampling: 'average',
                          itemStyle: {
                              normal: {
                                  color: 'rgb(255, 70, 131)'
                              }
                          },
                          areaStyle: {
                              normal: {
                                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                      offset: 0,
                                      color: 'rgb(255, 158, 68)'
                                  }, {
                                      offset: 1,
                                      color: 'rgb(255, 70, 131)'
                                  }])
                              }
                          },
                          data: val.data
                      }
                  ]
            };
            return option
      },
      dateFormat (t1) {
            var newDate = new Date();
            newDate.setTime(t1 * 1000);
            return [
              newDate.getFullYear(), 
              newDate.getMonth()+1, 
              newDate.getDate()
              ].join("/")+' '+ [
              newDate.getHours(), 
              newDate.getMinutes()].join(':');
      },
      getUserChartInit() {
        this.myChart = echarts.init(document.getElementById('userChart'));
        this.myChart.showLoading();
        this.myChart.setOption(this.getOption(this.showDataObj));
        this.myChart.hideLoading();
      
      },
      getDataFormater(metric_name, data){
          let args = metric_name.split('.')
          let metricType = args[0]
          let percent = args[args.length-1]
          if (metricType == 'mem' && percent !== 'percent'){
            return Math.floor(data/1024/1024)
          }else{
            return data
          }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getUserChartInit();
      })
    },
    created() {
        this.$bus.$on('submit-event', this.eventHandler)
    },
    beforeDestroy() {
      this.$bus.$off('submit-event', this.handleMyEvent)
    }
  };
</script>
<style scope>
  .chart{
    background-color: white;
    border-radius: 4px;
    margin-top: 30px
  }
  .chart_left{
    border-right:#F2F2F2 10px solid;
  }
</style>
