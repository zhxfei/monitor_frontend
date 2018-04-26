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
        showHost: ['newbie-unknown85822.i.nease.net', 'newbie-unknown85823.i.nease.net'],   // default
        showItem: "cpu.idle.percent",
        // id_name : 'gauge1',
        showdate: [],
        showdata: [],
        timeRange: []

      }
    },
    props: [
      'echartsid'
    ],
    watch: {
      showdata: {
        handler() {
          this.chart.setOption(this.getOption());
          this.chart.hideLoading();
        }
      },
    },
    methods: {
      getOption() {
        let option = {
          title: {
            text: this.getTitle()
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.showHost
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
        return this.showItem + "同类指标对比"
      },

      getYaxis() {
        let args = this.showItem.split('.');
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
        this.showdate = []
      },
      counterDiff(arr) {
        let arrTmp = arr.slice(1, arr.length + 1);
        let res = [];
        for (let i = 0; i < arrTmp.length; i++) {
          res[i] = arrTmp[i] - arr[i];
        }
        return res
      },
      genShowData(metric_name, data) {
        let resData = [];
        let dataValueArray = data.map(function (x) {
          return x.value
        });
        let itemType = data[0].counterType;
        if (itemType === 'COUNTER') {
          dataValueArray = this.counterDiff(dataValueArray);
        }

        let args = metric_name.split('.');
        let metricType = args[0];
        let percent = args[args.length - 1];
        if (metricType === 'mem' && percent !== 'percent') {
          resData = dataValueArray.map(function (x) {
              return Math.floor(x / 1024 / 1024)
            }
          )
        } else if (metric_name.includes('net.dev.bytes')) {
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
      getDataFormater(metric_name, data) {
        let args = metric_name.split('.');
        let metricType = args[0];
        let percent = args[args.length - 1];
        if (metricType === 'mem' && percent !== 'percent') {
          return Math.floor(data / 1024 / 1024)
        } else {
          return data
        }
      },
      // eventHandler
      compareEventHandler(formData) {
        this.showdate = [];
        this.showdata = [];
        this.showHost = formData.chosedhost;
        this.showItem = formData.chosedItem;
        this.timeRange = formData.timeRange;
        for (let hostName of this.showHost) {
          let req_data = {
            endpoint: hostName,
            metric: this.showItem,
            s_time: Date.parse(this.timeRange[0]) / 1000,
            e_time: Date.parse(this.timeRange[1]) / 1000
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
              this.showdata.push({
                name: hostName,
                type: 'line',
                data: this.genShowData(this.showItem, res.data)
              });
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.getUserChartInit();
      })
    },
    created() {
      this.$bus.$on('compare-event', this.compareEventHandler)
    },
    beforeDestroy() {
      this.$bus.$off('compare-event', this.handleMyEvent)
    }

  }

</script>

<style>

</style>
