<template>
  <div class="mapBox">
    <!--控件部分-->
    <div class="control">
      <div>
        <DatePicker
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="开始时间"
          style="width: 160px"
          v-model="start_time"
          @on-change="start_time=$event"
        ></DatePicker>
        <DatePicker
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="结束时间"
          style="width: 160px"
          v-model="end_time"
          @on-change="end_time=$event"
        ></DatePicker>
        <img
          style="vertical-align:middle;cursor:pointer;"
          @click="select"
          src="/static/publicimg/search_white.png"
          alt
          srcset
        />
      </div>
      <div class="select">
        <RadioGroup v-model="status">
          <Radio label="点"></Radio>
          <Radio label="线"></Radio>
        </RadioGroup>
      </div>
    </div>
    <!--地图部分-->
    <div id="RouteMap" style="width:100%;height:600px;"></div>
  </div>
</template>

<script>
    export default {
      name: "pastRoute",
      props: ["tcp_device_id"],
      data() {
        return {
          map: {},
          start_time:null,
          end_time:null,
          status: '点',
          overlayGroups:null,//覆盖物群组
          location:[],//坐标点合计
        }
      },
      mounted() {
        this.map = new AMap.Map("RouteMap", {
          resizeEnable: true,
          zoom: 10,
          center: [112.986399,28.210429]
        });

      },
      methods:{
        select(){
          let _this=this;
          this.map.clearMap();
          this.location=[];

          let data={
            tcp_device_id:this.tcp_device_id,
            start_time:this.start_time,
            end_time:this.end_time
          };
          // console.log(data);
          // console.log("时间",this.start_time,this.end_time);

          this.$post("/gps/tcp_device/tcpDeviceHistoryTrack",data).then(res=> {
            if (res.code == 1) {
              let markers = [];
              // console.log("轨迹数据",res.data);
              res.data.forEach(item=>{
                // 创建点实例
                var marker = new AMap.Marker({
                  position: new AMap.LngLat(item.lon, item.lat)
                });

                markers.push(marker);
                _this.location.push([item.lon, item.lat])
              });
              //地图聚焦到地点
              _this.map.setFitView(markers);
              // 创建覆盖物群组，并将 marker 传给 OverlayGroup
              _this.overlayGroups = new AMap.OverlayGroup(markers);
              // console.log("_this.overlayGroups", _this.overlayGroups);
              // 添加覆盖物群组
              _this.map.add(_this.overlayGroups);

            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      },
      watch: {
        tcp_device_id (val) {
          this.map.setZoomAndCenter(10, [112.986399,28.210429]); //同时设置地图层级与中心点
          this.select()
        },
        status (val) {
          if(val=='线'){
            this.map.clearMap();
            var polyline = new AMap.Polyline({
              path: this.location,
              isOutline: true,
              outlineColor: '#ffeeff',
              borderWeight: 3,
              strokeColor: "#3366FF",
              strokeOpacity: 1,
              strokeWeight: 6,
              // 折线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              strokeDasharray: [10, 5],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
            });
            polyline.setMap(this.map);
            this.map.setFitView([ polyline ]);

            let startMarker, endMarker;
            startMarker = new AMap.Marker({
              position: this.location[0],
              icon: new AMap.Icon({
                image: "../../../static/zxhImg/origin.png",
                size: new AMap.Size(50, 50),
                imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
              }),
              offset: new AMap.Pixel(-25, -48),
              map: this.map
            });
            endMarker = new AMap.Marker({
              position: this.location[this.location.length - 1],
              icon: new AMap.Icon({
                image: "../../../static/zxhImg/end.png",
                size: new AMap.Size(50, 50),
                imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
              }),
              offset: new AMap.Pixel(-25, -48),
              map: this.map
            });

          }else {
            this.select()
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .mapBox{
    position: relative;
    .control{
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 1000;
      .select{
        background-color:#fff;
        width: 100px;
        height: 30px;
        border-radius: 5px;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 34px;
      }
    }
  }
</style>
