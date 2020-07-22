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
    <Modal v-model="dialogShowMap" title="查看位置" width="600">
      <LookMap v-if="dialogShowMap" :map_point="map_point" :map_type="map_type"></LookMap>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="modal" title="数据上报" width="600" class="addless">
      <div>
        <div id="chj_looKdata" style="height: 200px"></div>
      </div>
      <Button style="margin: 5px" @click="detailModal=true">详情</Button>
      <!-- <img
        v-if="modal"
        draggable="false"
        style="width: 100%;height: 300px"
        :src="detailLists.image_path"
        @mousewheel="img_magnify"
      />-->
      <viewer style="width:100%;">
        <img :src="detailLists.image_path" style="width: 100%;height: 300px"/>
      </viewer>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="detailModal" title="详情" class="addless">
      <div v-if="detailModal" class="look_outs">
        <div>用户名:{{detailLists.name}}</div>
        <div>手机号:{{detailLists.account}}</div>
        <div>时间:{{detailLists.data_update_time}}</div>
        <div>天气情况:{{detailLists.weather}}</div>
        <div>
          类型:
          <span v-if="detailLists.type==1">点</span>
          <span v-else-if="detailLists.type==2">线</span>
          <span v-else-if="detailLists.type==3">面</span>
        </div>
        <div>周长:{{detailLists.perimeter}}(千米)</div>
        <div>边长:{{detailLists.side_long}}(千米)</div>
        <div>面积:{{detailLists.area}}(平方千米)</div>
        <div>甲醛:{{detailLists.methanal}}</div>
        <div>温度:{{detailLists.temperature}}</div>
        <div>其他说明:{{detailLists.comment}}</div>
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
      modal: false,
      detailModal: false,
      detailLists: {},
      dialogShowMap: false,
      map_type: "",
      map_point: "",
      total: 0,
      page: 1,
      loading: false,
      tabData: [],
      columns: [
        {
          title: "用户",
          key: "name",
          align: "center"
        },
        {
          title: "手机号",
          key: "account",
          align: "center"
        },
        {
          title: "飞机序列号",
          key: "uav_series_number",
          align: "center"
        },
        {
          title: "目标位置",
          key: "data_update_time",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Icon",
                {
                  props: {
                    type: "md-pin"
                  },
                  style: {
                    fontSize: "20px",
                    color: "red"
                  },
                  on: {
                    click: () => {
                      this.dialogShowMap = true;
                      this.map_point = params.row.goal_location;
                      this.map_type = params.row.type;
                    }
                  }
                },
                ""
              )
            ]);
          }
        },
        {
          title: "标注时间",
          key: "label_time",
          align: "center"
        },
        {
          title: "操作",
          key: "id",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "img",
                {
                  attrs: {
                    src: "../../../static/publicimg/chakan.png",
                    title: "查看详情"
                  },
                  style: {
                    marginRight: "8px",
                    width: "0.19rem",
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.details(params.row);
                    }
                  }
                },
                "查看详情"
              ),
              h(
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
              )
            ]);
          }
        }
      ],
      map: null,
      zoom: 1
    };
  },
  computed: {
    ...mapState(["threeData"])
  },
  mounted() {
    this.initList();
  },
  components: {
    LookMap: resolve => {
      require(["../../Map/lookMap.vue"], resolve);
    }
  },
  methods: {
    //初始化列表
    initList() {
      this.loading = true;
      this.$post("/admin/air_mark/airMarkList", {
        pm_id: this.threeData.pm_id,
        page: this.page,
        limit: 10
      }).then(response => {
        if (response.code == 1) {
          this.tabData = response.data.data;
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
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/air_mark/airMarkDel", {
            mark_id: row.id
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
    details(item) {
      this.modal = true;
      this.detailLists = item;
      setTimeout(() => {
        this.map = new AMap.Map("chj_looKdata", {
          resizeEnable: true,
          zoom: 13 //地图显示的缩放级别
        });
        var UVA_show = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/static/img/wurenji.png",
            size: new AMap.Size(60, 70),
            imageSize: new AMap.Size(50, 50) // 根据所设置的大小拉伸或压缩图片
          }),
          offset: new AMap.Pixel(-30, -25),
          position: JSON.parse(item.uav_location)[0],
          map: this.map
        });
        var marker_goal = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/static/img/goal.png",
            size: new AMap.Size(60, 70)
          }),
          offset: new AMap.Pixel(-30, -25),
          position: JSON.parse(item.goal_location)[0],
          map: this.map
        });
        this.map.setFitView();
      }, 0);
    },
    // 图片放大
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
    }
  }
};
</script>
<style lang="less" scoped>
.look_outs {
  margin: 10px;
}
.look_outs > div {
  margin-bottom: 10px;
}
</style>