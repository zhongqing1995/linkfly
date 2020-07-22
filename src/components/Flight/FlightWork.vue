<template>
  <div class="topDIV">
    <div class="name">
      <span>飞行作业</span>
    </div>
    <div class="ul_table">
      <ul>
        <li
          @click="ChangeTableData(index)"
          v-for="(item,index) in list "
          :key="index+'list1'"
          :class="[listIndex == index ?'active_li':'']"
        >{{item}}</li>
      </ul>
    </div>
    <div class="show_info">
      <div class="show_children" v-for="(item,index) in showContent" :key="index+'list2'">
        <div class="top">
          <row>
            <Col span="11" class="gary_font">{{item.adder_name}}</Col>
            <Col span="13" class="delet" v-if="listIndex!=1">
              <img
                src="../../../static/publicimg/flight_delete.png"
                alt
                @click.stop="delTask(item.id)"
              />
            </Col>
          </row>
        </div>
        <div class="content" @click="workDetail(item.id)" style="cursor:pointer;">
          <div>
            所属工程:
            <span class="gary_font">{{item.pm_second_name}}</span>
          </div>
          <div>
            作业类型:
            <span class="gary_font">{{item.flight_task_type}}</span>
          </div>
          <div>
            上报时间:
            <span class="gary_font">{{item.data_create_time}}</span>
          </div>
        </div>
        <i-button
          style="border-radius:8px;"
          class="btn"
          type="primary"
        >{{item.is_flight_control==1?'飞控':'地面'}}</i-button>
      </div>
    </div>
    <Page
      :total="total"
      :current="page"
      show-elevator
      :page-size="pageSize"
      class="split_page"
      @on-change="changePage"
    />
    <Modal class="video_Modal" v-model="viewModal" title="飞行作业查看" width="900px">
      <div style="width: 100%;height: 500px">
        <div id="map" style="width: 100%;height: 100%"></div>
        <div class="input_card">
          <Row v-if="taskDetails">
            <Col :span="24">相关人员：{{taskDetails.attendant}}</Col>
            <Col :span="24">所属工程：{{taskDetails.pm_second_name}}</Col>
            <Col :span="24">任务类型：{{taskDetails.flight_task_type}}</Col>
            <Col :span="24">上报时间：{{taskDetails.data_create_time}}</Col>
            <Col :span="24">上报人：{{taskDetails.adder_name}}</Col>
            <Col :span="24">备注：{{taskDetails.description}}</Col>
            <Col :span="8">
              <Button @click="photoclick(1)">图片({{taskDetails.images?taskDetails.images.length:0}})</Button>
            </Col>
            <Col :span="8">
              <Button @click="photoclick(2)">视频({{taskDetails.videos?taskDetails.videos.length:0}})</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="photoShow" title="详情" :mask-closable="false">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <!--图片-->
          <div
            v-show="index==1"
            class="swiper-slide"
            v-for="(item,key) in taskDetails.images"
            :key="key+'list3'"
          >
            <viewer style="width:100%;">
              <img :src="item.isShow?item.path:item.imgPath" style="width: 100%;" />
            </viewer>
            <Button v-if="item.is_doodling==1" @click="lookPic(key)">{{item.isShow?'查看涂鸦图片':'查看原图'}}</Button>
          </div>
          <!--视频-->
          <div
            v-show="index==2"
            class="swiper-slide"
            v-for="(item,key) in taskDetails.videos"
            :key="key+'list4'"
            style="height: 300px"
          >
            <video width="100%" height="100%" controls>
              <source :src="item.path" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="swiper-button-prev"></div>
        <!--左箭头。如果放置在swiper-container外面，需要自定义样式。-->
        <div class="swiper-button-next"></div>
        <!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
      </div>
    </Modal>
    <Modal
      class="video_Modal"
      v-model="project_img"
      title="图片查看"
      width="600px"
      :styles="{top: '10px'}"
    >
      <viewer style="width:100%;" v-if="project_img">
        <img
          style=" width: 100%;height: auto; max-width: 100%; max-height: 100%;"
          :src="item_img.path"
        />
      </viewer>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="project_video" title="视频查看" width="400px" class="video_Modal">
      <video
        autoplay="autoplay"
        style="width: 100%;height: 300px"
        v-if="project_video"
        :src="item_video.path"
        controls="controls"
      >您的浏览器不支持 video 标签。</video>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import Swiper from "swiper";
