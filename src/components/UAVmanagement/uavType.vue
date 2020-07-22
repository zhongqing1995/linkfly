<template>
  <div class="topDIV">
    <div class="name">
      <span>无人机型号管理</span>
      <div class="search">
        <label for>型号：</label>
        <Input size="small" v-model="type" placeholder="请输入型号" style="width: 150px" clearable />
        <Button size="small" @click="initLists(1)" type="primary">查询</Button>
        <Button size="small" @click="clickPro" type="success" v-if="userType!=0">新增型号</Button>
      </div>
    </div>
    <Table :loading="loading" :columns="columns" :data="tableData" height="500" size="small"></Table>
    <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    <!-- 编辑新增 -->
    <Modal
      v-model="modal"
      :title="title"
      width="800"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="160">
        <Row>
          <Col span="12">
            <FormItem label="型号" prop="name">
              <Input placeholder="请输入型号" type="text" v-model="formInline.name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="型号图片" prop="image">
              <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                <template>
                  <img :src="item" />
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
                :before-upload="uploadBefore"
                action
                type="drag"
                style="display: inline-block;width:58px;vertical-align:top;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="厂商" prop="manufacturer">
              <Input placeholder="请输入厂商" type="text" v-model="formInline.manufacturer" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="轴距(mm)" prop="wheelbase">
              <Input placeholder="请输入轴距(mm)" type="number" v-model="formInline.wheelbase"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <label for>尺寸(mm)</label>
          </Col>
          <Col span="8">
            <FormItem label="长" prop="chang">
              <Input type="number" v-model="formInline.chang"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="宽" prop="kuan">
              <Input type="number" v-model="formInline.kuan"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="高" prop="gao">
              <Input type="number" v-model="formInline.gao"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="重量(包含云台保护罩)g" prop="weight_cloud">
              <Input :maxlength="50" type="text" v-model="formInline.weight_cloud" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="重量(不包含云台保护罩)g" prop="weight">
              <Input :maxlength="50" type="text" v-model="formInline.weight" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大上升速度(m/s)" prop="max_up_speed">
              <Input type="number" :maxlength="5" v-model="formInline.max_up_speed"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大下降速度(m/s)" prop="max_down_speed">
              <Input :maxlength="5" type="number" v-model="formInline.max_down_speed"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大水平飞行速度(km/h)" prop="max_level_speed">
              <Input :maxlength="5" type="number" v-model="formInline.max_level_speed"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大起飞海拔高度(m)" prop="max_takeoff_altitude">
              <Input :maxlength="9" type="number" v-model="formInline.max_takeoff_altitude"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大飞行时间(min)" prop="max_fly_time">
              <Input :maxlength="3" type="number" v-model="formInline.max_fly_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最长悬停时间(min)" prop="max_hover_time">
              <Input :maxlength="3" type="number" v-model="formInline.max_hover_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="综合续航(min)" prop="integrated_continuity_time">
              <Input :maxlength="3" type="number" v-model="formInline.integrated_continuity_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最远续航里程(km)" prop="max_continuity_mileage">
              <Input :maxlength="3" type="number" v-model="formInline.max_continuity_mileage"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="工作环境温度(℃)" prop="optimum_temperature">
              <Input :maxlength="50" type="text" v-model="formInline.optimum_temperature" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="卫星定位模块" prop="satellite_positioning_module">
              <Select
                size="small"
                v-model="formInline.satellite_positioning_module"
                placeholder="卫星定位模块选择"
              >
                <Option :value="1">GPS</Option>
                <Option :value="2">GLONASS</Option>
                <Option :value="3">混合</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <label for>悬停精度(m)</label>
          </Col>
          <Col span="12">
            <FormItem label="垂直" prop="vertical_hover_accuracy_abnormal">
              <Input :maxlength="10" type="number" v-model="formInline.vertical_hover_accuracy_abnormal"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="水平" prop="continuity_hover_accuracy_abnormal">
              <Input :maxlength="10" type="number" v-model="formInline.continuity_hover_accuracy_abnormal"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <label for>悬停精度（视觉定位正常工作时）m</label>
          </Col>
          <Col span="12">
            <FormItem label="垂直" prop="vertical_hover_accuracy">
              <Input :maxlength="10" type="number" v-model="formInline.vertical_hover_accuracy"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="水平" prop="continuity_hover_accuracy">
              <Input :maxlength="10" type="number" v-model="formInline.continuity_hover_accuracy" ></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注" prop="comment">
              <Input placeholder="请输入备注" type="text" v-model="formInline.comment" clearable></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      total: 0,
      page: 0,
      name: "",
      type: "",
      modal: false,
      formInline: {
        name: "",
        manufacturer: "",
        chang: "",
        kuan: "",
        gao: "",
        wheelbase: "",
        weight_cloud: "",
        weight: "",
        max_up_speed: "",
        max_down_speed: "",
        max_level_speed: "",
        max_takeoff_altitude: "",
        max_fly_time: "",
        max_hover_time: "",
        integrated_continuity_time: "",
        max_continuity_mileage: "",
        optimum_temperature: "",
        satellite_positioning_module: "",
        vertical_hover_accuracy_abnormal: "",
        continuity_hover_accuracy_abnormal: "",
        vertical_hover_accuracy: "",
        continuity_hover_accuracy: "",
        comment: "",
        image: ""
      },
      ruleInline: {
        name: [
          {
            required: true,
            type: "string",
            message: "请输入型号名称",
            trigger: "blur"
          }
        ],
        manufacturer: [
          {
            required: true,
            type: "string",
            message: "请输入厂商",
            trigger: "blur"
          }
        ],
        optimum_temperature: [
          {
            required: true,
            type: "string",
            message: "请输入工作环境温度",
            trigger: "blur"
          }
        ]
      },
      title: "新增型号",
      columns: [
        {
          title: "型号",
          key: "name",
          align: "center"
        },
        {
          title: "厂商",
          key: "manufacturer",
          align: "center"
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "操作",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h("div", [
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
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.detail(params.row.id);
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
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      uploadList: [],
      userType: ""
    };
  },
  computed:{
    ...mapState(["rowData"])
  },
  mounted() {
    this.userType = sessionStorage.getItem("userType");
    if (this.userType == 0) {
      this.columns.pop();
    }
    this.initLists();
  },
  methods: {
    //初始化列表
    initLists(index) {
      if (index) {
        this.page = 1;
      }
      this.loading = true;
      this.$post("/admin/uav_device_type/DeviceTypeListPage", {
        page: this.page,
        limit: 10,
        type_name: this.type,
        first_pm_id:this.rowData.pm_id
      }).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$Message.warning(res.msg_customer);
        }
      });
    },
    //分页
    changePage(val) {
      this.page = val;
      this.initLists();
    },
    // 点击新增型号
    clickPro() {
      this.modal = true;
      this.uploadList = [];
      this.title = "新增型号";
    },
    //新增修改取消
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //上传图片
    uploadBefore(file) {
      let isPic = this.$zxh_fun.truePic(file.type, this);
      if (isPic) {
        return;
      }
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
      this.uploadList.push(file.url);
      this.formInline.image = file;
    },
    //删除图片
    handleRemove(index) {
      this.formInline.image = "";
      this.uploadList.splice(index, 1);
    },
    //新增修改提交
    handleSubmit(name) {
      this.formInline.chang =
        this.formInline.chang === "" ? 0 : this.formInline.chang;
      this.formInline.kuan =
        this.formInline.kuan === "" ? 0 : this.formInline.kuan;
      this.formInline.gao =
        this.formInline.gao === "" ? 0 : this.formInline.gao;
      this.$refs[name].validate(valid => {
        if (valid) {
          let fm = new FormData();
          if (this.title == "编辑型号信息") {
            fm.append("id", this.formInline.id);
          }
          fm.append("name", this.formInline.name);
          fm.append("manufacturer", this.formInline.manufacturer);
          fm.append("optimum_temperature", this.formInline.optimum_temperature);
          fm.append(
            "size",
            this.formInline.chang +
              "*" +
              this.formInline.kuan +
              "*" +
              this.formInline.gao
          );
          fm.append("file[]", this.formInline.image);
          fm.append("wheelbase", this.formInline.wheelbase);
          fm.append("weight", this.formInline.weight);
          fm.append("weight_cloud", this.formInline.weight_cloud);
          fm.append("max_up_speed", this.formInline.max_up_speed);
          fm.append("max_down_speed", this.formInline.max_down_speed);
          fm.append("max_level_speed", this.formInline.max_level_speed);
          fm.append(
            "max_takeoff_altitude",
            this.formInline.max_takeoff_altitude
          );
          fm.append("max_fly_time", this.formInline.max_fly_time);
          fm.append("max_hover_time", this.formInline.max_hover_time);
          fm.append(
            "integrated_continuity_time",
            this.formInline.integrated_continuity_time
          );
          fm.append(
            "max_continuity_mileage",
            this.formInline.max_continuity_mileage
          );
          fm.append(
            "satellite_positioning_module",
            this.formInline.satellite_positioning_module
          );
          fm.append(
            "vertical_hover_accuracy",
            this.formInline.vertical_hover_accuracy
          );
          fm.append(
            "vertical_hover_accuracy_abnormal",
            this.formInline.vertical_hover_accuracy_abnormal
          );
          fm.append(
            "continuity_hover_accuracy",
            this.formInline.continuity_hover_accuracy
          );
          fm.append(
            "continuity_hover_accuracy_abnormal",
            this.formInline.continuity_hover_accuracy_abnormal
          );
          fm.append("comment", this.formInline.comment);
          fm.append("first_pm_id", JSON.parse(sessionStorage.getItem('user_info')).pm_id);
          if (this.title == "新增型号") {
            this.$post("/admin/uav_device_type/DeviceTypeAdd", fm).then(res => {
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
            this.$post("/admin/uav_device_type/DeviceTypeEdit", fm).then(
              res => {
                if (res.code == 1) {
                  this.$Message.success("修改成功!");
                  this.modal = false;
                  this.initLists();
                  this.$refs[name].resetFields();
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          }
        }
      });
    },
    //删除
    delete(id) {
      this.$Modal.confirm({
        title: "删除型号",
        content: "您是否要删除本条型号信息",
        onOk: () => {
          this.delAsync(id);
        },
        onCancel: () => {}
      });
    },
    delAsync(id) {
      this.$post("/admin/uav_device_type/DeviceTypeDel", {
        id: id
      }).then(res => {
        if (res.code == 1) {
          this.initLists();
          this.$Message.success("删除成功!");
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //详情
    detail(id) {
      this.$post("/admin/uav_device_type/DeviceTypeDetail", {
        id: id
      }).then(res => {
        if (res.code == 1) {
          this.title = "编辑型号信息";
          this.modal = true;
          this.formInline = res.data;
          this.uploadList = [];
          if (this.formInline.image) {
            this.uploadList.push(this.formInline.image);
          }
          this.formInline.chang = this.formInline.size.split("*")[0];
          this.formInline.kuan = this.formInline.size.split("*")[1];
          this.formInline.gao = this.formInline.size.split("*")[2];
        } else {
          this.$Message.warning(res.msg_customer);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.search {
  font-size: 12px;
  display: inline-block;
  color: #515a6e;
  float: right;
}
</style>