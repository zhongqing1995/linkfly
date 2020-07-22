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
    <Modal v-model="modal" title="视图查看" width="600" class="addless">
      <div class="looK_ph_content">
        <h3>图片:</h3>
        <viewer :images="imgLists" style="width:100%;">
          <img :src="item.path" v-for="(item,index) in imgLists" :key="index+'info'" />
        </viewer>
        <h3>视频:</h3>
        <ul v-if="videoLists">
          <div v-for="(item,index) in videoLists" :key="index">
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
      dialogShowMap: false,
      modal: false,
      map_point: "",
      map_type: "",
      videoLists: [],
      imgLists: [],
      columns: [
        {
          title: "上报人",
          key: "name",
          align: "center"
        },
        {
          title: "时间",
          key: "data_create_time",
          align: "center"
        },
        {
          title: "区域",
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
                      this.map_point = params.row.location;
                      this.map_type = Number(params.row.location_type);
                    }
                  }
                },
                ""
              )
            ]);
          }
        },
        {
          title: "天气",
          key: "weather",
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
                      this.detail(params.row);
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
      ]
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
      require(["../../../components/Map/lookMap.vue"], resolve);
    }
  },
  methods: {
    //初始化列表
    initList() {
      this.loading = true;
      this.$post("/admin/uav_uav/groundDataList", {
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
    detail(row) {
      this.$post("/admin/uav_uav/groundDataDetail", {
        data_id: row.data_id
      }).then(response => {
        if (response.code == 1) {
          this.modal = true;
          this.imgLists = response.data.image;
          this.videoLists = response.data.video;
        } else {
          this.$Message.error(response.msg_customer);
        }
        this.loading = false;
      });
    },
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/uav_uav/groundDataDel", {
            data_id: row.data_id
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
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../font/iconfont.css";
.looK_ph_content {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.looK_ph_content div {
  display: inline-block;
  width: 120px;
  height: 120px;
  margin-left: 10px;
}
.looK_ph_content div li {
  width: 100%;
  height: 100%;
}
.looK_ph_content img {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  margin-right: 10px;
}
.looK_ph_content div li > video {
  width: 200px;
  height: 200px;
}
</style>