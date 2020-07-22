<template>
  <div class="topDIV">
    <div class="name">
      <span>无人机设备登记</span>
      <div class="search">
        <label for>型号：</label>
        <Select size="small" v-model="type" style="width:150px" placeholder="请选择型号" clearable>
          <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Button size="small" @click="initLists(1)" type="primary">查询</Button>
        <Button size="small" @click="clickPro" type="success" v-if="userType!=0">新增设备</Button>
      </div>
    </div>
    <Table :loading="loading" :columns="columns" :data="tableData" height="500" size="small"></Table>
    <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    <!-- 新增 -->
    <Modal
      v-model="modal"
      title="新增设备"
      :width="formInline.type_id==0?'900':'600'"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form
        ref="formInline"
        :model="formInline"
        :rules="ruleInline"
        :label-width="formInline.type_id==0?160:100"
      >
        <Row>
          <Col span="12">
            <FormItem label="机名" prop="uav_name">
              <Input placeholder="请输入机名" type="text" v-model="formInline.uav_name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="型号选择" prop="type_id">
              <Select v-model="formInline.type_id" placeholder="型号选择" clearable>
                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                <Option :value="0">其他型号</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="唯一序列号" prop="uav_number">
              <Input placeholder="请输入唯一序列号" type="text" v-model="formInline.uav_number" clearable></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formInline.type_id!=0">
          <Col span="24">
            <FormItem label="备注" prop="uav_comment">
              <Input placeholder="请输入备注" type="text" v-model="formInline.uav_comment" clearable></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-else-if="formInline.type_id==0">
          <Col span="24"></Col>
          <Col span="12">
            <FormItem label="型号" prop="name">
              <Input placeholder="请输入型号" type="text" v-model="formInline.name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="厂商" prop="manufacturer">
              <Input placeholder="请输入厂商" type="text" v-model="formInline.manufacturer"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <label for>尺寸(mm)</label>
          </Col>
          <Col span="8">
            <FormItem label="长">
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
          <Col span="24">
            <FormItem label="轴距" prop="wheelbase">
              <Input type="number" v-model="formInline.wheelbase" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="重量(包含云台保护罩)" prop="weight_cloud">
              <Input :maxlength="50" type="text" v-model="formInline.weight_cloud" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="重量(不包含云台保护罩)" prop="weight">
              <Input :maxlength="50" type="text" v-model="formInline.weight" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大上升速度" prop="max_up_speed">
              <Input :maxlength="5" type="number" v-model="formInline.max_up_speed"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大下降速度" prop="max_down_speed">
              <Input :maxlength="5" type="number" v-model="formInline.max_down_speed"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大水平飞行速度" prop="max_level_speed">
              <Input :maxlength="5" type="number" v-model="formInline.max_level_speed"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大起飞海拔高度" prop="max_takeoff_altitude">
              <Input :maxlength="9" type="number" v-model="formInline.max_takeoff_altitude"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大飞行时间" prop="max_fly_time">
              <Input :maxlength="3" type="number" v-model="formInline.max_fly_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最长悬停时间" prop="max_hover_time">
              <Input :maxlength="3" type="number" v-model="formInline.max_hover_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="综合续航" prop="integrated_continuity_time">
              <Input :maxlength="3" type="number" v-model="formInline.integrated_continuity_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最远续航里程" prop="max_continuity_mileage">
              <Input :maxlength="3" type="number" v-model="formInline.max_continuity_mileage"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="工作环境温度" prop="optimum_temperature">
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
                <Option value="1">GPS</Option>
                <Option value="2">GLONASS</Option>
                <Option value="3">混合</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <label for>悬停精度</label>
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
            <label for>悬停精度（视觉定位正常工作时）</label>
          </Col>
          <Col span="12">
            <FormItem label="垂直" prop="vertical_hover_accuracy">
              <Input :maxlength="10" type="number" v-model="formInline.vertical_hover_accuracy"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="水平" prop="continuity_hover_accuracy">
              <Input :maxlength="10" type="number" v-model="formInline.continuity_hover_accuracy"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="型号备注" prop="comment">
              <Input type="text" v-model="formInline.comment" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="设备备注" prop="uav_comment">
              <Input type="text" v-model="formInline.uav_comment" clearable></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
    <!-- 编辑 -->
    <Modal v-model="editModal" title="修改设备信息" :width="600" :mask-closable="false">
      <Form ref="formEditInline" :model="formEditInline" :rules="ruleEditInline" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="机名" prop="name">
              <Input placeholder="请输入机名" type="text" v-model="formEditInline.name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="型号选择" prop="type_id">
              <Select v-model="formEditInline.type_id" placeholder="型号选择" clearable>
                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                <!-- <Option :value="0">其他型号</Option> -->
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="设备状态" prop="is_damage">
              <Select v-model="formEditInline.is_damage" placeholder="设备状态选择" clearable>
                <Option :value="0">正常</Option>
                <Option :value="1">已损坏</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="备注" prop="uav_comment">
              <Input placeholder="请输入备注" type="text" v-model="formEditInline.uav_comment" clearable></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleEditSubmit('formEditInline')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      userType:'',
      total: 0,
      page: 0,
      type: "",
      loading: false,
      typeList: [],
      modal: false,
      formInline: {
        uav_name: "",
        type_id: null,
        uav_comment: "",
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
        ],
        uav_name: [
          {
            required: true,
            type: "string",
            message: "请输入无人机名称",
            trigger: "blur"
          }
        ],
        type_id: [
          {
            required: true,
            type: "number",
            message: "请选择类型",
            trigger: "blur"
          }
        ],
        uav_number: [
          {
            required: true,
            message: "请输入唯一序列号",
            trigger: "blur"
          }
        ]
      },
      columns: [
        {
          title: "无人机名称",
          key: "name",
          align: "center"
        },
        {
          title: "型号",
          key: "type_name",
          align: "center"
        },
        {
          title: "厂商",
          key: "manufacturer",
          align: "center"
        },
        {
          title: "设备状态",
          key: "damage",
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
      editModal: false,
      formEditInline: {
        name: "",
        type_id: "",
        is_damage: "",
        uav_comment: ""
      },
      ruleEditInline: {
        name: [
          {
            required: true,
            type: "string",
            message: "请输入机名",
            trigger: "blur"
          }
        ],
        type_id: [
          {
            required: true,
            type: "number",
            message: "请选择型号",
            trigger: "blur"
          }
        ],
        state: [
          {
            required: true,
            type: "string",
            message: "请输入设备状态",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed:{
    ...mapState(["rowData"])
  },
  mounted() {
    this.userType = sessionStorage.getItem('userType');
    if (this.userType==0) {
      this.columns.pop();
    }
    this.initType();
    this.initLists();
  },
  methods: {
    //型号列表
    initType() {
      this.$post("/admin/uav_device_type/DeviceTypeList", {
        first_pm_id:this.rowData.pm_id
      }).then(res => {
        if (res.code == 1) {
          if (res.data) {
            this.typeList = res.data;
          }
        } else {
          this.$Message.warning(res.msg_customer);
        }
      });
    },
    //初始化列表
    initLists(index) {
      if (index) {
        this.page = 1;
      }
      this.loading = true;
      this.$post("/admin/uav_device/DeviceListPage", {
        page: this.page,
        limit: 10,
        type_id: this.type,
        first_pm_id:this.rowData.pm_id
      }).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.tableData = res.data.data;
          this.tableData = this.tableData.map((ele, index) => {
            let damage = "";
            if (ele.is_damage == 0) {
              damage = "正常";
            } else {
              damage = "已损坏";
            }
            return {
              ...ele,
              damage: damage
            };
          });
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
    // 借出
    clickPro() {
      this.modal = true;
    },
    //新增修改取消
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //新增提交
    handleSubmit(name) {
      this.formInline.chang =
        this.formInline.chang === "" ? 0 : this.formInline.chang;
      this.formInline.kuan =
        this.formInline.kuan === "" ? 0 : this.formInline.kuan;
      this.formInline.gao =
        this.formInline.gao === "" ? 0 : this.formInline.gao;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$post("/admin/uav_device/DeviceAdd", {
            first_pm_id:JSON.parse(sessionStorage.getItem('user_info')).pm_id,
            uav_name: this.formInline.uav_name,
            uav_number: this.formInline.uav_number,
            type_id: this.formInline.type_id,
            uav_comment: this.formInline.uav_comment,
            name: this.formInline.name,
            manufacturer: this.formInline.manufacturer,
            size:
              this.formInline.chang +
              "*" +
              this.formInline.kuan +
              "*" +
              this.formInline.gao,
            wheelbase: this.formInline.wheelbase,
            weight: this.formInline.weight,
            weight_cloud: this.formInline.weight_cloud,
            max_up_speed: this.formInline.max_up_speed,
            max_down_speed: this.formInline.max_down_speed,
            max_level_speed: this.formInline.max_level_speed,
            max_takeoff_altitude: this.formInline.max_takeoff_altitude,
            max_fly_time: this.formInline.max_fly_time,
            max_hover_time: this.formInline.max_hover_time,
            integrated_continuity_time: this.formInline
              .integrated_continuity_time,
            max_continuity_mileage: this.formInline.max_continuity_mileage,
            satellite_positioning_module: this.formInline
              .satellite_positioning_module,
            vertical_hover_accuracy: this.formInline.vertical_hover_accuracy,
            vertical_hover_accuracy_abnormal: this.formInline
              .vertical_hover_accuracy_abnormal,
            continuity_hover_accuracy: this.formInline
              .continuity_hover_accuracy,
            continuity_hover_accuracy_abnormal: this.formInline
              .continuity_hover_accuracy_abnormal,
            comment: this.formInline.comment,
            optimum_temperature: this.formInline.optimum_temperature
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success("新增成功!");
              this.modal = false;
              this.initLists();
              this.$refs[name].resetFields();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    //编辑提交
    handleEditSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$post("/admin/uav_device/DeviceEdit", {
            device_id: this.formEditInline.id,
            uav_name: this.formEditInline.name,
            is_damage: this.formEditInline.is_damage,
            type_id: this.formEditInline.type_id,
            uav_comment: this.formEditInline.uav_comment
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success("修改成功!");
              this.editModal = false;
              this.initLists();
            } else {
              this.$Message.warning(res.msg_customer);
            }
          });
        }
      });
    },
    //删除
    delete(id) {
      this.$Modal.confirm({
        title: "删除设备",
        content: "您是否要删除本条设备信息",
        onOk: () => {
          this.delAsync(id);
        },
        onCancel: () => {}
      });
    },
    delAsync(id) {
      this.$post("/admin/uav_device/DeviceDel", {
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
      this.$post("/admin/uav_device/DeviceDetail", {
        id: id
      }).then(res => {
        if (res.code == 1) {
          this.editModal = true;
          this.formEditInline = res.data;
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