<template>
  <div>
    <Row v-if="userType==1">
      <Button style="float:right;" size="small" @click="clickPro" type="success">新增</Button>
    </Row>
    <Table
      style="margin: 5px"
      :loading="loading"
      :columns="columns"
      :data="tabData"
      max-height="540"
      size="small"
    ></Table>
    <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    <!-- 新增 -->
    <Modal
      v-model="modal"
      title="新增"
      width="600"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form v-if="modal" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <Row>
          <Col span="24">
            <FormItem label="正射名称" prop="name">
              <Input type="text" placeholder="请输入正射名称" v-model="formInline.name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="位置" prop="location">
              <Input
                type="text"
                placeholder="请选择经纬度"
                @on-focus="mapshow=true"
                v-model="formInline.location"
                clearable
              ></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="区域" prop="region">
              <Cascader
                filterable
                placeholder="请选择区域"
                v-model="formInline.region"
                :data="regionArr"
                :load-data="loadData"
                @on-change="getregionArr"
                change-on-select
                clearable
                style="display:inline-block;"
              ></Cascader>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="描述" prop="position">
              <Input placeholder="请输入描述" type="text" v-model="formInline.position" clearable></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="是否附带kml文件">
              <i-switch :true-value="1" :false-value="0" v-model="formInline.is_attach_kml" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="正射文件" prop="zip">
              <Upload action :before-upload="uploadBefore">
                <Button icon="ios-cloud-upload-outline">zip格式限定</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('formInline')">取消</Button>
        <Button type="primary" @click="handleSubmit('formInline')" :loading="loading1">确认</Button>
      </div>
    </Modal>
    <Modal v-model="mapshow" title="位置选择" width="600">
      <div class="map" v-if="mapshow">
        <ChooseMap @refreshList="siteSelection"></ChooseMap>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="dialogShowMap" title="查看位置" width="600">
      <div v-if="dialogShowMap">
        <LookMap :map_point="map_point" :map_type="map_type"></LookMap>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看正射 -->
    <Modal v-model="dialogZhengshe" title="查看正射" fullscreen>
      <div>
        <span>名称:{{zhengsheJson.name}}</span>
        <span>经度:{{zhengsheJson.lat}}</span>
        <span>纬度:{{zhengsheJson.lon}}</span>
      </div>
      <div id="zsContainer" style="height:100%"></div>
      <Measure @measureChange="measureChange" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      zhengsheJson: {},
      mouseTool: null,
      googleLayer1: null,
      googleLayer2: null,
      loading1: false,
      dialogZhengshe: false,
      loading: false,
      mapshow: false,
      dialogShowMap: false,
      map_point: "",
      map_type: 0,
      userType: "",
      total: 0,
      page: 1,
      tabData: [],
      regionArr: [],
      columns: [
        {
          title: "正射名称",
          align: "center",
          key: "name"
        },
        {
          title: "备注",
          align: "center",
          key: "comment"
        },
        {
          title: "创建时间",
          align: "center",
          key: "data_create_time"
        },
        {
          title: "位置",
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
                      this.map_point = JSON.stringify([
                        [Number(params.row.lon), Number(params.row.lat)]
                      ]);
                      this.map_type = Number(1);
                    }
                  }
                },
                ""
              )
            ]);
          },
          align: "center"
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
                    title: "查看详情"
                  },
                  style: {
                    marginRight: "8px",
                    width: "0.19rem",
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.lookZhengshe(params.row);
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
                    height: "0.2rem",
                    display: this.userType == 1 ? "inline-block" : "none"
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
      modal: false,
      formInline: {
        location: "",
        name: "",
        lon: "",
        lat: "",
        position: "",
        zip: "",
        region: [],
        is_attach_kml: 1
      },
      ruleInline: {
        location: [
          {
            required: true,
            message: "请选择地图位置"
          }
        ],
        position: [
          {
            required: true,
            message: "请输入正射描述"
          },
          {
            type: "string",
            min: 2,
            max: 30,
            message: "请输入2-30个字符"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入正射名称"
          },
          {
            type: "string",
            min: 2,
            max: 30,
            message: "请输入2-30个字符"
          }
        ],
        zip: [
          {
            required: true,
            message: "请上传正射文件"
          }
        ],
        region: [
          {
            required: true,
            message: "请选择区域"
          }
        ]
      },
      map: null
    };
  },
  computed: {
    ...mapState(["threeData", "rowData"])
  },
  components: {
    ChooseMap: resolve => {
      require(["../../Map/chooseMap.vue"], resolve);
    },
    LookMap: resolve => {
      require(["../../Map/lookMap.vue"], resolve);
    },
    Measure: resolve => {
      require(["../../Map/measure.vue"], resolve);
    }
  },
  mounted() {
    this.userType = sessionStorage.getItem("userType");
    this.initLists();
    this.getregionArr(); // 获取区域信息
  },
  methods: {
    // 测距
    measureChange(val) {
      this.$zxh_fun.draw(val, this.mouseTool);
    },
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
    // 区域加载
    getregionArr() {
      // 获取区域列表
      this.$publicdata.getAreaName("").then(data => {
        data.forEach(item => {
          this.regionArr.push({
            value: item.code,
            label: item.name,
            children: [],
            loading: false
          });
        });
      });
    },
    // 列表
    initLists() {
      this.loading = true;
      this.$post("/admin/kml_data/kmlDataList", {
        pm_id:
          this.userType == 1
            ? JSON.parse(this.rowData).pm_id
            : this.rowData.pm_id,
        second_pm_id: this.threeData.pm_id,
        limit: 10,
        page: this.page
      }).then(response => {
        this.loading = false;
        if (response.code == 1) {
          this.tabData = response.data.data;
          this.total = response.data.total;
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    // 分页
    changePage(val) {
      this.page = val;
      this.initLists();
    },
    // 上传正射文件
    uploadBefore(file) {
      if (file) {
        if (file.name.indexOf(".zip") > -1) {
          this.formInline.zip = file;
        } else {
          this.$Message.error("请上传zip压缩包！");
        }
      }
    },
    //选择的地址返回
    siteSelection(site, data, type) {
      if (type == 1) {
        this.formInline.location = data[0].toString();
        this.formInline.lon = data[0][0];
        this.formInline.lat = data[0][1];
        this.mapshow = false;
      } else {
        this.$Message.warning("请选择一个点!");
      }
    },
    // 点击新增
    clickPro() {
      this.modal = true;
    },
    // 清除表单
    handleReset(name) {
      this.$refs[name].resetFields();
      this.modal = false;
    },
    // 表单提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let first_id =
            this.userType == 1
              ? JSON.parse(this.rowData).pm_id
              : this.rowData.pm_id;
          let fm = new FormData();
          fm.append("pm_id", first_id);
          fm.append("lon", this.formInline.lon);
          fm.append("lat", this.formInline.lat);
          fm.append("position", this.formInline.position);
          fm.append("name", this.formInline.name);
          fm.append(
            "region",
            this.formInline.region[this.formInline.region.length - 1]
          );
          fm.append("second_pm_id", this.threeData.pm_id);
          fm.append("zip[]", this.formInline.zip);
          fm.append("is_attach_kml", this.formInline.is_attach_kml);
          this.loading1 = true;
          this.$post("/admin/kml_data/kmlDataAdd", fm).then(res => {
            if (res.code == 1) {
              this.$Message.success("新增成功!");
              this.modal = false;
              this.initLists();
              this.$refs[name].resetFields();
            } else {
              this.$Message.error(res.msg_customer);
            }
            this.loading1 = false;
          });
        }
      });
    },
    // 列表删除
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/kml_data/kmlDataDel", {
            kml_id: row.id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.initLists();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    lookZhengshe(row) {
      let that = this;
      // 113.632767, 29.318245断峰山
      //
      this.dialogZhengshe = true;
      this.zhengsheJson = {
        name: row.name,
        lat: row.lat,
        lon: row.lon
      };
      this.map = new AMap.Map("zsContainer", {
        resizeEnable: true,
        zoom: 15, //地图显示的缩放级别
        center:
          row.lon == "113.380016" ? [113.632767, 29.318245] : [row.lon, row.lat]
      });
      // AMap.convertFrom([row.lon, row.lat], "gps", function(status, result) {
      //   if (result.info === "ok") {
      //     var lnglats = result.locations; // Array.<LngLat>
      //     var marker = new AMap.Marker({
      //       position: new AMap.LngLat(Number(lnglats[0].lng), Number(lnglats[0].lat)) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //     });
      //     // 将创建的点标记添加到已有的地图实例：
      //     that.map.add(marker);
      //   }
      // });
      this.mouseTool = new AMap.MouseTool(this.map);
      this.$zxh_fun.draw("距离测量", this.mouseTool);
      AMapUI.loadUI(["control/BasicControl"], function(BasicControl) {
        //图层切换控件
        that.map.addControl(
          new BasicControl.LayerSwitcher({
            position: "rt"
          })
        );
      });
      if (row.is_attach_kml == 1) {
        this.map.on("mousewheel", function() {
          if (that.map.getZoom() < 18) {
            that
              .$post("/admin/kml_data/kmlDataDetail", {
                kml_id: row.id,
                zoom: that.map.getZoom()
              })
              .then(res => {
                if (res.code == 1) {
                  if (res.data && res.data.length > 0) {
                    res.data.forEach((ele, index) => {
                      var imageLayer = new AMap.ImageLayer({
                        url: ele.imagePath,
                        bounds: new AMap.Bounds(
                          [ele.west, ele.south],
                          [ele.east, ele.north]
                        ),
                        zooms: that.map.getZoom(),
                        map: that.map
                      });
                    });
                  }
                }
              });
          }
        });
      } else {
        if (this.googleLayer1) {
          this.map.remove(this.googleLayer1);
        }
        this.googleLayer1 = new AMap.TileLayer({
          zIndex: 10,
          getTileUrl: function(x, y, z) {
            return (
              "http://www.linkeda.net:10001/file/kml_data/kml_id_" +
              // "http://134.175.32.185:10001/file/kml_data/kml_id_" +
              row.id +
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
        this.googleLayer1.setMap(this.map);
      }
      // this.map.setFitView();
    }
  }
};
</script>
