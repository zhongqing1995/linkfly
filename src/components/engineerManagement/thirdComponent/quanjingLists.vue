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
    <!-- 新增、修改 -->
    <Modal
      v-model="modal"
      :title="title"
      width="600"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <Row>
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
            <FormItem label="全景缩略名" prop="short_name">
              <Input placeholder="请输入全景缩略名" type="text" v-model="formInline.short_name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="区域" prop="region">
              <Cascader
                filterable
                v-if="isLocation"
                placeholder="请选择区域"
                v-model="formInline.region"
                :data="regionArr"
                :load-data="loadData"
                @on-change="getregionArr"
                change-on-select
                clearable
                style="display:inline-block;"
              ></Cascader>
              <Input
                v-else
                type="text"
                @on-focus="isLocation=true"
                v-model="formInline.regionName"
                clearable
              ></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="描述" prop="position">
              <Input placeholder="请输入描述" type="text" v-model="formInline.position" clearable></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" class="addimg" style="margin-left:30px;">
            <span style="color:red;font-weight:bold;">*</span>
            <span style="margin-right:10px;">上传全景图</span>
            <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
              <template>
                <img :src="formInline.image" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                </div>
              </template>
            </div>
            <Upload
              v-if="uploadList.length<1"
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :before-upload="handleBeforeUpload"
              action
              type="drag"
              style="display: inline-block;width:58px;vertical-align:top;"
            >
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('formInline')">取消</Button>
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
    <Modal v-model="mapshow" title="位置选择" width="600">
      <div class="map" v-if="mapshow">
        <ChooseMap @refreshList="siteSelection"></ChooseMap>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="dialogShowMap" title="查看位置" width="600">
      <LookMap v-if="dialogShowMap" :map_point="map_point" :map_type="map_type"></LookMap>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看全景图 -->
    <Modal v-model="quanjingDialog" title="查看全景图" fullscreen>
      <div>
        <span>名称:{{quanjingJson.name}}</span>
        <span>经度:{{quanjingJson.lat}}</span>
        <span>纬度:{{quanjingJson.lon}}</span>
      </div>
      <div id="photo" v-if="quanjingDialog"></div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
