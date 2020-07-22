<template>
  <div class="boxs">
    <div class="seek">
      <!-- <i class="icon iconfont icon-sousuo"></i> -->
      <Input search enter-button v-model.trim="writeCont" @click.native="searchPlace"></Input>
    </div>
    <div class="chj_mapaddress_map">
      <div id="containers" class="mymap"></div>
    </div>
    <div class="map_foot">
      <Button style="float:left;margin-right:10px;" type="primary" id="point">鼠标绘制点</Button>
      <Button style="float:left;margin-right:10px;" type="primary" id="line">鼠标绘制线</Button>
      <Button style="float:left" type="primary" id="polygon">鼠标绘制面</Button>
      <Button @click="ok()">取消</Button>
      <Button type="primary" @click="ok()">确定</Button>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      param: "",
      site: "",
      map_data: [],
      value1: 0,
      ul_show: false,
      click_type: null,
      writeCont: "",
      map: null
    };
  },
  mounted() {
    this.loadmap(); //加载地图和相关组件
  },
  methods: {
    searchPlace() {
      this.map.clearMap();
      if (this.writeCont) {
        this.locationShow(this.writeCont);
      }
    },
    //位置回显
    locationShow(val) {
      this.map.clearMap();
      var marker = null;
      let then = this;
      var lnglatXY = []; //经纬
      var geocoder = new AMap.Geocoder();
      geocoder.getLocation(val, function(status, result) {
        if (status === "complete" && result.geocodes.length) {
          var lnglat = result.geocodes[0].location;
          marker = new AMap.Marker({
            offset: new AMap.Pixel(-16, -58),
            animation: "AMAP_ANIMATION_DROP"
          });
          then.map.add(marker);
          marker.setPosition(lnglat);
          then.map.setFitView(marker);
          then.site = result.geocodes[0].formattedAddress;
          let adcode = result.geocodes[0].adcode;
          lnglatXY[0] = Number(result.geocodes[0].location.lng);
          lnglatXY[1] = Number(result.geocodes[0].location.lat);
          then.map_data = [lnglatXY];
          then.click_type = 1;
        } else {
          then.$Message.warning("根据地址查询位置失败!请输入详细地址");
        }
      });
    },
    loadmap() {
      var index = this;
      this.map = new AMap.Map("containers", {
        resizeEnable: true,
        zoom: 13 //地图显示的缩放级别，
      });
      var mouseTool = new AMap.MouseTool(this.map);
      AMap.event.addDomListener(
        document.getElementById("point"),
        "click",
        function() {
          index.map.clearMap();
          mouseTool.marker({ offset: new AMap.Pixel(-14, -11) });
          index.click_type = 1;
        },
        false
      );
      AMap.event.addDomListener(
        document.getElementById("line"),
        "click",
        function() {
          index.map.clearMap();
          mouseTool.polyline();
          index.click_type = 2;
        },
        false
      );
      AMap.event.addDomListener(
        document.getElementById("polygon"),
        "click",
        function() {
          index.map.clearMap();
          mouseTool.polygon();
          index.click_type = 3;
        },
        false
      );
      AMap.event.addListener(mouseTool, "draw", function(type, obj) {
        var polygonItem = type.obj;
        if (index.click_type == 3 || index.click_type == 2) {
          var path = polygonItem.getPath(); //取得绘制的多边形和折现的每一个点坐标
          var adder = new Array();
          for (var i = 0; i < path.length; i++) {
            adder.push([path[i].P, path[i].O]);
          }
          index.map_data = adder;
        } else {
          var path = polygonItem.getPosition(); //取得点坐标
          var adder = new Array();
          adder.push([path.P, path.O]);
          index.map_data = adder;
        }
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(index.map_data[0], function(status, result) {
          if (status === "complete" && result.info === "OK") {
            index.site = result.regeocode.formattedAddress;
          }
        });
      });
      // var lnglatXY = []; //定义坐标
      // map.on("click", function(e) {
      //   lnglatXY[0] = Number(e.lnglat.getLng());
      //   lnglatXY[1] = Number(e.lnglat.getLat());

      //   map.setFitView();
      // });
      // mouseTool = new AMap.MouseTool(map);
      // mouseTool.marker({
      //   animation: "AMAP_ANIMATION_DROP"
      // });
      // index.click_type = 1;
      //输入框提示
      // var autoOptions = {
      //   input: "tipi"
      // };
      // var auto = new AMap.Autocomplete(autoOptions);
      // var placeSearch = new AMap.PlaceSearch({
      //   map: map
      // });
      // function select(e) {
      //   placeSearch.setCity(e.poi.adcode);
      //   placeSearch.search(e.poi.name); //关键字查询查询
      // }
      // AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
    },
    ok() {
      this.$emit("refreshList", this.site, this.map_data, this.click_type);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../../font/iconfont.css";
.boxs {
  position: relative;
  background: #fff;
}
.chj_mapaddress_map {
  height: 400px;
}
.mymap {
  width: 100%;
  height: 100%;
}
.seek {
  position: absolute;
  z-index: 1000;
  margin: 20px;
  height: 20px;
}
.seek > i {
  float: right;
  background: #23a5f6;
  height: 30px;
  line-height: 24px;
  padding: 5px;
  color: #fff;
}
.seek > input {
  height: 30px;
}
.map_foot {
  height: 35px;
  text-align: right;
  /* margin-bottom: 10px; */
  margin-top: 10px;
}
.map_foot > a {
  display: inline-block;
  width: 60px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 16px;
  color: #23a5f6;
  border: 1px solid #23a5f6;
  border-radius: 2px;
  margin-right: 50px;
  border-radius: 5px;
}
.map_foot .map_foot_right {
  background: #23a5f6;
  color: #fff;
}
.map_right {
  position: absolute;
  height: 350px;
  width: 200px;
  top: 40px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.map_right li {
  margin: 0 auto;
  width: 90%;
  color: #ffffff;
}
.map_right ul {
  margin-top: 10px;
}
.map_sele {
  display: inline-block;
  margin-left: 20px;
}
.map_right ul li.button {
  text-align: center;
  margin-top: 10px;
}
.map_right ul li.button div {
  width: 50px;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  border: 1px solid #23a5f6;
  color: #23a5f6;
  border-radius: 5px;
}
.icon-diaojiekongzhi2 {
  position: absolute;
  right: 0;
  top: 0;
  color: #23a5f6;
  font-size: 20px;
  background: rgba(0, 0, 0, 0.8);
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
}
</style>
