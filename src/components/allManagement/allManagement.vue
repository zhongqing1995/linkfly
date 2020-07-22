<template>
  <div :style="isBigData?'height:96%':'height:90%'">
    <div class="warpper_content_map" :style="isBigData?'':'margin-top: 0.15rem'" id="map_container">
      <div class="layers">
        <div class="img" @click="layerLists">
          <img src="/static/zxhImg/Thirdpartymap1.png" alt srcset />
        </div>
        <div v-if="isLayer" class="choose">
          <RadioGroup v-model="choose1" vertical @on-change="chooseLayer1">
            <Radio label="bz">
              <span>标准图</span>
            </Radio>
            <Radio label="wx">
              <span>卫星图</span>
            </Radio>
          </RadioGroup>
          <hr />
          <CheckboxGroup v-model="choose2" @on-change="chooseLayer2">
            <Checkbox label="路况"></Checkbox>
            <br />
            <Checkbox label="路网"></Checkbox>
            <br />
            <Checkbox label="工程"></Checkbox>
            <br />
            <Checkbox label="人员在线"></Checkbox>
            <br />
            <Checkbox label="第三方图层"></Checkbox>
            <br />
            <Checkbox label="全景图"></Checkbox>
            <br />
            <Checkbox label="三维图层"></Checkbox>
            <br />
            <Checkbox label="正射图"></Checkbox>
            <br />
            <Checkbox label="项目名称"></Checkbox>
            <br />
            <Checkbox label="默认标注"></Checkbox>
            <br />
            <Checkbox v-if="!isBigData" label="显示右侧栏"></Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div class="allSerch" v-if="isBigData">
        <!--<Cascader-->
        <!--filterable-->
        <!--placeholder="请选择区域"-->
        <!--v-model="serch_city"-->
        <!--:data="regionArr"-->
        <!--:load-data="loadData"-->
        <!--@on-change="getregionArr"-->
        <!--change-on-select-->
        <!--clearable-->
        <!--style="display:inline-block;"-->
        <!--&gt;</Cascader>-->
        <FormOrganization :organization="regionArr" v-model="serch_city"></FormOrganization>
        <img
          style="vertical-align:middle;cursor:pointer;"
          @click="searchPm"
          src="/static/publicimg/search.png"
          alt
          srcset
        />
      </div>
    </div>
    <!--详情-->
    <Modal v-model="detailModal" title="详情" width="80%">
      <Tabs v-if="detailModal" size="small" style="margin-top:10px;">
        <TabPane name="0" label="空中图片">
          <AerialImages></AerialImages>
        </TabPane>
        <TabPane name="1" label="地面数据">
          <floor></floor>
        </TabPane>
        <TabPane label="空中视频">
          <AerialVideo></AerialVideo>
        </TabPane>
        <TabPane label="标注">
          <labels></labels>
        </TabPane>
      </Tabs>
      <div slot="footer"></div>
    </Modal>
    <!-- 全景 -->
    <Modal v-model="photoModal" title="全景图" fullscreen>
      <div>
        <span>名称:{{quanjingJson.name}}</span>
        <span>经度:{{quanjingJson.lat}}</span>
        <span>纬度:{{quanjingJson.lon}}</span>
      </div>
      <div v-if="photoModal">
        <showphoto></showphoto>
      </div>
    </Modal>
    <!-- 查看正射 -->
    <Modal v-model="dialogZhengshe" title="查看正射" fullscreen>
      <div>
        <span>名称:{{zhengsheJson.name}}</span>
        <span>经度:{{zhengsheJson.lat}}</span>
        <span>纬度:{{zhengsheJson.lon}}</span>
      </div>
      <div id="zsContainer" style="height:100%;"></div>
      <Measure @measureChange="measureChange" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import MapLoader from "../../utils/wg_utils/Amap";
