<template>
  <div class="commonStyle">
    <!-- 工程管理员的二级工程 -->
    <div class="content">
      <div class="header">
        <Breadcrumb class="titleName" style="display:inline-block;">
          <BreadcrumbItem>工程项目管理</BreadcrumbItem>
          <BreadcrumbItem>{{pm_name}}</BreadcrumbItem>
        </Breadcrumb>
        <div class="search">
          <label for>项目名：</label>
          <Input
            size="small"
            v-model="projectName"
            placeholder="请输入项目名"
            style="width: 150px"
            clearable
          />
          <label for>项目类型：</label>
          <Cascader
            class="zxh_cascader"
            size="small"
            :data="projectTypeLists"
            v-model="pm_type"
            style="width:150px;display: inline-block"
            placeholder="请选择项目类型"
            change-on-select
          ></Cascader>
          <label for>日期：</label>
          <Date-picker
            size="small"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
            @on-change="dateTime=$event"
            style="width: 150px"
          ></Date-picker>
          <Button size="small" @click="search(1)" type="primary">查询</Button>
          <Button size="small" @click="clickPro" type="success">新建项目</Button>
        </div>
      </div>
      <div class="table">
        <Table :loading="loading" :columns="columns" :data="tabData" height="520" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </div>
    </div>
    <!-- 编辑新增 -->
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
            <FormItem label="工程名称" prop="pm_name">
              <Input type="text" placeholder="请输入工程名称" v-model="formInline.pm_name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="成立时间" prop="start_time">
              <Date-picker
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择成立时间"
                style="width:184px;"
                @on-change="formInline.start_time=$event"
                v-model="formInline.start_time"
              ></Date-picker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="位置" prop="location">
              <Input type="text" @on-focus="mapshow=true" v-model="formInline.location" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="已绑定用户">
              <Input
                type="text"
                v-model.number="formInline.user_id"
                :readonly="true"
                @on-focus="chooseUser"
              >
                <img
                  src="/static/publicimg/bangding.png"
                  style="margin-top: 4px;"
                  slot="suffix"
                  alt
                  srcset
                />
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="项目类别" prop="pm_type">
              <Cascader
                :data="projectTypeLists"
                v-model="formInline.pm_type"
                style="width:180px;display: inline-block"
                change-on-select
              ></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="备注">
              <Input placeholder="请输入备注" type="text" v-model="formInline.comment" clearable></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('formInline')">取消</Button>
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
    <Modal v-model="userDialog" title="用户选择" width="760" @on-ok="chooseUserOk">
      <div class="add_text">
        <ul class="user">
          <CheckboxGroup v-model="userIds">
            <li v-for="(item,index) in userLists" :key="index">
              <Checkbox :label="item.user_id">{{item.name}}</Checkbox>
            </li>
          </CheckboxGroup>
        </ul>
        <div style="clear:both;"></div>
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
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      map_point: "",
      map_type: 0,
      userDialog: false,
      userIds: [],
      userLists: [],
      modal: false,
      mapshow: false,
      dialogShowMap: false,
      projectName: "",
      dateTime: "",
      projectTypeLists: [],
      region: [],
      page: 1,
      total: 0,
      tabData: [],
      loading: false,
      pm_type: [],
      title: "新建二级工程",
      formInline: {
        pm_name: "",
        start_time: "",
        location: "",
        location_type: "",
        user_id: "",
        comment: "",
        locationArr: [],
        pm_type: []
      },
      ruleInline: {
        pm_name: [
          {
            required: true,
            message: "请输入工程名称"
          },
          {
            min: 1,
            max: 20,
            message: "工程名称在1-20个字符之间",
            trigger: "blur"
          }
        ],
        location: [
          {
            required: true,
            message: "请输入地图位置"
          }
        ],
        start_time: [
          {
            required: true,
            message: "请输入成立时间"
          }
        ],
        pm_type: [
          {
            required: true,
            message: "请选择项目类别"
          }
        ]
      },
      columns: [
        {
          title: "工程名称",
          key: "pm_name",
          align: "center"
        },
        {
          title: "成立时间",
          key: "start_time",
          align: "center"
        },
        {
          title: "项目类型",
          key: "pm_type",
          align: "center"
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
                      this.map_point = params.row.location;
                      this.map_type = Number(params.row.location_type);
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
          title: "管理员",
          key: "pm_administrator",
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
                      this.toNextEngineer(params.row);
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
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.detail(params.row.pm_id);
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
                      this.delete(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ], //二级列表
      pm_name: ""
    };
  },
  mounted() {
    this.projectTypeLists = this.$zxh_fun.projectTypeLists;
    this.pm_name = JSON.parse(sessionStorage.getItem("user_info")).pm_name;
    sessionStorage.setItem("secondData", JSON.stringify(sessionStorage.getItem("user_info")));
    this.getSecondData(sessionStorage.getItem("user_info"));
    this.search();
  },
  components: {
    ChooseMap: resolve => {
      require(["../../components/Map/chooseMap.vue"], resolve);
    },
    LookMap: resolve => {
      require(["../../components/Map/lookMap.vue"], resolve);
    }
  },
  methods: {
    ...mapActions(["getThreeData", "getSecondData"]),
    toNextEngineer(data) {
      sessionStorage.setItem('threeData', JSON.stringify(data));
      this.getThreeData(data);
      this.$router.push("/index/thirdEngineerManagement");
    },
    chooseUser() {
      this.userDialog = true;
      this.$post("/base/common/userList", {
        client: "web"
      }).then(res => {
        if (res.code == 1) {
          this.userLists = res.data;
        } else {
          this.$Message.error(res.msg_customer);
        }
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
          this.$post("/admin/second_pm/secondPmDel", {
            pm_id: row.pm_id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.search();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    chooseUserOk() {
      this.formInline.user_id = this.userIds.length;
    },
    //列表
    search(index) {
      if (index) {
        this.page = 1;
      }
      this.loading = true;
      this.$post("/admin/second_pm/secondPmListPage", {
        pm_name: this.projectName,
        pm_type: this.pm_type[this.pm_type.length - 1],
        start_time: this.dateTime,
        limit: 10,
        page: this.page
      }).then(response => {
        this.loading = false;
        if (response.code == 1) {
          this.tabData = response.data.data;
          this.tabData = this.tabData.map(ele => {
            let type = "";
            switch (ele.pm_type) {
              case 1:
                type = "工程实体";
                break;
              case 2:
                type = "安全生产";
                break;
              case 3:
                type = "其他";
                break;
              default:
                type = "文明施工";
                break;
            }
            return {
              ...ele,
              pm_type: type
            };
          });
          this.total = response.data.total;
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    //编辑详情
    detail(id) {
      this.modal = true;
      this.title = "修改二级工程";
      this.$post("/admin/second_pm/secondPmDetail", {
        pm_id: id
      }).then(res => {
        if (res.code == 1) {
          this.formInline = res.data;
          let location = JSON.parse(res.data.location);
          this.formInline.locationArr = location;
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          let then = this;
          geocoder.getAddress(location[0], function(status, result) {
            if (status === "complete" && result.info === "OK") {
              then.formInline.location = result.regeocode.formattedAddress;
            }
          });
          this.formInline.pm_type = this.formInline.pm_type.toString();
          if (this.formInline.pm_type.length == 1) {
            this.formInline.pm_type = [this.formInline.pm_type];
          } else {
            this.formInline.pm_type = [
              this.formInline.pm_type.substr(0, 1),
              this.formInline.pm_type
            ];
          }
          let keys = [];
          this.userIds = [];
          this.formInline.user_name.forEach(ele => {
            let key = Object.keys(ele);
            keys = key;
          });
          keys.forEach(ele => {
            this.userIds.push(Number(ele));
          });
          this.formInline.user_id = this.userIds.length;
        }
      });
    },
    //分页
    changePage(val) {
      this.page = val;
      this.search();
    },
    //点击新增项目
    clickPro() {
      this.modal = true;
      this.title = "新建二级工程";
      this.pic = "";
      this.formInline = {
        loge_image_path: "",
        pm_name: "",
        region: [],
        start_time: "",
        location: "",
        location_type: "",
        company_name: "",
        bind_num: "",
        comment: "",
        locationArr: []
      };
      this.userIds = [];
    },
    //选择的地址返回
    siteSelection(site, data, type) {
      this.formInline.location = site;
      this.formInline.locationArr = data;
      this.formInline.location_type = type;
      this.mapshow = false;
    },
    //新建二级工程
    handleReset(name) {
      this.$refs[name].resetFields();
      this.modal = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.title == "新建二级工程") {
            this.$post("/admin/second_pm/secondPmAdd", {
              client: "web",
              pm_name: this.formInline.pm_name,
              start_time: this.$zxh_fun.getToday(this.formInline.start_time),
              location: JSON.stringify(this.formInline.locationArr),
              location_type: this.formInline.location_type,
              user_id: this.userIds,
              comment: this.formInline.comment,
              pm_type: this.formInline.pm_type[
                this.formInline.pm_type.length - 1
              ]
            }).then(res => {
              if (res.code == 1) {
                this.$Message.success("新增成功!");
                this.modal = false;
                this.search();
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          } else {
            this.$post("/admin/second_pm/secondPmEdit", {
              client: "web",
              pm_id: this.formInline.pm_id,
              pm_name: this.formInline.pm_name,
              start_time: this.$zxh_fun.getToday(this.formInline.start_time),
              location: JSON.stringify(this.formInline.locationArr),
              location_type: this.formInline.location_type,
              user_id: this.userIds,
              comment: this.formInline.comment,
              pm_type: this.formInline.pm_type[
                this.formInline.pm_type.length - 1
              ]
            }).then(res => {
              if (res.code == 1) {
                this.$Message.success("修改成功!");
                this.modal = false;
                this.search();
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.add_text {
  .user li {
    float: left;
    line-height: 30px;
    margin-right: 10px;
  }
}
</style>
