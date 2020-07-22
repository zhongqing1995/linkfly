<template>
  <div class="topDIV">
    <div class="name">
      <span>借出归还管理</span>
      <div class="search">
        <label for>借出人：</label>
        <Input size="small" v-model="name" placeholder="请输入借出人" style="width: 150px" clearable />
        <label for>型号：</label>
        <Select size="small" v-model="type" style="width:150px" placeholder="请选择型号" clearable>
          <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Button size="small" @click="initLists(1)" type="primary">查询</Button>
        <Button
          size="small"
          @click="clickPro"
          type="success"
          v-if="activeName=='name1'&&userType!=0"
        >借出</Button>
      </div>
    </div>
    <Tabs :value="activeName" @on-click="tabClick">
      <TabPane label="借出登记" name="name1">
        <Table :loading="loading" :columns="columns1" :data="tableData" height="460" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </TabPane>
      <TabPane label="归还登记" name="name2">
        <Table :loading="loading" :columns="columns2" :data="tableData" height="460" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </TabPane>
    </Tabs>
    <!-- 编辑借出登记 -->
    <Modal
      v-model="modal"
      :title="title"
      width="600"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="借出人" prop="user_id">
              <Select
                v-model="formInline.user_id"
                style="width:150px"
                placeholder="请选择借出人"
                clearable
              >
                <Option
                  v-for="item in userList"
                  :value="item.user_id"
                  :key="item.user_id"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="机名" prop="device_id">
              <Select
                v-model="formInline.device_id"
                @on-open-change="initManufacturer"
                @on-change="toChange"
                style="width:150px"
                placeholder="请选择机名"
                clearable
              >
                <Option
                  v-for="item in manufacturerList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.uav_name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="型号">
              <Input
                placeholder="请输入型号"
                type="text"
                style="width:150px"
                v-model="formInline.type_id"
                disabled
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="厂商">
              <Input
                placeholder="请输入厂商"
                type="text"
                style="width:150px"
                v-model="formInline.manufacturer"
                disabled
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="借出时间" prop="start_time">
              <DatePicker
                v-model="formInline.start_time"
                type="datetime"
                placeholder="请选择借出时间"
                style="width:150px"
                @on-change="formInline.start_time=$event"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="归还时间" prop="end_time">
              <DatePicker
                v-model="formInline.end_time"
                type="datetime"
                placeholder="请选择归还时间"
                style="width:150px"
                @on-change="formInline.end_time=$event"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注" prop="comment">
              <Input
                placeholder="请输入备注"
                type="text"
                v-model="formInline.comment"
                clearable
                style="width:440px"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
    <!-- 归还 -->
    <Modal
      v-model="modal1"
      title="设备归还"
      width="600"
      :mask-closable="false"
      @on-cancel="handleResetReturn('formInlineReturn')"
    >
      <Form
        ref="formInlineReturn"
        :model="formInlineReturn"
        :rules="ruleInlineReturn"
        :label-width="100"
      >
        <Row>
          <Col span="12">
            <FormItem label="归还时间" prop="return_time">
              <DatePicker
                v-model="formInlineReturn.return_time"
                type="datetime"
                placeholder="请选择归还时间"
                style="width:150px"
                @on-change="formInlineReturn.return_time=$event"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="设备状态" prop="is_damage">
              <Select
                v-model="formInlineReturn.is_damage"
                style="width:150px"
                placeholder="请选择设备状态"
                clearable
              >
                <Option value="0">正常</Option>
                <Option value="1">损坏</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注" prop="comment">
              <Input
                placeholder="请输入备注"
                type="text"
                v-model="formInlineReturn.comment"
                clearable
                style="width:440px"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmitReturn('formInlineReturn')">确认</Button>
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
      name: "",
      type: "",
      typeList: [],
      manufacturerList: [],
      userList: [],
      loading: false,
      modal: false,
      modal1: false,
      formInline: {
        device_id: "",
        user_id: "",
        start_time: "",
        end_time: "",
        comment: ""
      },
      formInlineReturn: {
        return_time: "",
        is_damage: "",
        comment: ""
      },
      ruleInlineReturn: {
        return_time: [
          {
            required: true,
            message: "请选择归还时间",
            trigger: "change"
          }
        ],
        is_damage: [
          {
            required: true,
            message: "请选择设备状态",
            trigger: "change"
          }
        ]
      },
      ruleInline: {
        device_id: [
          {
            required: true,
            type: "number",
            message: "请选择机名",
            trigger: "change"
          }
        ],
        user_id: [
          {
            required: true,
            type: "number",
            message: "请选择借出人",
            trigger: "change"
          }
        ],
        start_time: [
          {
            required: true,
            message: "请选择借出时间",
            trigger: "change"
          }
        ],
        end_time: [
          {
            required: true,
            message: "请选择归还时间",
            trigger: "change"
          }
        ]
      },
      title: "借出登记",
      activeName: "name1",
      columns1: [
        {
          title: "借出人",
          key: "user_name",
          align: "center"
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center"
        },
        {
          title: "借出时间",
          key: "start_time",
          align: "center"
        },
        {
          title: "归还时间",
          key: "end_time",
          align: "center"
        },
        {
          title: "机名",
          key: "device_name",
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
                    src: "../../../static/zxhImg/guihuan.png",
                    title: "归还"
                  },
                  style: {
                    marginRight: "8px",
                    width: "0.19rem",
                    height: "0.2rem",
                    display: params.row.is_return == 1 ? "none" : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.detail(params.row.id);
                    }
                  }
                },
                "归还"
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
      columns2: [
        {
          title: "借出人",
          key: "user_name",
          align: "center"
        },
        {
          title: "归还时间",
          key: "return_time",
          align: "center"
        },
        {
          title: "是否逾期",
          key: "is_overtime",
          align: "center"
        },
        {
          title: "机名",
          key: "device_name",
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
                    src: "../../../static/publicimg/delete.png",
                    title: "删除"
                  },
                  style: {
                    width: "0.19rem",
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.deleteReturn(params.row.id);
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
      url: "/admin/uav_device_lend/DeviceLendList",
      lend_id: "",
      userType: ""
    };
  },
  computed: {
    ...mapState(["rowData"])
  },
  mounted() {
    this.userType = sessionStorage.getItem("userType");
    this.initType();
    this.initLists();
    this.initUser();
    if (this.userType == 0) {
      this.columns1.pop();
      this.columns2.pop();
    }
  },
  methods: {
    //选择机名
    toChange(val) {
      let result = this.manufacturerList.filter(item => {
        return item.id == val;
      });
      if (result.length) {
        this.formInline.type_id = result[0].type_name;
        this.formInline.manufacturer = result[0].manufacturer;
      }
    },
    //型号列表
    initType() {
      this.$post("/admin/uav_device_type/DeviceTypeList", {
        first_pm_id: this.rowData.pm_id
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
    //借出人列表
    initUser() {
      this.$post("/base/common/userList", {
        client: "web"
      }).then(res => {
        if (res.code == 1) {
          if (res.data) {
            this.userList = res.data;
          }
        } else {
          this.$Message.warning(res.msg_customer);
        }
      });
    },
    //硬件列表
    initManufacturer(val) {
      if (val) {
        this.$post("/admin/uav_device/DeviceList", {
          first_pm_id: this.rowData.pm_id
        }).then(res => {
          if (res.code == 1) {
            if (res.data) {
              this.manufacturerList = res.data;
            }
          } else {
            this.$Message.warning(res.msg_customer);
          }
        });
      }
    },
    //tab切换
    tabClick(val) {
      this.activeName = val;
      this.page = 1;
      this.name = "";
      this.type = "";
      if (val == "name1") {
        this.url = "/admin/uav_device_lend/DeviceLendList";
      } else {
        this.url = "/admin/uav_device_return/DeviceReturnList";
      }
      this.initLists();
    },
    //初始化列表
    initLists(index) {
      if (index) {
        this.page = 1;
      }
      this.loading = true;
      this.$post(this.url, {
        page: this.page,
        limit: 10,
        user_name: this.name,
        type_id: this.type,
        first_pm_id: this.rowData.pm_id
      }).then(res => {
        this.loading = false;
        if (res.code == 1) {
          this.tableData = res.data.data;
          if (this.activeName == "name2") {
            this.tableData = this.tableData.map(ele => {
              let overtime = "";
              if (ele.is_overtime == 1) {
                overtime = "是";
              } else {
                overtime = "否";
              }
              return {
                ...ele,
                is_overtime: overtime
              };
            });
          }
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
    handleResetReturn(name) {
      this.$refs[name].resetFields();
    },
    handleSubmitReturn(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$post("/admin/uav_device_return/DeviceReturnAdd", {
            lend_id: this.lend_id,
            return_time: this.formInlineReturn.return_time,
            is_damage: this.formInlineReturn.is_damage,
            comment: this.formInlineReturn.comment
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success("归还登记成功!");
              this.modal1 = false;
              this.initLists();
              this.$refs[name].resetFields();
            } else {
              this.$Message.warning(res.msg_customer);
            }
          });
        }
      });
    },
    //新增修改取消
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //新增修改提交
    handleSubmit(name) {
      let start = new Date(this.formInline.start_time).getTime();
      let end = new Date(this.formInline.end_time).getTime();
      if (end < start) {
        this.$Message.warning("请选择合理的归还时间!");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$post("/admin/uav_device_lend/DeviceLendAdd", {
            device_id: this.formInline.device_id,
            user_id: this.formInline.user_id,
            start_time: this.formInline.start_time,
            end_time: this.formInline.end_time,
            comment: this.formInline.comment
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success("借出登记成功!");
              this.modal = false;
              this.initLists();
              this.$refs[name].resetFields();
            } else {
              this.$Message.warning(res.msg_customer);
            }
          });
        }
      });
    },
    //借出登记删除
    delete(id) {
      this.$Modal.confirm({
        title: "删除借出登记信息",
        content: "您是否要删除本条借出登记信息",
        onOk: () => {
          this.$post("/admin/uav_device_lend/DeviceLendDel", {
            lend_id: id
          }).then(res => {
            if (res.code == 1) {
              this.initLists();
              this.$Message.success("删除成功!");
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        },
        onCancel: () => {}
      });
    },
    //归还登记删除
    deleteReturn(id) {
      this.$Modal.confirm({
        title: "删除归还登记信息",
        content: "您是否要删除本条归还登记信息",
        onOk: () => {
          this.$post("/admin/uav_device_return/DeviceReturnDel", {
            return_id: id
          }).then(res => {
            if (res.code == 1) {
              this.initLists();
              this.$Message.success("删除成功!");
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        },
        onCancel: () => {}
      });
    },
    //详情
    detail(id) {
      this.modal1 = true;
      this.lend_id = id;
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