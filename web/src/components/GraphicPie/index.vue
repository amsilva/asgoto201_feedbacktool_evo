<script>
import Highcharts from "highcharts";

export default {
  props: ["data"],
  data() {
    return {
      hcInstance: Highcharts,
      chartOptions: {
        colors: ["#2dac67", "#e0621e", "#daa300", "#c12525", "#259cc1"],
        chart: {
          type: "pie"
        },
        title: {
          text: ""
        },
        tooltip: false,
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.2f}%"
            },
            showInLegend: false
          }
        },
        series: [
          {
            innerSize: "60%",
            data: this.data
          }
        ]
      }
    };
  },
  watch: {
    data(newVal) {
      this.chartOptions.series[0].data= newVal;
      // console.log(newVal, this.chartOptions.series[0].data);
    }
  }
};
</script>

<template>
  <highcharts :options="chartOptions"></highcharts>
</template>
