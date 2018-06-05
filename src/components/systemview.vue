<template>
  <div class="chart-container">

    <el-row>
      <el-col :span="6">
        <gauge :metrics-name="initGaugeMetricsList[0]" guageid="load1mingaugeechart"></gauge>
      </el-col>
      <el-col :span="6">
        <gauge :metrics-name="initGaugeMetricsList[1]" guageid="load5mingaugeechart"></gauge>
      </el-col>
      <el-col :span="6">
        <gauge :metrics-name="initGaugeMetricsList[2]" guageid="load15mingaugeechart"></gauge>
      </el-col>
      <el-col :span="6">
        <gauge :metrics-name="initGaugeMetricsList[3]" guageid="dfgaugeechart"></gauge>
      </el-col>
    </el-row>


    <el-row>
      <el-col :span="24">
        <multiline :init-metrics-list="initLoadMetricsList" echartsid="loadecharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <multiline :init-metrics-list="initNetMetricsList" echartsid="netcharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <multiline :init-metrics-list="initCpuMetricsList" echartsid="cpuecharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <multiline :init-metrics-list="initMemMetricsList" echartsid="memecharts"></multiline>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <multiline :init-metrics-list="initNetDevMetricsList" echartsid="netdevecharts"></multiline>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import gauge from './gauge'
  import multiline from './multiline'


  export default {
    name: 'systemview',
    data() {
      return {
        initGaugeMetricsList: [
          "system.load.1min",
          "system.load.avg.5min",
          "system.load.avg.15min",
          'df.bytes.used.percent./',
        ],
        initCpuMetricsList: [
          "cpu.system.percent",
          "cpu.user.percent",
          "cpu.iowait.percent",
          "cpu.idle.percent",
        ],
        initMemMetricsList: [
          "mem.virtual.used",
          "mem.virtual.cached",
          "mem.virtual.available",
          "mem.virtual.buffers",
          "mem.virtual.free"
        ],
        initLoadMetricsList: [
          "system.load.avg.1min/core",
        ],
        initNetMetricsList: [
          // "net.conn.syn_recv",
          "net.conn.established",
          "net.conn.time_wait",
          "net.conn.syn_recv"
        ],
        initNetDevMetricsList: [
          "net.dev.bytes.sent." + this.$defaultShowNetDev,
          "net.dev.bytes.receive." + this.$defaultShowNetDev
        ]
      }
    },
    components: {
      gauge,
      multiline
    },
    methods: {},

  }
</script>

<style>
  .el-row {
    height: 100px;
  }
</style>