export default {
  data() {
    return {
      quanjingJson: {},
      quanjingDialog: false,
      mapshow: false,
      dialogShowMap: false,
      userType: "",
      loading: false,
      map_point: "",
      map_type: 0,
      columns: [
        {
          title: "添加人名称",
          align: "center",
          key: "name"
        },
        {
          title: "描述",
          align: "center",
          key: "position"
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
                      this.map_type = 1;
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
                      this.lookQuanjing(params.row);
                    }
                  }
                },
                "查看详情"
              ),
              h(
                "img",
                {
                  attrs: {
                    src: "../../../static/zxhImg/edit.png",
                    title: "修改"
                  },
                  style: {
                    marginRight: "8px",
                    width: "0.19rem",
                    height: "0.2rem",
                    display: this.userType == 1 ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      this.title = "编辑";
                      this.detail(params.row);
                    }
                  }
                },
                "修改"
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
      regionArr: [],
      tabData: [],
      total: 0,
      page: 1,
      modal: false,
      title: "新增",
      isLocation: true,
      formInline: {
        location: "",
        lon: "",
        lat: "",
        position: "",
        image: "",
        short_name: "",
        region: [],
        regionName: ""
      },
      uploadList: [],
      ruleInline: {
        location: [
          {
            required: true,
            message: "请选择地图位置"
          }
        ],
        short_name: [
          {
            required: true,
            message: "请输入全景缩略图"
          },
          {
            type: "string",
            min: 2,
            max: 10,
            message: "请输入2-10个字符"
          }
        ],
        region: [
          {
            required: true,
            message: "请选择区域"
          }
        ],
        position: [
          {
            required: true,
            message: "请输入全景描述"
          },
          {
            type: "string",
            min: 2,
            max: 30,
            message: "请输入2-30个字符"
          }
        ]
      },
      panorama_id: ""
    };
  },
  components: {
    ChooseMap: resolve => {
      require(["../../Map/chooseMap.vue"], resolve);
    },
    LookMap: resolve => {
      require(["../../Map/lookMap.vue"], resolve);
    }
  },
  computed: {
    ...mapState(["threeData", "rowData"])
  },
  mounted() {
    this.userType = sessionStorage.getItem("userType");
    this.initLists();
    this.getregionArr(); // 获取区域信息
  },
  methods: {
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
    // 全景详情
    lookQuanjing(row) {
      this.quanjingDialog = true;
      this.quanjingJson = {
        name: row.position,
        lat: row.lat,
        lon: row.lon
      };
      this.$post("/admin/panorama/panoramaDetail", {
        panorama_id: row.id
      }).then(res => {
        if (res.code == 1) {
          let div = document.getElementById("photo");
          let PSV = new PhotoSphereViewer({
            panorama: res.data.image_path,
            container: div,
            time_anim: false,
            navbar: ["autorotate", "zoom", "markers", "caption", "fullscreen"],
            size: {
              width: "100%",
              height: 500
            }
          });
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    // 列表
    initLists() {
      this.loading = true;
      this.$post("/admin/panorama/panoramaList", {
        first_pm_id:
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
    // 列表删除
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/panorama/panoramaDel", {
            panorama_id: row.id
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
    // 详情
    detail(row) {
      this.panorama_id = row.id;
      this.$post("/admin/panorama/panoramaDetail", {
        panorama_id: row.id
      }).then(res => {
        if (res.code == 1) {
          this.modal = true;
          this.isLocation = false;
          this.uploadList = [];
          let data = res.data;
          this.formInline.lon = data.lon;
          this.formInline.lat = data.lat;
          this.formInline.short_name = data.short_name;
          this.formInline.regionName = data.region_name;
          this.formInline.region = this.$zxh_fun.region_change(data.region);
          this.formInline.position = data.position;
          this.formInline.location = [data.lon, data.lat].toString();
          this.formInline.image = data.image_path;
          this.uploadList.push(data.image_path);
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
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
          let fm = new FormData();
          let first_id =
            this.userType == 1
              ? JSON.parse(this.rowData).pm_id
              : this.rowData.pm_id;
          fm.append("short_name", this.formInline.short_name);
          fm.append(
            "region",
            this.formInline.region[this.formInline.region.length - 1]
          );
          fm.append("lon", this.formInline.lon);
          fm.append("lat", this.formInline.lat);
          fm.append("position", this.formInline.position);
          fm.append("image[]", this.uploadList[0]);
          if (this.title == "新增") {
            fm.append("first_pm_id", first_id);
            fm.append("second_pm_id", this.threeData.pm_id);
            this.$post("/admin/panorama/panoramaAdd", fm).then(res => {
              if (res.code == 1) {
                this.$Message.success("新增成功!");
                this.modal = false;
                this.initLists();
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          } else {
            fm.append("panorama_id", this.panorama_id);
            this.$post("/admin/panorama/panoramaUpdate", fm).then(res => {
              if (res.code == 1) {
                this.$Message.success("编辑成功!");
                this.modal = false;
                this.initLists();
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          }
        }
      });
    },
    // 删除图片
    handleRemove(index) {
      this.formInline.image = "";
      this.uploadList.splice(index, 1);
    },
    //上传全景图
    handleBeforeUpload(file) {
      let isPic = this.$zxh_fun.truePic(file.type, this);
      if (isPic) {
        return;
      }
      if (file) {
        if (window.createObjectURL != undefined) {
          // basic
          file.url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          file.url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          file.url = window.webkitURL.createObjectURL(file);
        }
        this.formInline.image = file.url;
        this.uploadList.push(file);
      }
    },
    // 点击新增按钮
    clickPro() {
      this.modal = true;
      this.uploadList = [];
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
    }
  }
};
</script>
<style lang="less" scoped>
</style>