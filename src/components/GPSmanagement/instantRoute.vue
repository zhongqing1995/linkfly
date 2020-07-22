<template>
  <div class="mapBox">
    <!--地图部分-->
    <div id="instantRoute" style="width:100%;height:600px;"></div>
  </div>
</template>

<script>
    export default {
      name: "instantRoute",
      props: ["instantRouteShou"],
      data() {
        return {
          map: {},
          timer:null,
        }
      },
      mounted() {
        this.map = new AMap.Map("instantRoute", {
          resizeEnable: true,
          zoom: 10,
          center: [112.986399,28.210429]
        });


      },
      methods:{
        getinstantRoute(){
          console.log(111);
          let _this=this;
          _this.map.clearMap();
          this.$post("/gps/tcp_device/tcpDeviceNowTrack").then(res=> {
            console.log(res);
            if (res.code == 1) {
              res.data.forEach(item=>{
                // wgs84togcj02

                // 创建点实例
                if(item.lon!=="" && item.lat!==""){
                  let location=wgs84togcj02(Number(item.lon),Number(item.lat));
                  var marker = new AMap.Marker({
                    icon: new AMap.Icon({
                      image: "/static/linkFly/GPS.png",
                      size: new AMap.Size(28, 37),
                      imageSize: new AMap.Size(28, 37) // 根据所设置的大小拉伸或压缩图片
                    }),
                    offset: new AMap.Pixel(-14, -37),
                    position: location,
                    map: _this.map
                  });
                  marker.setLabel({
                    offset: new AMap.Pixel(-35, -25),  //设置文本标注偏移量
                    content: `<div >${item.ime}</div>`, //设置文本标注内容
                    direction: 'top' //设置文本标注方位
                  });
                }
              })
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }

      },
      watch: {
        instantRouteShou(val){
          if(val){
            this.getinstantRoute();
            this.timer=setInterval(()=>{
              this.getinstantRoute()
            },5000)
          }else {
            clearInterval(this.timer);
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .mapBox{
    position: relative;
  }
</style>