import { mapState } from "vuex";
export default {
  data() {
    return {
      spinShow: false,
      index: 1,
      photoShow: false,
      viewModal: false,
      project_img: false,
      project_video: false,
      taskDetails: {},
      formItem: {},
      loading: true,
      ruleValidate: {
        taskname: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        dates: [
          {
            required: true,
            message: "时间不能为空",
            trigger: "blur"
          }
        ]
      },
      total: 0, //总数
      pageSize: 12, //每页大小
      page: 1,
      listIndex: 0,
      list: ["已完成作业", "未完成作业"],
      showContent: [],
      map: null
    };
  },
  computed: {
    ...mapState(["rowData"])
  },
  created() {
    console.log(this.$root, "root");
  },
  mounted() {
    this.initLists();
  },
  methods: {
    //删除
    delTask(id) {
      this.$Modal.confirm({
        title: "删除作业",
        content: "您是否要删除本条作业数据",
        onOk: () => {
          this.delAsync(id);
        },
        onCancel: () => {}
      });
    },
    delAsync(id) {
      this.$post("/admin/flight_Task/flightTaskDel", {
        flight_task_id: id
      }).then(res => {
        if (res.code == 1) {
          this.initLists();
          this.$Message.success("删除成功!");
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //涂鸦转换
    lookPic(index) {
      this.taskDetails.images[index].isShow = !this.taskDetails.images[index]
        .isShow;
    },
    //查看图片/视频
    photoclick: function(index) {
      this.photoShow = true;
      this.index = index;
      setTimeout(() => {
        var swiper = new Swiper(".swiper-container", {
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          },
          onTouchEnd: function() {
            swiper.startAutoplay();
          }
        });
      }, 0);
    },
    //作业详情
    workDetail(id) {
      this.$post("/admin/flight_task/flightTaskDetail", {
        flight_task_id: id
      }).then(res => {
        if (res.code == 1) {
          this.viewModal = true;
          this.showMap(res.data);
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //作业详情地图
    showMap(item) {
      this.taskDetails = item;
      if (item.location.length > 0) {
        var a = JSON.parse(item.location);
        this.taskDetails.images = this.taskDetails.images.map(ele => {
          let index = ele.path.lastIndexOf(".");
          let beforeStr = ele.path.substring(0, index);
          let afterStr = ele.path.substring(index);
          let imgPath = beforeStr + "_doodling" + afterStr;
          return {
            ...ele,
            imgPath: imgPath,
            isShow: true
          };
        });
        var then = this;
        if (item.location.length > 0) {
          this.map = new AMap.Map("map", {
            resizeEnable: true,
            center: a[0],
            zoom: 100
          });
          var polyline = new AMap.Polyline({
            map: then.map,
            path: a,
            showDir: true,
            strokeColor: "#28F", //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6 //线宽
            // strokeStyle: "solid"  //线样式
          });
          this.map.setFitView();
          //起点
          new AMap.Marker({
            autoRotation: true,
            animation: "AMAP_ANIMATION_DROP",
            icon: new AMap.Icon({
              image: require("../../../static/zxhImg/origin.png"),
              size: new AMap.Size(40, 40),
              imageSize: new AMap.Size(40, 40)
            }),
            offset: new AMap.Pixel(-20, -40),
            position: a[0],
            map: then.map
          });
          //终点
          new AMap.Marker({
            autoRotation: true,
            animation: "AMAP_ANIMATION_DROP",
            icon: new AMap.Icon({
              image: require("../../../static/zxhImg/end.png"),
              size: new AMap.Size(40, 40),
              imageSize: new AMap.Size(40, 40)
            }),
            offset: new AMap.Pixel(-20, -40),
            position: a[a.length - 1],
            map: then.map
          });
        }
      } else {
        this.map.clearMap();
      }

      //绘制图标
      var arr = new Array();
      for (let i = 0; i < item.images.length; i++) {
        var marker = new AMap.Marker({
          autoRotation: true,
          animation: "AMAP_ANIMATION_DROP",
          icon: new AMap.Icon({
            image: require("../../../static/zxhImg/img_biaoqqian.png")
            // size : new AMap.Size(60,60)
          }),
          offset: new AMap.Pixel(-15, -35),
          position: eval(item.images[i].location),
          map: then.map
        });
        //

        marker.on("click", function(e) {
          then.project_img = true;
          then.item_img = item.images[i];
        });
      }
      //    video_biaoqina.png
      // //    绘制视频图标
      for (let i = 0; i < item.videos.length; i++) {
        var marker = new AMap.Marker({
          autoRotation: true,
          animation: "AMAP_ANIMATION_DROP",
          icon: new AMap.Icon({
            image: require("../../../static/zxhImg/video_biaoqina.png")
            // size : new AMap.Size(60,60)
          }),
          offset: new AMap.Pixel(-15, -35),
          position: eval(item.videos[i].location),
          map: then.map
        });
        marker.on("click", function(e) {
          then.project_video = true;
          then.item_video = item.videos[i];
        });
      }
    },
    //初始化列表
    initLists() {
      this.spinShow = true;
      this.$post("/admin/flight_task/flightTaskList", {
        page: this.page,
        limit: 12,
        state: this.listIndex == 1 ? 0 : 1,
        first_pm_id: this.rowData.pm_id
      }).then(res => {
        if (res.code == 1) {
          this.showContent = res.data.data;
          this.total = res.data.total;
        } else {
          this.$Message.error(res.msg_customer);
        }
        this.spinShow = false;
      });
    },
    //分页
    changePage(val) {
      this.page = val;
      this.initLists();
    },
    //tab栏切换
    ChangeTableData(index) {
      this.page = 1;
      this.listIndex = index;
      this.initLists();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./Flight.less");
</style>