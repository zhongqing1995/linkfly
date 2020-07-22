<template>
  <div class="uavHistory">
    <div class="box">
      <div id="container" class="mymap"></div>
      <div class="input-card">
        <p>播放速度：</p>
        <Select v-model="velocityVal">
          <Option :value="velocity">正常</Option>
          <!-- <Option :value="velocity*2">1X</Option> -->
          <Option :value="velocity*2">2X</Option>
          <Option :value="velocity*4">4X</Option>
          <Option :value="velocity*8">8X</Option>
          <Option :value="velocity*20">20X</Option>
        </Select>
        <Button type="primary" @click="startAct">开始动画</Button>
        <Button type="primary" @click="pauseAct">暂停动画</Button>
        <Button type="primary" @click="continueAct">继续动画</Button>
        <Button type="primary" @click="endAct">停止动画</Button>
      </div>
    </div>
  </div>
</template>
<script>
// import "./other";
export default {
  props: ["hisId"],
  data() {
    return {
      map: null,
      locationArr: [],
      heightArr: [],
      marker: null,
      velocity: "",
      velocityVal: 200 //轨迹播放的速度
    };
  },
  mounted() {
    this.map = new AMap.Map("container", {
      resizeEnable: true,
      zoom: 8 //地图显示的缩放级别
    });
    // this.searchUav();
  },
  methods: {
    //开始轨迹回放
    startAct() {
      this.marker.moveAlong(this.locationArr, this.velocityVal);
    },
    //暂停轨迹回放
    pauseAct() {
      this.marker.pauseMove();
    },
    //继续轨迹回放
    continueAct() {
      this.marker.resumeMove();
    },
    //结束轨迹回放
    endAct() {
      this.marker.stopMove();
    },
    //画轨迹回放
    drawUavLine(locations, heightArr) {
      let startMarker, endMarker;
      startMarker = new AMap.Marker({
        position: locations[0],
        icon: new AMap.Icon({
          image: "../../../static/img/start.png",
          size: new AMap.Size(50, 50),
          imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
        }),
        offset: new AMap.Pixel(-24, -30),
        map: this.map
      });
      endMarker = new AMap.Marker({
        position: locations[locations.length - 1],
        icon: new AMap.Icon({
          image: "../../../static/img/end.png",
          size: new AMap.Size(50, 50),
          imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
        }),
        offset: new AMap.Pixel(-24, -30),
        map: this.map
      });
      this.marker = new AMap.Marker({
        position: locations[0],
        icon: new AMap.Icon({
          image: "../../../static/publicimg/uav.png",
          size: new AMap.Size(30, 30),
          imageSize: new AMap.Size(30, 30) // 根据所设置的大小拉伸或压缩图片
        }),
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
        map: this.map
      });
      let polyline = new AMap.Polyline({
        path: locations, // 设置线覆盖物路径
        showDir: true,
        strokeColor: "#fff", // 线颜色
        strokeWeight: 3, // 线宽
        lineCap: "round",
        lineJoin: "round",
        map: this.map
      });
      for (let i = 0; i < locations.length - 1; i++) {
        let lineColor = "";
        let polylinePath = [];
        if (locations[i].lng) {
          polylinePath = [
            new AMap.LngLat(locations[i].lng, locations[i].lat),
            new AMap.LngLat(locations[i + 1].lng, locations[i + 1].lat)
          ];
        } else {
          polylinePath = [
            new AMap.LngLat(locations[i][0], locations[i][1]),
            new AMap.LngLat(locations[i + 1][0], locations[i + 1][1])
          ];
        }
        //区间颜色
        if (heightArr[i] <= 100) {
          lineColor = "#42ffd2";
        } else if (heightArr[i] > 100 && heightArr[i] <= 200) {
          lineColor = "#42fcff";
        } else if (heightArr[i] > 200 && heightArr[i] <= 300) {
          lineColor = "#42cdff";
        } else if (heightArr[i] > 300 && heightArr[i] <= 400) {
          lineColor = "#429eff";
        } else {
          lineColor = "#426fff";
        }
        //创建线路
        let polyline = new AMap.Polyline({
          path: polylinePath,
          showDir: true,
          strokeColor: lineColor, // 线颜色
          strokeWeight: 6, // 线宽
          lineCap: "round",
          lineJoin: "round",
          map: this.map
        });
      }
      this.map.setFitView();
      this.map.setZoom(17);
    },
    //列表搜索
    searchUav() {
      this.map.clearMap();
      this.$post("/admin/track/trackDetail", {
        track_id: this.hisId
      })
        .then(res => {
          if (res.code == 1) {
            let data = res.data.data.split("|");
            if (data.length > 0) {
              this.locationArr = [];
              this.heightArr = [];
              data.forEach(ele => {
                let element = JSON.parse(ele);
                this.locationArr.push([
                  element.DroneLongitude,
                  element.DroneLatitude
                ]);
                this.heightArr.push(element.DroneAltitude);
              });
              this.drawUavLine(this.locationArr, this.heightArr);
              let long = AMap.GeometryUtil.distanceOfLine(this.locationArr);
              this.velocity = Math.round(
                Math.round(long) / 1000 / (res.data.fly_time / 3600)
              );
              this.velocityVal = this.velocity;
            } else {
              this.$Message.warning("查询回放轨迹为空！");
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    hisId(newval, oldval) {
      this.searchUav();
    }
  }
};
</script>
<style lang="less" scoped>
.uavHistory {
  height: 97%;
  position: relative;
  .box {
    width: 100%;
    height: 100%;
    .mymap {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .input-card {
      position: absolute;
      right: 4px;
      bottom: 4px;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
      border-radius: 3px;
      width: 100px;
      height: auto;
      border-width: 0;
      border-radius: 4px;
      box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
      padding: 10px 10px;
      button {
        margin-top: 20px;
      }
    }
  }
}
</style>

