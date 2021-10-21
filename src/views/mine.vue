<template>
  <div>
    <div ref="firstEcharts" style="width: 50%; height: 300px" v-on-echart-resize></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myChart: null
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      this.myChart = this.$echarts.init(this.$refs.firstEcharts);
      // 指定图表的配置项和数据
      let option = {
        // 标题
        title: {
          text: "echarts 入门实例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };

      // 最重要的一步，把option配置项数据放入图表中
      this.myChart.setOption(option);
    },
  },
};
</script>

<style>
</style>