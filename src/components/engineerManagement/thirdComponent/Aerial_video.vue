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
    <Modal v-model="modal" title="空中视频" width="600" class="addless">
      <div v-if="modal">
        <video id="audio" controls autoplay name="media " width="600">
          <source :src="details.video_path" type="video/mp4" />对不起；您的浏览器不支持HTML5视频在WebM和VP8 / VP9或MP4
        </video>
        <div id="chj_enginner_map"></div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      details: {},
      modal: false,
      total: 0,
      page: 1,
      loading: false,
      tabData: [],
      columns: [
        {
          title: "上传者",
          key: "name",
          align: "center"
        },
        {
          title: "拍摄时间",
          key: "shoot_time",
          align: "center"
        },
        {
          title: "查看",
          key: "id",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: "/static/publicimg/chakan.png"
              },
              style: {
                width: "0.19rem",
                height: "0.2rem"
              },
              on: {
                click: () => {
                  this.detail(params.row);
                }
              }
            });
          }
        },
        {
          title: "删除",
          key: "id",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: "/static/publicimg/delete.png"
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
            });
          }
        }
      ],
      map: null,
      dinshiTime: null
    };
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
      this.$post("/admin/aerial_video/aerialVideoList", {
        pm_id: this.threeData.pm_id,
        page: this.page,
        limit: 10
      }).then(response => {
        if (response.code == 1) {
          this.tabData = response.data.data;
          this.tabData = this.tabData.map(ele => {
            return {
              ...ele,
              shoot_time: this.formatDate(ele.shoot_time)
            };
          });
          this.total = response.data.total;
        } else {
          this.$Message.error(response.msg_customer);
        }
        this.loading = false;
      });
    },
    changePage(val) {
      this.page = val;
      this.initList();
    },
    detail(row) {
      this.details = row;
      this.modal = true;
      var audio, marker1, marker2;
      var data = row.accessory_path;
      setTimeout(() => {
        this.map = new AMap.Map("chj_enginner_map", {
          resizeEnable: true,
          zoom: 10 //地图显示的缩放级别
        });
        audio = document.getElementById("audio");
        //无人机
        marker1 = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/static/img/wurenji.png",
            size: new AMap.Size(60, 70),
            imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
          }),
          offset: new AMap.Pixel(-30, -25),
          position: [
            data.mTrailDataList[0].mLatLng.lng,
            data.mTrailDataList[0].mLatLng.lat
          ],
          map: this.map
        });
        marker2 = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/static/img/goal.png",
            size: new AMap.Size(60, 70)
          }),
          offset: new AMap.Pixel(-30, -25),
          position: [data.homeLng, data.homeLat],
          map: this.map
        });
      }, 0);
      this.dinshiTime = setInterval(function() {
        let duration = parseInt(audio.duration);
        var i = parseInt((audio.currentTime * 1000) / 200); //播放进度
        if (i < data.mTrailDataList.length) {
          marker1.setPosition([
            data.mTrailDataList[i].mLatLng.lng,
            data.mTrailDataList[i].mLatLng.lat
          ]);
          marker1.setAngle(Number(data.mTrailDataList[i].gimYaw));
          marker2.setPosition([
            data.mTrailDataList[i].mTargetLatLng.b,
            data.mTrailDataList[i].mTargetLatLng.a
          ]);
        } else {
          clearInterval(this.dinshiTime);
        }
      }, 200);
    },
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/aerial_video/aerialVideoDel", {
            video_id: row.id
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
    addZero(val) {
      return val >= 10 ? val : "0" + val;
    },
    //时间转换
    formatDate(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M = this.addZero(date.getMonth() + 1) + "-";
      var D = this.addZero(date.getDate()) + "  ";
      var h = this.addZero(date.getHours()) + ":";
      var m = this.addZero(date.getMinutes()) + ":";
      var s = this.addZero(date.getSeconds());
      return Y + M + D + h + m + s;
    }
  }
};
</script>
<style lang="less" scoped>
#chj_enginner_map {
  height: 200px;
}
</style>