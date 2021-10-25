<template>
  <div>
    <section class="flex flex-between">
      <div
        ref="firstEcharts"
        style="width: 49%; height: 300px"
        v-on-echart-resize
      ></div>
      <div
        ref="secondEcharts"
        style="width: 49%; height: 300px"
        v-on-echart-resize
      ></div>
    </section>
    <section class="flex flex-between">
      <div
        ref="threeEcharts"
        style="width: 49%; height: 300px"
        v-on-echart-resize
      ></div>
      <div
        ref="fourEcharts"
        style="width: 49%; hieght: 300px"
      >
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.drawChartOne();
      this.drawChartTwo();
      this.drawChartThree();
    });
  },
  methods: {
    drawChartOne() {
      let myChart = this.$echarts.init(this.$refs.firstEcharts);
      // 指定图表的配置项和数据
      let option = {
        // 标题
        title: {
          text: "echarts 入门实例1",
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
      myChart.setOption(option);
    },
    drawChartTwo() {
      let myChart = this.$echarts.init(this.$refs.secondEcharts);
      let option = {
        title: {
          text: "echarts 入门实例2",
        },
        xAxis: {
          data: ["A", "B", "C", "D", "E"],
        },
        yAxis: {},
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: "bar",
            stack: "x",
          },
          {
            data: [5, 4, 3, 5, 10],
            type: "bar",
            stack: "x",
          },
        ],
      };

      // 最重要的一步，把option配置项数据放入图表中
      myChart.setOption(option);
    },
    drawChartThree() {
      let data = [];
      for (let i = 0; i < 5; ++i) {
        data.push(Math.round(Math.random() * 200));
      }
      let myChart = this.$echarts.init(this.$refs.threeEcharts);
      let option = {
        xAxis: {
          max: "dataMax",
        },
        yAxis: {
          type: "category",
          data: ["A", "B", "C", "D", "E"],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 2, // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            name: "X",
            type: "bar",
            data: data,
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
          },
        ],
        legend: {
          show: true,
        },
        animationDuration: 3000,
        animationDurationUpdate: 2000,
        animationEasing: "linear",
        animationEasingUpdate: "linear",
      };
      function update() {
        var data = option.series[0].data;
        for (var i = 0; i < data.length; ++i) {
          if (Math.random() > 0.9) {
            data[i] += Math.round(Math.random() * 2000);
          } else {
            data[i] += Math.round(Math.random() * 200);
          }
        }
        myChart.setOption(option);
      }

      setInterval(function () {
        update();
      }, 3000);
    },
  },
};
</script>

<style>
</style>