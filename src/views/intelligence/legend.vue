<template>
	<div class="lengend">
	</div>
</template>
<script>
import Bus from "../../utils/Bus"
export default {
  name: "lengend",
  data () {
	  return {
      data:[],
      showLegendData:[]
	  }
    },
    props: ["legendData1"],
    watch: {
    legendData1: function(){
      this.showLegendData = this.legendData1;
      console.log(this.showLegendData)
    }
  },
  methods: {

  },
  mounted () {
    console.log(this.showLegendData);
    Bus.$on("conditions", (res) => {
      console.log(res);

    });
  }
};
</script>
<style scoped lang="less">
</style>
