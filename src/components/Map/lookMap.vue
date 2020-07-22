<template>
  <div class="lookPosition">
    <div id="lookPos" style="width:100%;height:300px;"></div>
  </div>
</template>
<script>
export default {
  name: "lookPosition",
  props: ["map_type", "map_point"],
  data() {
    return {
      map: {}
    };
  },
  methods: {
    drawMap() {
      this.map.clearMap();
      var location = JSON.parse(this.map_point);
      if (this.map_type == 1) {
        let marker = new AMap.Marker({
          position: location[0],
          offset: new AMap.Pixel(0, 0),
          zIndex: 300
        });
        marker.setMap(this.map);
        this.map.setFitView();
      } else if (this.map_type == 2) {
        var polyline = new AMap.Polyline({
          path: location, //设置线覆盖物路径
          strokeColor: "#010037", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线宽
          strokeStyle: "solid", //线样式
          strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(this.map);
        this.map.setFitView();
      } else if (this.map_type == 3) {
        var polygon = new AMap.Polygon({
          path: location, //设置多边形边界路径
          strokeColor: "blue", //线颜色
          strokeOpacity: 0.6, //线透明度
          strokeWeight: 3, //线宽
          fillColor: "#010037", //填充色
          fillOpacity: 0.35 //填充透明度
        });
        polygon.setMap(this.map);
        this.map.setFitView();
      }
    }
  },
  mounted() {
    this.map = new AMap.Map("lookPos", {
      mapStyle: "amap://styles/normal",
      resizeEnable: true,
      zoom: 12,
      center: [110.85, 26.43]
    });
    this.drawMap();
  },
  // watch: {
  //   map_point(newval, oldval) {
  //     if (newval) {
  //       this.drawMap();
  //     }
  //   }
  // }
};
</script>
<style scope lang="less">
.lookPosition {
}
</style>
