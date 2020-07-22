<template>
  <div>
    <Table
      style="margin: 5px"
      :loading="loading"
      :columns="columns"
      :data="tabData"
      max-height="540"
      size="small"
    ></Table>
    <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    <!--弹框-->
    <Modal v-model="whole" title="全局 " width="60%" class="chj_engineer_whole" class-name="zhangshi">
      <p slot="header">
        <span>全局</span>
        <span class="chj_engineer_whole_contrast" @click="splitScreen()">
          <img src="/static/img/split_screen.png" />
        </span>
        <span>
          <span v-if="longitude[cur_data.index_y]">航点:{{longitude[cur_data.index_y].order+1}}</span>-
          <span
            v-if="longitude[cur_data.index_y]"
          >当前页:{{cur_data.index_x+1}}/{{longitude[cur_data.index_y].images.length}}</span>
        </span>
      </p>
      <div
        class="chj_engineer_whole_content"
        v-bind:class="{ img_split_height: split.content_img_show }"
      >
        <div
          class="chj_engineer_whole_content_img"
          v-bind:class="{ img_split_screen: split.content_img_show}"
        >
          <div class="chj_engineer_loader" v-show="img_loader">
            <Spin size="large" fix></Spin>
          </div>
          <i
            v-if="longitude[cur_data.index_y]"
            v-show="!this.img_loader"
            class="chj_engineer_whole_time"
          >时间:{{img.img_time}} ；高度:{{longitude[cur_data.index_y].altitude}}米</i>
          <img
            draggable="false"
            v-if="longitude[cur_data.index_y]"
            :src="img.img_src"
            @load="imageLoaded"
            @mousewheel="img_magnify"
            v-show="!this.img_loader "
            id="img"
          />
          <span class="iconfont icon-07jiantouxiangzuofill" style="left: 0;" @click="cur_img(1)"></span>
          <span class="iconfont icon-07jiantouxiangyoufill" style="right: 0;" @click="cur_img(4)"></span>
          <span
            class="iconfont icon-xiangshangyuanjiantou"
            style="left: 50%;top: 0"
            @click="cur_img(3)"
          ></span>
          <span
            class="iconfont icon-xiangxiayuanjiantou"
            style="left: 50%;top:90%"
            @click="cur_img(2)"
          ></span>
        </div>
        <div class="img_split_interval" v-show="split.content_img_show"></div>
        <!--右侧地图-->
        <div
          class="chj_engineer_whole_content_img"
          v-show="split.content_img_show "
          v-bind:class="{ img_split_screen:  split.content_img_show }"
        >
          <div class="chj_engineer_loader" v-show="img_loader_assistant">
            <Spin size="large" fix></Spin>
          </div>
          <i
            v-if="longitude[cur_data.index_y]"
            v-show="!img_loader_assistant"
            class="chj_engineer_whole_time"
          >时间:{{img.img_time_contrast}}</i>
          <img
            v-if="longitude[cur_data.index_y]"
            draggable="false"
            ref="play"
            @mousewheel="img_magnify"
            :src="img.img_src_contrast"
            @load="imageLoaded_assistant"
            v-show="!img_loader_assistant"
          />
          <span
            class="iconfont icon-xiangshangyuanjiantou"
            style="left: 50%;top: 0"
            @click="cur_img_assistant(3)"
          ></span>
          <span
            class="iconfont icon-xiangxiayuanjiantou"
            style="left: 50%;top:90%"
            @click="cur_img_assistant(2)"
          ></span>
        </div>
        <div class="content_map" v-show="!split.content_img_show">
          <div id="contain" class="mymap" style="height: 100%"></div>
        </div>
      </div>
      <div slot="footer" style="text-align: left">
        <Button @click="download_master" v-show="button_show">原图</Button>
      </div>
    </Modal>
    <Modal v-model="waypoint" title="航点" width="600px" class="waypoint">
      <div id="con" class="chj_engineer_waypoint_content"></div>
      <div slot="footer" style="text-align: left"></div>
    </Modal>
    <Modal v-model="look_ph" title="视图查看" width="600" class="addless">
      <div class="looK_ph_content">
        <h3 style="margin-left: 20px">图片:</h3>
        <ul>
          <div v-for="(item,index) in ph_img" :key="index+'info'">
            <li>
              <img v-if="item" :src="item" @click="click_ph(index)" />
            </li>
          </div>
        </ul>
        <h3 style="margin-left: 20px">视频:</h3>
        <ul>
          <div v-for="(item,index) in item_ph.video" :key="index+'info1'">
            <li>
              <video controls="controls">
                <source :src="item.path" type="video/mp4" />
              </video>
            </li>
          </div>
        </ul>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="photo" title="图片" width="600" class="addless">
      <carousels v-if="photo" @refreshList="cancel" :ph="ph_data"></carousels>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="delMadal" title="数据删除" @on-ok="ok_delect()" width="360">
      <div class="remove_text">
        <i class="icon iconfont icon-gantanhao"></i>
        <div class="remove_delete">数据将彻底删除,确定将选定的数据删除吗？</div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      total: 0,
      page: 1,
      loading: false,
      tabData: [],
      columns: [
        {
          title: "航线名",
          align: "center",
          key: "filetitle"
        },
        {
          title: "创建者",
          align: "center",
          key: "name"
        },
        {
          title: "创建时间",
          align: "center",
          key: "data_update_time"
        },
        {
          title: "航点数目",
          align: "center",
          key: "waypoint_number"
        },
        {
          title: "视图",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Icon",
                {
                  props: {
                    type: "md-qr-scanner"
                  },
                  style: {
                    fontSize: "20px",
                    color: "red"
                  },
                  on: {
                    click: () => {
                      this.whole_show(params.row, 1);
                    }
                  }
                },
                ""
              )
            ]);
          }
        },
        {
          title: "查看航点",
          key: "data_update_time",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  props: {
                    type: "md-qr-scanner"
                  },
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.whole_show(params.row, 2);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "id",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "img",
              {
                attrs: {
                  src: "../../../static/publicimg/delete.png",
                  title: "删除"
                },
                style: {
                  width: "0.19rem",
                  height: "0.2rem"
                },
                on: {
                  click: () => {
                    this.delete(params.row);
                  }
                }
              },
              "删除"
            );
          }
        }
      ],
      delMadal: false,
      photo: false,
      look_ph: false,
      zoom: "",
      img_loader: false, //图片加载
      img: {
        img_show: 0, //图片显示
        img_src: null, //当前显示的理解
        img_src_contrast: null, //对比图路径
        img_number: 0, //图片值
        img_time: "", //图片时间
        img_time_contrast: "" //图片
      },
      split: {
        content_img_show: false
      },
      item_ph: "", //图片和视频详情
      button_show: true, //显示原图按钮,
      img_loader_assistant: false, //图片加载对比
      whole: false, //全局
      map: null,
      marker: null,
      waypoint: false, //航点查看
      longitude: [], //航点数据
      cur_data: {
        index_x: 0, //切换时间坐标
        index_y: 0, //切换航点坐标
        vice_index_x: 0, //副坐标
        img: null //当前显示的img
      },
      ph_img: [],
      ph_data: [] //传给轮播组件的数据
    };
  },
  components: {
    Carousels: resolve => {
      require(["./Carousel.vue"], resolve);
    }
  },
  computed: {
    ...mapState(["threeData"])
  },
  mounted() {
    this.initList();
  },
  methods: {
    //初始化列表
    initList() {
      this.loading = true;
      this.$post("/admin/air_route/airRouteList", {
        pm_id: this.threeData.pm_id,
        page: this.page
      }).then(response => {
        if (response.code == 1) {
          this.tabData = response.data.data;
          this.total = response.data.total;
        } else {
          // this.$Message.error(response.msg_customer);
        }
        this.loading = false;
      });
    },
    changePage(val) {
      this.page = val;
      this.initList();
    },
    //显示整条航点信息视图展示
    whole_show: function(item, index) {
      this.zoom = 1;
      this.img_loader = true;
      this.img.img_show = 0;
      if (index == 1) {
        this.whole = true;
        var then = this;
        setTimeout(() => {
          then.map = new AMap.Map("contain", {
            resizeEnable: true,
            keyboardEnable: false,
            zoom: 16 //地图显示的缩放级别
          });
        }, 0);
        this.detail(item, 1);
      } else if (index == 2) {
        this.waypoint = true;
        this.map = new AMap.Map("con", {
          resizeEnable: true,
          keyboardEnable: false,
          zoom: 100 //地图显示的缩放级别
        });
        this.detail(item, 2);
      }
    },
    //查看航点
    detail: function(item, index) {
      let then = this;
      then.longitude = [];
      this.$post("/admin/air_route/airRouteDetail", {
        air_route_id: item.id
      }).then(res => {
        if (res.code == 1) {
          then.longitude = res.data.data;
          then.map.setZoomAndCenter(14, [
            then.longitude[0].coordinate_longitude,
            then.longitude[0].coordinate_latitude
          ]);
          try {
            then.img.img_time = then.longitude[then.cur_data.index_y].images[
              then.cur_data.index_x
            ].substring(
              then.longitude[then.cur_data.index_y].images[
                then.cur_data.index_x
              ].length - 24,
              then.longitude[then.cur_data.index_y].images[
                then.cur_data.index_x
              ].length - 5
            );
            then.img.img_time_contrast = then.longitude[
              then.cur_data.index_y
            ].images[then.img.img_number].substring(
              then.longitude[then.cur_data.index_y].images[then.img.img_number]
                .length - 24,
              then.longitude[then.cur_data.index_y].images[then.img.img_number]
                .length - 5
            );
          } catch (e) {
            then.$Notice.error({ title: "没有图片" });
            then.longitude = [];
          }
          then.img.img_src = then.longitude[0].images[0].replace(
            /org/,
            "thumb_org"
          );
          if (index == 1) {
            then.load_map();
          } else if (index == 2) {
            then.Painting_waypoint();
          }
        }
      });
    },
    //加载地图设置marker
    load_map: function() {
      this.cur_data.index_x = 0;
      this.cur_data.index_y = 0;
      this.marker = new AMap.Marker({
        icon: new AMap.Icon({
          image: "/static/img/ph_wrj.png",
          size: new AMap.Size(220, 220)
        }),
        position: [
          Number(this.longitude[0].lng),
          Number(this.longitude[0].lat)
        ],
        offset: new AMap.Pixel(-100, -180)
      });
      this.marker.setTitle("设置位置");
      this.marker.setMap(this.map);
    },
    //航点
    Painting_waypoint() {
      var then = this;
      var polygonArr = new Array(); //多边形覆盖物节点坐标数组
      AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
        for (let i = 0; i < then.longitude.length; i++) {
          var a, direction, text, locations;
          AMap.convertFrom(
            [
              Number(then.longitude[i].coordinate_longitude),
              Number(then.longitude[i].coordinate_latitude)
            ],
            "gps",
            function(status, result) {
              locations = result.locations;
              //方向
              direction = new AMap.Marker({
                icon: new AMap.Icon({
                  image: "/static/img/fanweijjiao.png",
                  size: new AMap.Size(220, 220),
                  imageSize: new AMap.Size(40, 40) // 根据所设置的大小拉伸或压缩图片
                }),
                offset: new AMap.Pixel(-20, -10),
                position: [Number(locations[0].lng), Number(locations[0].lat)]
              });
              polygonArr.push([
                Number(locations[0].lng),
                Number(locations[0].lat)
              ]);
              direction.setAngle(Number(then.longitude[i].heading));

              direction.setMap(then.map);
              //文本标记
              text = new AMap.Text({
                text: then.longitude[i].altitude,
                textAlign: "center", // 'left' 'right', 'center',
                verticalAlign: "middle", //middle 、bottom
                draggable: true,
                cursor: "pointer",
                angle: 10,
                style: {
                  "background-color": "yellow",
                  border: "solid 1px #0088ff"
                },
                position: [Number(locations[0].lng), Number(locations[0].lat)],
                offset: new AMap.Pixel(-5, -55)
              });
              text.setMap(then.map);

              a = new SimpleMarker({
                //普通文本
                iconLabel: `${then.longitude[i].order}`,
                containerClassNames: i,
                iconStyle: "green",
                position: [Number(locations[0].lng), Number(locations[0].lat)]
              });
              a.setMap(then.map);
              (function(i) {
                AMap.event.addListener(direction, "click", function() {
                  then.look_ph = true;
                  then.ph_img = then.longitude[i].images;
                });
              })(i);
            }
          );
        }
        setTimeout(() => {
          var polyline = new AMap.Polyline({
            path: polygonArr, //设置线覆盖物路径
            strokeColor: "#3366FF", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 2, //线宽
            strokeStyle: "dashed", //线样式
            strokeDasharray: [10, 5] //补充线样式
          });
          polyline.setMap(then.map);
          then.map.setFitView();
        }, 1000);
      });
    },
    //下载高清
    download_master: function() {
      this.button_show = false;
      this.img_loader = true;
      this.img.img_src = this.img.img_src.replace(/thumb_org/, "org");
    },
    //图片加载完成
    imageLoaded_assistant: function() {
      var then = this;
      setTimeout(function() {
        then.img_loader_assistant = false;
      }, 500);
    },
    imageLoaded: function() {
      //图片加载完成
      var then = this;
      setTimeout(function() {
        then.img_loader = false;
      }, 500);
    },
    img_magnify: function(e) {
      if (e.wheelDelta) {
        //IE/Opera/Chrome
        if (e.wheelDelta > 0) {
          this.zoom += 0.1;
        } else {
          if (this.zoom > 1) {
            this.zoom -= 0.1;
          }
        }
      } else if (e.detail) {
        //Firefox
        if (e.detail > 0) {
          this.zoom += 0.1;
        } else {
          if (this.zoom > 1) {
            this.zoom -= 0.1;
          }
        }
      }
      e.target.style.transform = `scale(${this.zoom})`;
    }, //放大
    //分屏
    splitScreen: function() {
      this.button_show = false;
      this.split.content_img_show = !this.split.content_img_show;
      var a = document
        .getElementsByClassName("zhangshi")[0]
        .getElementsByClassName("ivu-modal")[0];
      if (this.split.content_img_show) {
        a.style.width = "80%";
      } else {
        a.style.width = "60%";
      }
      this.img.img_src_contrast = this.longitude[
        this.cur_data.index_y
      ].images[0].replace(/org/, "thumb_org");
    },
    click_ph: function(index) {
      this.photo = true;
      this.ph_data = [].concat(this.ph_img);
      var str = this.ph_data.splice(index, 1);
      this.ph_data.unshift(str[0]);
    },
    //航点图片切换,
    cur_img: function(index) {
      //切换图片//1左 2下 3上 4右
      document.getElementById("img").style.cssText = "left:0;top:0";
      this.button_show = true;
      var number = this.longitude[this.cur_data.index_y].images.length;
      if (index == 1) {
        //左
        if (this.cur_data.index_y > 0) {
          this.img_loader_assistant = true;
          this.img_loader = true;
          this.cur_data.index_y--;
          this.marker.setPosition([
            Number(this.longitude[this.cur_data.index_y].lng),
            Number(this.longitude[this.cur_data.index_y].lat)
          ]);

          this.marker.setAngle(
            Number(this.longitude[this.cur_data.index_y].heading)
          );
        }
      } else if (index == 2) {
        //下
        if (number - 1 > this.cur_data.index_x) {
          this.img_loader = true;
          this.cur_data.index_x++;
        }
      } else if (index == 3) {
        //上
        if (this.cur_data.index_x > 0) {
          this.img_loader = true;
          this.cur_data.index_x--;
        }
      } else if (index == 4) {
        //右
        this.cur_data.index_x = 0;
        if (this.cur_data.index_y < this.longitude.length - 1) {
          this.img_loader_assistant = true;
          this.img_loader = true;
          this.cur_data.index_y++;
          this.marker.setPosition([
            Number(this.longitude[this.cur_data.index_y].lng),
            Number(this.longitude[this.cur_data.index_y].lat)
          ]);
          this.marker.setAngle(
            Number(this.longitude[this.cur_data.index_y].heading)
          );
        }
      }
      this.img.img_src = this.longitude[this.cur_data.index_y].images[
        this.cur_data.index_x
      ].replace(/org/, "thumb_org");
      this.img.img_src_contrast = this.longitude[this.cur_data.index_y].images[
        this.img.img_number
      ].replace(/org/, "thumb_org");
      try {
        this.img.img_time = this.longitude[this.cur_data.index_y].images[
          this.cur_data.index_x
        ].substring(
          this.longitude[this.cur_data.index_y].images[this.cur_data.index_x]
            .length - 24,
          this.longitude[this.cur_data.index_y].images[this.cur_data.index_x]
            .length - 5
        );
        this.img.img_time_contrast = this.longitude[
          this.cur_data.index_y
        ].images[this.img.img_number].substring(
          this.longitude[this.cur_data.index_y].images[this.img.img_number]
            .length - 24,
          this.longitude[this.cur_data.index_y].images[this.img.img_number]
            .length - 5
        );
      } catch (e) {
        alert("没有图片");
      }
    },
    //对比切换
    cur_img_assistant: function(index) {
      var number = this.longitude[this.cur_data.index_y].images.length;
      if (index == 2) {
        //下
        if (number - 1 > this.img.img_number) {
          this.img_loader_assistant = true;
          this.img.img_number++;
        }
      } else if (index == 3) {
        //上
        if (this.img.img_number > 0) {
          this.img_loader_assistant = true;
          this.img.img_number--;
        }
      }
      this.img.img_src_contrast = this.longitude[this.cur_data.index_y].images[
        this.img.img_number
      ].replace(/org/, "thumb_org");
      this.img.img_time_contrast = this.longitude[this.cur_data.index_y].images[
        this.img.img_number
      ].substring(
        this.longitude[this.cur_data.index_y].images[this.img.img_number]
          .length - 24,
        this.longitude[this.cur_data.index_y].images[this.img.img_number]
          .length - 5
      );
    },
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/air_route/airRouteDel", {
            air_route_id: row.id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.initList();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    ok_delect: function() {
      var then = this;
      this.$post("/uav/data/AirRouteDelete", {
        id: then.index_uid
      }).then(response => {
        then.$Notice.success({ title: response.var });
        then.get_init();
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../font/iconfont.css";
.table {
  clear: both;
  border: 1px solid #e9eaec;
  border-bottom: 0;
  box-sizing: border-box;
  /*display: none;*/
}

table {
  width: 100%;
  cursor: pointer;
  border: 1px solid #e9eaec;
}
.table_name {
  color: #23a5f6;
}
thead th {
  height: 40px;
  background: #eaf0f5;
  color: #666;
  font-size: 14px;
}
/*th,td{*/
/*border-bottom: 1px solid #dfdfdf;*/
/*}*/
tbody > tr {
  text-align: center;
  height: 40px;
  color: #999;
  font-size: 14px;
  transition: background-color 0.2s ease-in-out;
}
tbody > tr > td {
  border-bottom: 1px solid #e9eaec;
  height: 48px;
}
tbody > tr:hover {
  background-color: #eaf6fe;
}
.foot {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  text-align: center;
}
.foot > ul {
  text-align: center;
  list-style-type: none;
  margin: auto;
  display: block;
}
.foot > ul > li {
  display: inline-block;
  width: 30px;
  border: 1px solid #dfdfdf;
  margin-right: 15px;
  text-align: center;
}
.foot > ul > li.trun {
  width: 62px;
  margin-right: 45px;
  margin-left: 30px;
}

.foot > ul > li > a.click_list {
  background: #1e5389;
  color: #fff;
}
.foot > ul > li > a {
  display: inline-block;
  color: #333;
  width: 100%;
  text-decoration: none;
}
.foot > ul > li.trun > a {
  color: #999;
}
/*全局样式查询*/
.chj_engineer_whole_content {
  width: 100%;
  height: 500px !important;
}
.chj_engineer_whole_content > div {
  display: inline-block;
}
.chj_engineer_whole_content div.chj_engineer_whole_content_img {
  float: left;
  position: relative;
  width: 70%;
  box-sizing: content-box;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.chj_engineer_whole_content > div.content_map {
  width: 30%;
  vertical-align: top;
  height: 100%;
  margin: 0;
}
.chj_engineer_whole_content_img > img {
  position: absolute;
  width: 100%;
  height: 100%;
}
.chj_engineer_whole_content_img > span {
  cursor: pointer;
  font-size: 28px;
  position: absolute;
  top: 50%;
  z-index: 1000;
}
.chj_engineer_whole_contrast {
  position: absolute;
  right: 20px;
  float: right;
  margin-right: 20px;
  vertical-align: baseline;
}
.chj_engineer_whole_contrast > img {
  height: 20px;
  cursor: pointer;
}
.chj_engineer_whole .chj_engineer_whole_content .img_split_screen {
  width: 50%;
}
.chj_engineer_whole .img_split_height {
  height: 100%;
}

.chj_engineer_whole .chj_engineer_whole_time {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  z-index: 1000;
}
.chj_engineer_waypoint_content {
  height: 400px;
}
.looK_ph_content {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.looK_ph_content div {
  display: inline-block;
  width: 150px;
  height: 150px;
  margin-left: 10px;
}
.looK_ph_content div li {
  width: 100%;
  height: 100%;
}
.looK_ph_content div img {
  width: 100%;
  height: 100%;
}
.looK_ph_content div li > video {
  width: 100%;
  height: 100%;
}
.remove_text {
  background: #fff;
}
.remove_delete {
  letter-spacing: 2px;
  margin-left: 60px;
  font-size: 16px;
  padding-right: 5px;
}
.remove_text > i {
  float: left;
  margin-left: 20px;
  font-size: 30px;
  color: #af1c09;
}
.chj_engineer_loader {
  display: inline-block;
  width: 100%;
  height: 100%;
  border: 1px solid #eee;
  position: absolute;
}
</style>