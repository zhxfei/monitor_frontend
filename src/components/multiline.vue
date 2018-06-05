<template>

  <div class="chart-container">
    <div :id="this.echartsid" style="height: 400px">图表加载失败</div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import axios from 'axios'
  import qs from 'qs'

  export default {
    name: 'multiline',
    data() {
      return {
        myChart: '',
        showHost: this.$defaultShowHost,   // default
        // id_name : 'gauge1',
        showdate: [],
        showdata: []
      }
    },
    props: [
      'initMetricsList',
      'echartsid'
    ],
    watch: {
      showdata: {
        handler() {
          this.chart.setOption(this.getOption());
          this.chart.hideLoading();
        }
      },
      showHost: {
        handler() {
          console.log('show host changed');
          this.getDataInit();
        }
      }
    },
    methods: {
      counterDiff(arr) {
        let arrTmp = arr.slice(1, arr.length + 1);
        let res = [];
        for (let i = 0; i < arrTmp.length; i++) {
          res[i] = arrTmp[i] - arr[i]
        }
        return res
      },
      getOption() {
        let option = {
          title: {
            text: this.getTitle()
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.initMetricsList
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
      getTitle() {
        let markArray = this.initMetricsList[0].split(".", 2);
        return this.showHost + ":" + markArray[0] + '.' + markArray[1]
      },
      getYaxis() {
        let args = this.initMetricsList[0].split('.');
        if (args[args.length - 1] === 'percent' || args[3] === 'percent') {
          return {
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            }
          }
        }
        else if (args[0] === 'net' && args[1] === 'dev' && args[2] === 'bytes') {
          return {
            type: 'value',
            axisLabel: {
              formatter: '{value} kb'
            }
          }
        } else if (args[0] === 'mem') {
          return {
            type: 'value',
            axisLabel: {
              formatter: '{value} M'
            }
          }
        } else {
          return {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }
        }
      },
      dateFormat(t1) {
        let newDate = new Date();
        newDate.setTime(t1 * 1000);
        return [
          newDate.getFullYear(),
          newDate.getMonth() + 1,     // 这是个坑....
          newDate.getDate()
        ].join("/") + ' ' + [
          newDate.getHours(),
          newDate.getMinutes()].join(':');
      },
      getUserChartInit() {
        this.getDataInit();

        this.chart = echarts.init(document.getElementById(this.echartsid));
        this.chart.showLoading();
        this.chart.setOption(this.getOption());
        this.chart.hideLoading();
      },
      getDataInit() {
        this.showdata = [];
        this.showdate = [];

        let e_time = new Date();
        let s_time = new Date();
        s_time.setTime(e_time.getTime() - 3600 * 1000 * 6);
        for (let metrics_name of this.initMetricsList) {
          let req_data = {
            endpoint: this.showHost,
            metrics: metrics_name,
            s_time: Date.parse(s_time) / 1000,
            e_time: Date.parse(e_time) / 1000
          };
          let req_info = qs.stringify(req_data);

          axios.post('http://' + this.$apiHost + '/monitor/v1/items', req_info,
            {
              headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': '*/*'
              }
            })
            .then((res) => {
              if (res.data.length !== 0){
                this.showdata.push({
                  name: metrics_name,
                  type: 'line',
                  data: this.genShowData(metrics_name, res.data)
                });
              } else {
              }
            })
            .catch((err) => {
              console.log(err);
              this.$notify({
                title: "错误",
                message: "数据加载错误",
                type: "warning"
              });
            })
        }
      },
      genShowData(metrics_name, data) {
        let resData = [];
        let dataValueArray = data.map(function (x) {
          return x.value
        });
        let itemType = data[0].counterType;
        console.log(itemType);
        if (itemType === 'COUNTER') {
          dataValueArray = this.counterDiff(dataValueArray)
        }

        let args = metrics_name.split('.');
        let metricsType = args[0];
        let percent = args[args.length - 1];
        if (metricsType === 'mem' && percent !== 'percent') {
          resData = dataValueArray.map(function (x) {
              return Math.floor(x / 1024 / 1024)
            }
          )
        } else if (metrics_name.includes('net.dev.bytes')) {
          resData = dataValueArray.map(function (x) {
              return Math.floor(x / 1000)
            }
          )
        }
        else {
          resData = dataValueArray
        }

        if (this.showdate.length === 0) {
          for (let obj of data) {
            this.showdate.push(this.dateFormat(obj.timestamp));
          }
        }
        return resData;
      },
      // eventHandler
      toggleEventHandler(formData) {
        this.showdate = [];
        this.showdata = [];
        this.showHost = formData.chosedhost
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.getUserChartInit();
      })
    },
    created() {
      this.$bus.$on('toggle-event', this.toggleEventHandler)
    },
    beforeDestroy() {
      this.$bus.$off('toggle-event', this.handleMyEvent)
    }

  }

</script>

<style>

</style>
