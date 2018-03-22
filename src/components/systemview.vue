<template>
    <div class="chart-container">

    <el-row>
      <el-col :span="6">
        <gauge :metric-name="initGaugeMetricList[0]" guageid="load1mingaugeechart"></gauge>
      </el-col>
      <el-col :span="6">
        <gauge :metric-name="initGaugeMetricList[1]" guageid="load5mingaugeechart"></gauge>
      </el-col>
      <el-col :span="6">
        <gauge :metric-name="initGaugeMetricList[2]" guageid="load15mingaugeechart"></gauge>
      </el-col>
      <el-col :span="6">
        <gauge :metric-name="initGaugeMetricList[3]" guageid="dfgaugeechart"></gauge>
      </el-col>


    </el-row>


    <el-row>
      <el-col :span="24">
        <multiline :init-metric-list="initLoadMetricList" echartsid="loadecharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <multiline :init-metric-list="initNetMetricList" echartsid="netcharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <multiline :init-metric-list="initCpuMetricList"  echartsid="cpuecharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
    <el-col :span="24">
        <multiline :init-metric-list="initMemMetricList"  echartsid="memecharts"></multiline>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import gauge from './gauge'
import multiline from './multiline'


export default {
    name: 'systemview',
    data () {
        return {
            initGaugeMetricList: [
                "system.load.1min",
                "system.load.avg.5min",
                "system.load.avg.15min",
                'df.bytes.used.percent/home',
            ],
            initCpuMetricList: [
                "cpu.system.percent",
                "cpu.user.percent",
                "cpu.iowait.percent",
                "cpu.idle.percent",
            ],
            initMemMetricList : [
                "mem.virtual.used",
                "mem.virtual.cached",
                "mem.virtual.available",
                "mem.virtual.buffers",
                "mem.virtual.free"
            ],
            initLoadMetricList: [
                "system.load.avg.1min/core",
            ],
            initNetMetricList: [
                // "net.conn.syn_recv",
                "net.conn.established",
                "net.conn.time_wait",
                "net.conn.syn_recv"
            ]
        }
    },
    components: {
        gauge,
        multiline
    },
    methods: {
        
    },
        
}
</script>

<style>
 .el-row{
     height: 100px;
 }
</style>
