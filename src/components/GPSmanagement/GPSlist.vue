<template>
  <div id="GPS" class="topDIV" style="margin-top: 0">
    <div class="Top">
      <h1 class="name">GPS列表</h1>
      <div>
        <Button type="primary" @click="instantRouteShou=!instantRouteShou">查看实时GPS</Button>
        <Button v-if="userType==0?false:true" type="primary" @click="addGPSbox=!addGPSbox">添加GPS</Button>
      </div>
    </div>
    <!--列表区-->
    <div>
      <Table :loading="loading" :columns="columns" :data="listData" :height="428"></Table>
      <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    </div>
    <!--弹框区-->
    <!--添加GPS-->
    <Modal title="添加GPS" v-model="addGPSbox" width="500">
      <p slot="header" style="color:#409EFF;text-align:center">
        <span style="font-size: 16px">添加GPS</span>
      </p>
      <Form
        ref="addGPSform"
        :model="addGPSData"
        :rules="addGPSDataRule"
        label-position="top"
        style="margin: 0 50px"
      >
        <FormItem label="IMEI" prop="ime">
          <Input v-model="addGPSData.ime"></Input>
        </FormItem>
      </Form>
      <div style="text-align:center" slot="footer">
        <Button type="info" @click="addGPS_ok" style="width: 200px;letter-spacing:4px;">确认添加</Button>
      </div>
    </Modal>

    <!--历史轨迹查看-->
    <Modal title="历史轨迹" v-model="pastRoute" footer-hide width="1000">
      <p slot="header" style="color:#409EFF;text-align:center">
        <span style="font-size: 16px">历史轨迹</span>
      </p>
      <PastRoute :tcp_device_id="tcp_device_id"></PastRoute>
    </Modal>

    <!--实时轨迹查看-->
    <Modal title="实时轨迹" v-model="instantRouteShou" footer-hide width="1000">
      <p slot="header" style="color:#409EFF;text-align:center">
        <span style="font-size: 16px">实时轨迹</span>
      </p>
      <instantRoute :instantRouteShou="instantRouteShou"></instantRoute>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "GPSlist",
  components: {
    PastRoute: resolve => {
      require(["./pastRoute.vue"], resolve);
    },
    instantRoute: resolve => {
      require(["./instantRoute.vue"], resolve);
    }
  },
  data() {
    return {
      userType: "",
      userInfo: {},
      total: 0,
      page: 1,
      loading: false,
      columns: [
        {
          title: "IMEI编码",
          key: "ime"
        },
        {
          title: "最后连接IP",
          key: "IP"
        },
        {
          title: "当前电量",
          key: "electric_quantity"
        },
        {
          title: "信号强度",
          key: "signal_intensity"
        },
        {
          title: "是否在线",
          key: "is_online"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "img",
                {
                  attrs: {
                    src: "../../../static/publicimg/chakan.png",
                    title: "查看"
                  },
                  style: {
                    width: "0.19rem",
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.details(params.row);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      listData: [],
      secondData: {},
      timer: null,
      pastRoute: false,
      tcp_device_id: null,
      // 添加GPS
      addGPSbox: false,
      addGPSData: {
        ime: ""
      },
      addGPSDataRule: {
        ime: [{ required: true, message: "请填写IMEI" }]
      },
      instantRouteShou: false
    };
  },
  mounted() {
    this.userType = sessionStorage.getItem("userType");
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    this.secondData = JSON.parse(sessionStorage.getItem("secondData"));
    this.initLists();
    this.timer = setInterval(this.initLists(), 180000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    // 加载列表
    initLists() {
      this.loading = true;
      this.$post("/gps/tcp_device/tcpDeviceList", {
        first_pm_id:
          this.userType == 0 ? this.secondData.pm_id : this.userInfo.pm_id,
        limit: 10,
        page: this.page
      }).then(res => {
        this.loading = false;
        if (res.code == 1) {
          // console.log(res);
          this.listData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    // 分页
    changePage(val) {
      this.page = val;
      this.initLists();
    },
    // 查看历史轨迹
    details(val) {
      // console.log(val);
      this.tcp_device_id = val.id;
      this.pastRoute = true;
    },
    // 添加GPS设备
    addGPS_ok() {
      var _this = this;
      this.$refs["addGPSform"].validate(valid => {
        if (valid) {
          this.$post("/gps/tcp_device/tcpDeviceAdd", {
            first_pm_id:
              this.userType == 0 ? this.secondData.pm_id : this.userInfo.pm_id,
            ime: _this.addGPSData.ime
          }).then(res => {
            if (res.code == 1) {
              this.$Message.info(res.msg_customer);
              _this.addGPSbox = false;
              _this.initLists();
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

<style scoped lang="less">
#GPS {
  .Top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