import Menu from "../self_component/Menu";
import FormOrganization from "../self_component/FormOrganization";
import region from "../../../static/region(1)";
export default {
  props: ["userData", "isBigData"],
  data() {
    return {
      regionName: "",
      zhengsheJson: {},
      quanjingJson: {},
      regionArr: region,
      dialogZhengshe: false,
      region: "",
      selectImg: 0,
      map: {}, //地图实例对象
      pro_list: [], //二级工程信息对象
      navBar_active: 0,
      serch_city: [], // 搜索的城市名字
      userMaker: null, //地面人员
      detailModal: false,
      photoModal: false,
      choose1: "wx",
      choose2: [
        "全景图",
        "三维图层",
        "显示右侧栏",
        "工程",
        "人员在线",
        "正射图"
      ],
      isLayer: false,
      satellite: null,
      trafficLayer: null,
      roadNet: null,
      googleLayer: null,
      googleLayer1: null,
      googleLayer2: null,
      photoLayer: [],
      threeLayer: [],
      overlayTaskGroups: null,
      zsLayer: [],
      isZs: true,
      overlayGroups: null, //全景覆盖物
      overlayThreeGroups: null, //三维覆盖物
      overlayOnlineGroups: null, //人员覆盖物
      overlayZSGroups: null, //正射覆盖物
      second_pm_id: null, //选择的二级工程id
      searchStatus: "region", //当前搜索状态
      projectTitle: false, //默认不显示项目名称
      XLH: null
    };
  },
  components: {
    AerialImages: resolve => {
      require([
        "../engineerManagement/thirdComponent/AerialImages.vue"
      ], resolve);
    },
    floor: resolve => {
      require(["../engineerManagement/thirdComponent/floor.vue"], resolve);
    },
    AerialVideo: resolve => {
      require([
        "../engineerManagement/thirdComponent/Aerial_video.vue"
      ], resolve);
    },
    panoramas: resolve => {
      require(["../engineerManagement/thirdComponent/panoramas.vue"], resolve);
    },
    labels: resolve => {
      require(["../engineerManagement/thirdComponent/label.vue"], resolve);
    },
    showphoto: resolve => {
      require(["./showphoto.vue"], resolve);
    },
    Measure: resolve => {
      require(["../Map/measure.vue"], resolve);
    },
    FormOrganization
  },
  created() {},
  methods: {
    ...mapActions(["getThreeData", "getPhotoSrc"]),
    searchPm() {
      this.choose2 = [
        "全景图",
        "三维图层",
        "显示右侧栏",
        "工程",
        "人员在线",
        "正射图"
      ];
      this.region =
        this.serch_city.length > 0
          ? this.serch_city[this.serch_city.length - 1]
          : "";
      this.pmInMap();
      this.draw3dPhoto();
      this.threeData();
      this.imageLayerLists();
      // this.addtest();
    },
    //ysq修改
    addtest() {
      var that = this;
      if (this.XLH) {
        this.map.remove(this.XLH);
      }

      var marker1 = new AMap.Marker({
        // 添加 Icon 图标 URL
        icon: new AMap.Icon({
          image: require("../../../static/linkFly/threePng.png"),
          size: new AMap.Size(60, 60),
          imageSize: new AMap.Size(50, 50)
        }),
        title: "浔龙河测试",
        zIndex: 100,
        position: [113.194606, 28.351758],
        map: that.map
      });

      if (this.projectTitle) {
        marker1.setLabel({
          offset: new AMap.Pixel(-44, -33),
          content: `<div class="mark_label"><P>浔河生态艺术小镇-王军</br>三维</P> </div>`
        });
      }

      marker1.content = `<div class="header" style="color:#999999">三维详情</div><ul>
                            <li>名字:浔河生态艺术小镇</li>
                            <li>经度:28.356350</li>
                            <li>纬度:113.183645</li>
                            <li>创建时间:2019-12-12 14:40:18</li>
                            <li><a style="color: red" target="_blank" href="http://129.204.9.15/cesiumDemo.html?src=http://129.204.9.15/static1/json/Production_3.json#/map">查看详情>></a></li>
                        </ul>
                          `;
      marker1.on("click", this.markerThree);
      this.XLH = marker1;
    },
    //ysq修改end
    loadData(item, callback) {
      var address = [];
      item.loading = true;
      this.$post("/base/common/regionChoose", {
        code: item.value,
        client: "web"
      }).then(response => {
        if (response.code == 1) {
          address = response.data;
          for (var i = 0; i < address.length; i++) {
            if (item.value.toString().length < 6) {
              item.children.push({
                value: address[i].code,
                label: address[i].name,
                children: [],
                loading: false
              });
            } else {
              item.children.push({
                value: address[i].code,
                label: address[i].name,
                children: []
              });
            }
          }
          item.loading = false;
          callback();
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    // getregionArr() {
    //   // 获取区域列表
    //   this.$publicdata.getAreaName("").then(data => {
    //     data.forEach(item => {
    //       this.regionArr.push({
    //         value: item.code,
    //         label: item.name,
    //         children: [],
    //         loading: false
    //       });
    //     });
    //   });
    // },
    // 测距
    measureChange(val) {
      this.$zxh_fun.draw(val, this.mouseTool);
    },
    changeNav(e, index) {
      this.navBar_active = index;
    },
    Init_map() {
      let that = this;
      MapLoader().then(
        AMap => {
          that.map = new AMap.Map("map_container", {
            // center: [112.97935279, 28.21347823],
            zoom: 11,
            features: ["bg", "road", "building"],
            mapStyle: this.isBigData
              ? "amap://styles/darkblue"
              : "amap://styles/normal"
          });
        },
        e => {
          console.log("地图加载失败", e);
        }
      );
    },
    // 显示地图上的任务信息
    ShowMarker() {
      let taskLayer = [];
      if (this.overlayTaskGroups) {
        this.map.remove(this.overlayTaskGroups);
      }
      //创建一个图标对象
      if (this.pro_list.length > 0) {
        this.pro_list.forEach(item => {
          let marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: require("../../../static/linkFly/engineerPng.png"),
              size: new AMap.Size(60, 60),
              imageSize: new AMap.Size(50, 50)
            }),
            offset: new AMap.Pixel(-30, -60),
            position: eval(item.location)[0]
          });

          if (this.projectTitle) {
            marker.setLabel({
              offset: new AMap.Pixel(-44, -33),
              content: `<div class="mark_label"><P>工程名:${item.pm_name}</P></div>`
            });
          }

          marker.content = `<div class="header" style="color:#999999">工程详情</div><ul>
                            <li>工程名:${item.pm_name}</li>
                            <li>负责人:${item.pm_administrator}</li>
                            <li>成立时间:${item.start_time}</li>
                            <li style="color: red" id=#${item.pm_id}>查看详情>></li>
                        </ul>
                          `;
          marker.data = item;
          marker.id = item.pm_id;
          taskLayer.push(marker);
          this.map.add(marker);
          marker.on("click", this.markerClick);
        });
        this.overlayTaskGroups = new AMap.OverlayGroup(taskLayer);
        this.map.add(this.overlayTaskGroups);
      }
    },
    //给信息窗体添加点击事件
    markerClick(e) {
      var then = this;
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(-10, -60)
      });
      infoWindow.setContent(e.target.content);
      infoWindow.open(this.map, e.target.getPosition());
      setTimeout(function() {
        var a = document.getElementById(`#${e.target.id}`);
        a.onclick = function() {
          then.getThreeData(e.target.data);
          then.detailModal = true;
        };
      }, 200);
    },
    pmInMap() {
      let data = {};
      if (this.searchStatus == "region") {
        data = {
          region: this.region
        };
      } else if (this.searchStatus == "project") {
        data = {
          second_pm_id: this.second_pm_id
        };
      }
      this.$post("/admin/second_pm/mapShowPm", data).then(res => {
        if (res.code == 1) {
          if (res.data) {
            this.pro_list = res.data.pmLists;
            this.regionName = res.data.city_name;
          } else {
            this.pro_list = [];
            this.$Message.warning("暂无工程数据!");
          }
          this.ShowMarker();
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //用户实时在线
    userOnline() {
      var that = this;
      if (this.overlayOnlineGroups) {
        this.map.remove(this.overlayOnlineGroups);
      }
      this.userMaker = [];
      if (this.userData) {
        this.userData.forEach(ele => {
          // 飞机
          if (ele.DroneLatitude && ele.DroneLongitude) {
            let marker = "";
            marker = new AMap.Marker({
              icon: new AMap.Icon({
                image: "/static/publicimg/uav.png",
                size: new AMap.Size(60, 60),
                imageSize: new AMap.Size(50, 50)
              }),
              angle: ele.DroneYaw,
              offset: new AMap.Pixel(-30, -60),
              position: [ele.DroneLongitude, ele.DroneLatitude],
              anchor: "center", //设置锚点
              map: that.map
            });
            marker.setLabel({
              offset: new AMap.Pixel(-44, -20),
              content: `<div class="mark_label"><P>${ele.name}</P>
            <P>高度：${ele.DroneAltitude} 角度：${ele.DroneYaw}</P></div>`
            });
            marker.data = ele;
            marker.on("click", this.toPublish);
            that.userMaker.push(marker);
          }
          if (ele.UserLongitude && ele.UserLatitude) {
            // 监测机
            if (ele.Client == 0) {
              let marker = "";
              marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image: "/static/linkFly/userPng.png",
                  size: new AMap.Size(60, 60),
                  imageSize: new AMap.Size(50, 50)
                }),
                offset: new AMap.Pixel(-30, -60),
                position: [ele.UserLongitude, ele.UserLatitude],
                anchor: "center", //设置锚点
                map: that.map
              });
              marker.setLabel({
                offset: new AMap.Pixel(-44, -20),
                content: `<div class="mark_label"><P>${ele.name}</P>`
              });
              marker.data = ele;
              marker.on("click", this.toPublish);
              that.userMaker.push(marker);
            } else if (ele.Client == 1) {
              // 地面人员
              if (ele.IsPublish == 1) {
                var image = require("../../../static/linkFly/livePng.png");
              } else {
                var image = require("../../../static/linkFly/userPng.png");
              }
              let marker = "";
              marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image: image,
                  size: new AMap.Size(60, 60),
                  imageSize: new AMap.Size(50, 50)
                }),
                offset: new AMap.Pixel(-30, -60),
                position: [ele.UserLongitude, ele.UserLatitude],
                anchor: "center", //设置锚点
                map: that.map
              });
              marker.setLabel({
                offset: new AMap.Pixel(-44, -20),
                content: `<div class="mark_label"><P>${ele.name}</P>
              </div>`
              });
              marker.data = ele;
              marker.on("click", this.toPublish);
              that.userMaker.push(marker);
            } else if (ele.Client == 2) {
              // 植保机
              let marker = "";
              marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image: "/static/linkFly/zhibao.png",
                  size: new AMap.Size(60, 60),
                  imageSize: new AMap.Size(50, 50)
                }),
                offset: new AMap.Pixel(-30, -60),
                position: [ele.UserLongitude, ele.UserLatitude],
                anchor: "center", //设置锚点
                map: that.map
              });
              marker.setLabel({
                offset: new AMap.Pixel(-44, -20),
                content: `<div class="mark_label"><P>${ele.name}</P></div>`
              });
              marker.data = ele;
              marker.on("click", this.toPublish);
              that.userMaker.push(marker);
            } else if (ele.Client == 3) {
              // 直升机
              let marker = "";
              marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image: "/static/linkFly/zhishengji.png",
                  size: new AMap.Size(60, 60),
                  imageSize: new AMap.Size(50, 50)
                }),
                offset: new AMap.Pixel(-30, -60),
                position: [ele.UserLongitude, ele.UserLatitude],
                anchor: "center", //设置锚点
                map: that.map
              });
              marker.setLabel({
                offset: new AMap.Pixel(-44, -20),
                content: `<div class="mark_label"><P>${ele.name}</P></div>`
              });
              marker.data = ele;
              marker.on("click", this.toPublish);
              that.userMaker.push(marker);
            }
          }
        });
      }
      if (this.userMaker.length > 0) {
        this.overlayOnlineGroups = new AMap.OverlayGroup(this.userMaker);
        this.map.add(this.overlayOnlineGroups);
      }
    },
    toPublish(e) {
      this.$bus.emit("showLive", e.target.data);
    },
    // 全景图
    draw3dPhoto() {
      if (this.overlayGroups) {
        this.map.remove(this.overlayGroups);
      }
      let data = {};
      if (this.searchStatus == "region") {
        data = {
          region: this.region
        };
      } else if (this.searchStatus == "project") {
        data = {
          second_pm_id: this.second_pm_id
        };
      }
      this.$post("/admin/panorama/panoramaMapShow", data).then(res => {
        if (res.code == 1) {
          if (res.data.data_list) {
            let photos = res.data.data_list;
            this.photoLayer = null;
            this.photoLayer = [];
            this.overlayGroups = null;
            photos.forEach((ele, index) => {
              let marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image: require("../../../static/linkFly/quanjing.png"),
                  size: new AMap.Size(60, 60),
                  imageSize: new AMap.Size(50, 50)
                }),
                offset: new AMap.Pixel(-30, -60),
                position: [ele.lon, ele.lat]
              });

              if (this.projectTitle) {
                marker.setLabel({
                  offset: new AMap.Pixel(-44, -33),
                  content: `<div class="mark_label"><P>${ele.short_name}-全景图</P> </div>`
                });
              }
              marker.content = `<div class="header" style="color:#999999">全景图详情</div><ul>
                            <li>名称:${ele.position}</li>
                            <li>经度:${ele.lat}</li>
                            <li>纬度:${ele.lon}</li>
                            <li style="color: red" id=$${ele.id}>查看详情>></li>
                        </ul>
                          `;
              marker.image_path = ele.image_path;
              marker.id = ele.id;
              marker.position = ele.position;
              marker.lat = ele.lat;
              marker.lon = ele.lon;
              this.photoLayer.push(marker);
              marker.on("click", this.markerPhoto);
            });
            this.overlayGroups = new AMap.OverlayGroup(this.photoLayer);
            this.map.add(this.overlayGroups);
            this.map.setFitView();
          }
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    // 全景图
    markerPhoto(e) {
      var then = this;
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(-10, -60)
      });
      infoWindow.setContent(e.target.content);
      infoWindow.open(this.map, e.target.getPosition());
      setTimeout(function() {
        var a = document.getElementById(`$${e.target.id}`);
        a.onclick = function() {
          then.photoModal = true;
          then.quanjingJson = {
            name: e.target.position,
            lat: e.target.lat,
            lon: e.target.lon
          };
          then.getPhotoSrc(e.target.image_path);
        };
      }, 200);
    },
    // 全景图
    layerLists() {
      this.isLayer = !this.isLayer;
    },
    // 第三方图层
    chooseLayer1(val) {
      if (val == "bz") {
        this.satellite.setMap(null);
      } else if (val == "wx") {
        this.satellite = new AMap.TileLayer.Satellite({
          map: this.map
        });
      }
    },
    // 第三方图层
    chooseLayer2(val) {
      console.log("触发了", val);
      let lk = 1,
        lw = 1,
        three = 1,
        photo = 1,
        threeDe = 1,
        zs = 1,
        user = 1,
        task = 1,
        online = 1;
      for (let i = 0; i < val.length; i++) {
        if (val[i] == "路网") {
          lw = 2;
        }
        if (val[i] == "路况") {
          lk = 2;
        }
        if (val[i] == "工程") {
          task = 2;
        }
        if (val[i] == "第三方图层") {
          three = 2;
        }
        if (val[i] == "全景图") {
          photo = 2;
        }
        if (val[i] == "三维图层") {
          threeDe = 2;
        }
        if (val[i] == "正射图") {
          zs = 2;
        }
        if (val[i] == "显示右侧栏") {
          user = 2;
        }
        if (val[i] == "人员在线") {
          online = 2;
        }
      }

      if (lk == 2) {
        if (this.trafficLayer) {
          this.map.remove(this.trafficLayer);
        }
        this.trafficLayer = new AMap.TileLayer.Traffic({
          map: this.map
        });
      } else {
        if (this.trafficLayer) {
          this.map.remove(this.trafficLayer);
        }
      }
      if (lw == 2) {
        if (this.roadNet) {
          this.map.remove(this.roadNet);
        }
        this.roadNet = new AMap.TileLayer.RoadNet({
          map: this.map
        });
      } else {
        if (this.roadNet) {
          this.map.remove(this.roadNet);
        }
      }
      if (three == 2) {
        if (this.googleLayer1) {
          this.map.remove(this.googleLayer1);
        }
        if (this.googleLayer2) {
          this.map.remove(this.googleLayer2);
        }
        this.googleLayer1 = new AMap.TileLayer({
          zIndex: 10,
          getTileUrl: function(x, y, z) {
            return (
              "http://www.redovation.com/map/googlemaps/satellite/" +
              z +
              "/" +
              x +
              "/" +
              y +
              ".jpg"
            );
          }
        });

        this.googleLayer1.setMap(this.map);

        //创建自定义切片图层，指定 getTileUrl 属性
        this.googleLayer2 = new AMap.TileLayer({
          zIndex: 12,
          getTileUrl: function(x, y, z) {
            return (
              "http://www.redovation.com/map/googlemaps/overlay/" +
              z +
              "/" +
              x +
              "/" +
              y +
              ".png"
            );
          }
        });
        this.googleLayer2.setMap(this.map);
      } else {
        if (this.googleLayer1) {
          this.map.remove(this.googleLayer1);
        }
        if (this.googleLayer2) {
          this.map.remove(this.googleLayer2);
        }
      }
      if (photo == 2) {
        if (this.overlayGroups) {
          this.map.remove(this.overlayGroups);
        }
        this.draw3dPhoto();
      } else {
        if (this.overlayGroups) {
          this.map.remove(this.overlayGroups);
        }
      }
      if (threeDe == 2) {
        if (this.overlayThreeGroups) {
          this.map.remove(this.overlayThreeGroups);
        }
        this.threeData();
      } else {
        if (this.overlayThreeGroups) {
          this.map.remove(this.overlayThreeGroups);
        }
      }
      if (task == 2) {
        if (this.overlayTaskGroups) {
          this.map.remove(this.overlayTaskGroups);
        }
        this.pmInMap();
      } else {
        if (this.overlayTaskGroups) {
          this.map.remove(this.overlayTaskGroups);
        }
      }
      if (zs == 2) {
        this.isZs = true;
        if (this.overlayZSGroups) {
          this.map.remove(this.overlayZSGroups);
        }
        this.imageLayerLists();
      } else {
        if (this.overlayZSGroups) {
          this.map.remove(this.overlayZSGroups);
        }
        this.isZs = false;
      }
      if (user == 2) {
        this.$emit("isOnline", 1);
      } else {
        this.$emit("isOnline", 2);
      }
      if (online == 2) {
        if (this.overlayOnlineGroups) {
          this.map.remove(this.overlayOnlineGroups);
        }
        this.userOnline();
      } else {
        if (this.overlayOnlineGroups) {
          this.map.remove(this.overlayOnlineGroups);
        }
      }
    },
    //正射图
    imageLayerLists() {
      let that = this;
      if (this.overlayZSGroups) {
        this.map.remove(this.overlayZSGroups);
      }

      let data = {};
      if (this.searchStatus == "region") {
        data = {
          region: this.region
        };
      } else if (this.searchStatus == "project") {
        data = {
          second_pm_id: this.second_pm_id
        };
      }

      that.$post("/admin/kml_data/kmlDataMapShow", data).then(res => {
        if (res.code == 1) {
          if (res.data.data_list && res.data.data_list.length > 0) {
            // console.log(res.data.data_list);
            if (res.data) {
              let photos = res.data.data_list;
              this.zsLayer = null;
              this.zsLayer = [];
              this.overlayZSGroups = null;
              photos.forEach((ele, index) => {
                if (ele.lon && ele.lat) {
                  let marker = new AMap.Marker({
                    icon: new AMap.Icon({
                      image: require("../../../static/linkFly/quanjing1.png"),
                      size: new AMap.Size(60, 60),
                      imageSize: new AMap.Size(50, 50)
                    }),
                    offset: new AMap.Pixel(-30, -60),
                    position: [ele.lon, ele.lat]
                  });

                  if (this.projectTitle) {
                    marker.setLabel({
                      offset: new AMap.Pixel(-44, -33),
                      content: `<div class="mark_label"><P>${ele.name}-正射图</P> </div>`
                    });
                  }
                  marker.content = `<div class="header" style="color:#999999">正射图详情</div><ul>
                          <li>名字:${ele.name}</li>
                          <li>经度:${ele.lat}</li>
                          <li>纬度:${ele.lon}</li>
                          <li style="color: red" id=zs${ele.id}>查看详情>></li>
                      </ul>
                        `;
                  marker.id = ele.id;
                  marker.lonn = ele.lon;
                  marker.name = ele.name;
                  marker.latt = ele.lat;
                  marker.is_attach_kml = ele.is_attach_kml;
                  this.zsLayer.push(marker);
                  marker.on("click", this.markerZs);
                }
              });
              this.overlayZSGroups = new AMap.OverlayGroup(this.zsLayer);
              this.map.add(this.overlayZSGroups);
              this.map.setFitView();
            }

            // res.data.forEach((ele, index) => {
            //   var imageLayer = new AMap.ImageLayer({
            //     url: ele.imagePath,
            //     bounds: new AMap.Bounds(
            //       [ele.west, ele.south],
            //       [ele.east, ele.north]
            //     ),
            //     zooms: that.map.getZoom(),
            //     map: that.map
            //   });
            //   that.zsLayer.push(imageLayer);
            // });
          }
          if (this.regionName) {
            var geocoder = new AMap.Geocoder({
              city: "" //城市设为北京，默认：“全国”
            });
            geocoder.getLocation(this.regionName, function(status, result) {
              if (status === "complete" && result.geocodes.length) {
                var lnglat = result.geocodes[0].location;
                that.map.setZoomAndCenter(12, lnglat);
              } else {
                console.log("根据地址查询位置失败");
              }
            });
          }
        } else {
          this.$Message.error(res.msg_customer);
        }
      });

      //   }
      // });
    },
    // 正射图
    markerZs(e) {
      var then = this;
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(-10, -60)
      });
      infoWindow.setContent(e.target.content);
      infoWindow.open(this.map, e.target.getPosition());
      setTimeout(function() {
        var a = document.getElementById(`zs${e.target.id}`);
        a.onclick = function() {
          then.zhengsheJson = {
            name: e.target.name,
            lat: e.target.latt,
            lon: e.target.lonn
          };
          then.lookZhengshe(e.target);
        };
      }, 200);
    },
    lookZhengshe(val) {
      this.dialogZhengshe = true;
      let map = new AMap.Map("zsContainer", {
        resizeEnable: true,
        zoom: 13, //地图显示的缩放级别
        center:
          val.lonn == "113.380016"
            ? [113.632767, 29.318245]
            : [val.lonn, val.latt]
      });
      this.mouseTool = new AMap.MouseTool(map);
      this.$zxh_fun.draw("距离测量", this.mouseTool);
      let that = this;
      AMapUI.loadUI(["control/BasicControl"], function(BasicControl) {
        //图层切换控件
        map.addControl(
          new BasicControl.LayerSwitcher({
            position: "rt"
          })
        );
      });
      // if (val.is_attach_kml == 1) {
      //   //监听鼠标滚轮事件mousewheel
      //   map.on("mousewheel", function() {
      //     if (map.getZoom() < 18) {
      //       that
      //         .$post("/admin/kml_data/kmlDataDetail", {
      //           kml_id: val.id,
      //           zoom: map.getZoom()
      //         })
      //         .then(res => {
      //           if (res.code == 1) {
      //             // console.log(res.data);
      //             if (res.data && res.data.length > 0) {
      //               res.data.forEach((ele, index) => {
      //                 var imageLayer = new AMap.ImageLayer({
      //                   url: ele.imagePath,
      //                   bounds: new AMap.Bounds(
      //                     [ele.west, ele.south],
      //                     [ele.east, ele.north]
      //                   ),
      //                   zooms: map.getZoom(),
      //                   map: map
      //                 });
      //               });
      //             }
      //           }
      //         });
      //     }
      //   });

      if (val.is_attach_kml == 1) {
        if (map.getZoom() < 18) {
          that
            .$post("/admin/kml_data/kmlDataDetail", {
              kml_id: val.id,
              zoom: 13
            })
            .then(res => {
              if (res.code == 1) {
                // console.log(res.data);
                if (res.data && res.data.length > 0) {
                  res.data.forEach((ele, index) => {
                    var imageLayer = new AMap.ImageLayer({
                      url: ele.imagePath,
                      bounds: new AMap.Bounds(
                        [ele.west, ele.south],
                        [ele.east, ele.north]
                      ),
                      zooms: 13,
                      map: map
                    });
                  });
                }
              }
            });
        }
        //监听鼠标滚轮事件mousewheel
        map.on("mousewheel", function() {
          if (map.getZoom() < 18) {
            that
              .$post("/admin/kml_data/kmlDataDetail", {
                kml_id: val.id,
                zoom: map.getZoom()
              })
              .then(res => {
                if (res.code == 1) {
                  // console.log(res.data);
                  if (res.data && res.data.length > 0) {
                    res.data.forEach((ele, index) => {
                      var imageLayer = new AMap.ImageLayer({
                        url: ele.imagePath,
                        bounds: new AMap.Bounds(
                          [ele.west, ele.south],
                          [ele.east, ele.north]
                        ),
                        zooms: map.getZoom(),
                        map: map
                      });
                    });
                  }
                }
              });
          }
        });
      } else {
        if (that.googleLayer) {
          map.remove(that.googleLayer);
        }
        that.googleLayer = new AMap.TileLayer({
          zIndex: 12,
          getTileUrl: function(x, y, z) {
            return (
              "http://www.linkeda.net:10001/file/kml_data/kml_id_" +
              val.id +
              "/" +
              z +
              "/" +
              x +
              "/" +
              y +
              ".png"
            );
          }
        });
        that.googleLayer.setMap(map);
      }
      map.setFitView();
    },
    // 三维
    threeData() {
      if (this.overlayThreeGroups) {
        this.map.remove(this.overlayThreeGroups);
      }

      let data = {};
      if (this.searchStatus == "region") {
        data = {
          region: this.region
        };
      } else if (this.searchStatus == "project") {
        data = {
          second_pm_id: this.second_pm_id
        };
      }
      this.$post("test/three_dimensional/listShowMap", data).then(res => {
        // console.log("三维数据",res);
        if (res.code == 1) {
          if (res.data.data_list) {
            let photos = res.data.data_list;
            this.threeLayer = null;
            this.threeLayer = [];
            this.overlayThreeGroups = null;
            photos.forEach((ele, index) => {
              let marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image: require("../../../static/linkFly/threePng.png"),
                  size: new AMap.Size(60, 60),
                  imageSize: new AMap.Size(50, 50)
                }),
                offset: new AMap.Pixel(-30, -60),
                position: [ele.lon, ele.lat]
              });

              if (this.projectTitle) {
                marker.setLabel({
                  offset: new AMap.Pixel(-44, -33),
                  content: `<div class="mark_label"><P>${ele.name}-${ele.add_name}</br>三维</P> </div>`
                });
              }
              marker.content = `<div class="header" style="color:#999999">三维详情</div><ul>
                            <li>名字:${ele.name}</li>
                            <li>经度:${ele.lat}</li>
                            <li>纬度:${ele.lon}</li>
                            <li>创建时间:${ele.data_create_time}</li>
                            <li style="color: red" id=&${ele.id}>查看详情>></li>
                        </ul>
                          `;
              marker.path = ele.path;
              marker.id = ele.id;
              marker.name = ele.name;
              this.threeLayer.push(marker);
              marker.on("click", this.markerThree);
            });
            this.overlayThreeGroups = new AMap.OverlayGroup(this.threeLayer);
            this.map.add(this.overlayThreeGroups);
            this.map.setFitView();
          }
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    markerThree(e) {
      var then = this;
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(-10, -60)
      });
      infoWindow.setContent(e.target.content);
      infoWindow.open(this.map, e.target.getPosition());
      setTimeout(function() {
        var a = document.getElementById(`&${e.target.id}`);
        a.onclick = function() {
          window.open(e.target.path + "&name=" + e.target.name, "_blank");
          // http://134.175.32.185:10001/cesiumDemo.html?src=http://134.175.32.185:10001/static1/json_7/Production_1.json
          // window.open(e.target.path, "_blank");
        };
      }, 200);
    }
  },
  mounted() {
    let _this = this;
    // 初始化地图
    //this.getregionArr(); // 获取区域信息
    this.Init_map();
    this.pmInMap();
    this.draw3dPhoto();
    this.threeData();
    setTimeout(() => {
      _this.satellite = new AMap.TileLayer.Satellite({
        map: _this.map
      });
      this.addtest();
    }, 80);
    this.imageLayerLists();
    // 区域查询
    this.$_bus.$off("pmRegion");
    this.$_bus.$on("pmRegion", val => {
      this.region = val.length > 0 ? val[val.length - 1].value : "";
      var city = val.length > 0 ? val[val.length - 1].label : null;
      this.searchStatus = "region";
      var geocoder = new AMap.Geocoder();

      this.pmInMap();
      this.draw3dPhoto();
      this.threeData();
      this.imageLayerLists();
      console.log("city_____", city);
      if (city !== null) {
        console.log("进入跳转");
        // 跳到查询地点
        geocoder.getLocation(city, function(status, result) {
          if (status === "complete" && result.geocodes.length) {
            var lnglat = result.geocodes[0].location;
            console.log(lnglat);
            _this.map.setCenter([lnglat.lng, lnglat.lat]); //设置地图中心点
          } else {
            _this.$Message.error("根据地址查询位置失败");
          }
        });
      }
    });

    // 工程查询
    this.$_bus.$off("pmProject");
    this.$_bus.$on("pmProject", Project_2_id => {
      this.searchStatus = "project";
      this.second_pm_id = Project_2_id;
      this.map.clearMap();
      this.pmInMap();
      this.draw3dPhoto();
      this.threeData();
      this.imageLayerLists();
    });
    this.userOnline();
    if (sessionStorage.getItem("isOnline") == 2) {
      this.choose2.forEach((ele, index) => {
        if (ele == "显示右侧栏") {
          this.choose2.splice(index, 1);
        }
      });
    }
  },
  watch: {
    userData: {
      handler(newval, oldval) {
        this.choose2.forEach(ele => {
          if (ele == "人员在线") {
            this.userOnline();
          }
        });
      },
      immediate: true,
      deep: true
    },

    choose2(val) {
      // 有没有勾选"项目名称"
      this.projectTitle = val.includes("项目名称");
      this.addtest();
      // 有没有勾选"默认标注"
      if (val.includes("默认标注")) {
        var features = ["bg", "road", "building", "point"];
        this.map.setFeatures(features);
      } else {
        var features = ["bg", "road", "building"];
        this.map.setFeatures(features);
      }

      if (val.includes("三维图层")) {
        if (this.XLH) {
          this.map.remove(this.XLH);
        }
        this.addtest();
      } else {
        if (this.XLH) {
          this.map.remove(this.XLH);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.warpper_content_map {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 20px;
}
.allSerch {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 999;
}

.allSerch .ivu-input,
.allSerch .ivu-btn {
  background: #fff;
  color: #000;
  border: none;
}

.allSerch .ivu-cascader-arrow,
.allSerch .ivu-cascader-label {
  color: #000;
}

.right_wapper {
  flex: 0.22;
  color: white;
  background: rgba(255, 255, 255, 1);
  box-shadow: -1px 0px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 30px 0px 30px 30px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.layers {
  position: absolute;
  z-index: 888;
  vertical-align: middle;
  top: 10px;
  right: 10px;
  & > .img {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 34px;
    height: 34px;
    line-height: 34px;
    font-size: 22px;
    text-align: center;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    background: #fff;
    border-radius: 6px;
    img {
      width: 20px;
      height: 20px;
      margin-top: 6px;
    }
  }
  & > .choose {
    position: absolute;
    top: 45px;
    right: 10px;
    width: 100px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    background: #fff;
    border-radius: 6px;
    padding: 4px;
    margin-left: 8px;
  }
}
</style>
