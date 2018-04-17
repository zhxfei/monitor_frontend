<template>
  
  <div class="chart-container">
        <div :id="this.guageid" style="height: 400px" >图表加载失败</div>
  </div>

</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'

export default {
    name: 'gauge',
    data(){
        return  {
            myChart : '',
            showHost: this.$defaultShowHost,   // default
            // id_name : 'gauge1',
            showdata: {}
        }
    },
    props: [
      'guageid',
      'metricName'  
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
        getOption(metric_info){
            let option = {
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                // toolbox: {
                //     feature: {
                //         restore: {},
                //         saveAsImage: {}
                //     }
                // },
                series: [
                    {
                        name: this.showdata.name,
                        type: 'gauge',
                        detail: {formatter:'{value}'},
                        data: [{value: this.showdata.value, name: this.showdata.name}]
                    }
                ]
            };
            return option
        },
        getUserChartInit() {
            this.getDataInit()

            this.myChart = echarts.init(document.getElementById(this.guageid));
            this.myChart.showLoading()

            this.myChart.setOption(this.getOption());
            this.myChart.hideLoading();
            
        },
        getDataInit(){
            let n_time = new Date();

            let req_data = {
                endpoint: this.showHost,
                metric: this.metricName,
                s_time: Date.parse(n_time)/ 1000,
                e_time: Date.parse(n_time)/ 1000,
                limit: 1
            }

            let req_info = qs.stringify(req_data);

            axios.post('http://' + this.$apiHost + '/monitor/v1/items', req_info,
                {
                    headers:{
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Accept': '*/*'
                    }
                })
            .then((res) => {
                this.showdata.name = this.metricName;
                this.showdata.value = res.data[0].value 
                this.myChart.setOption(this.getOption());
                this.myChart.hideLoading();
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        toggleEventHandler(formData){
          this.showHost = formData.chosedhost
          this.showdata = {}
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getUserChartInit();
      })
        // this.getUserChartInit();
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
