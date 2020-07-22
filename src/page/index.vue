<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh',minWidth:'1300px',overFlow:'auto'}">
      <Sider width="108" v-if="$route.path!='/index/bigDataManagement'">
        <div style="padding:10px 5px;text-align: center;">
          <!-- <img src="../../static/linkFly/logo.png" alt /> -->
          <img style="max-width:90px;max-height:64px;" :src="user_info.loge_image_path" alt="" srcset="">
        </div>
        <Menu active-name="1" width="auto" @on-select="choose" style="margin-top:20px;">
          <MenuItem v-for="(item,index) in menuLists" :name="item.id" :key="index" :to="item.path">
            <img v-if="selectId==item.id" :src="item.select" alt />
            <img v-else :src="item.noSelect" alt />
            <p style="font-size:0.1rem">{{item.name}}</p>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header
          v-if="$route.path!='/index/bigDataManagement'"
          :style="{'color':'#fff','background':selectName=='全局管理'?'#131415':'url(/static/linkFly/bg2.png) 100% 1%'}"
        >
          <h2>{{selectName}}</h2>
          <div class="headerRight">
            <img alt="用户头像" :src="user_info.head_icon" @click="userMessage" />
            <span @click="userMessage">{{user_info.name}}</span>
            <img
              style="width:15px;display:inline-block;"
              src="../../static/zxhImg/exit.png"
              alt
              srcset
              @click="exit(1)"
            />
          </div>
        </Header>
        <Content>
          <router-view />
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="personMsg" title="修改个人信息" width="600">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem prop="name" label="用户名">
              <Input v-model="formValidate.name" placeholder="请输入用户名" style="width:200px;"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="head_icon" label="用户头像">
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
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="account" label="账号">
              <Input
                disabled
                v-model="formValidate.account"
                placeholder="请输入账号"
                style="width:200px;"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="password" label="密码">
              <Input
                type="password"
                v-model="formValidate.password"
                placeholder="请输入密码"
                style="width:200px;"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="submitMsg('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
      uploadList: [],
      loading: false,
      imgName: "上传用户头像",
      personMsg: false,
      formValidate: {
        user_id: "",
        name: "",
        head_icon: "",
        account: "",
        password: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        head_icon: [
          {
            required: true,
            message: "头像不能为空"
          }
        ],
        account: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      },
      selectName: "全局管理",
      selectId: 1,
      user_info: {},
      menuLists: [
        {
          id: 1,
          noSelect: "../../static/zxhImg/Globalmanagement.png",
          select: "../../static/zxhImg/GlobalmanagementSelected.png",
          path: "/index/allManagement/allManagement",
          name: "全局管理"
        },
        {
          id: 2,
          noSelect: "../../static/zxhImg/EngineeringManagementSelected.png",
          select: "../../static/zxhImg/EngineeringManagement.png",
          path: "/index/engineerManagement",
          name: "工程管理"
        },
        {
          id: 3,
          noSelect: "../../static/zxhImg/Taskmanagement.png",
          select: "../../static/zxhImg/TaskmanagementSelected.png",
          path: "/index/EngineerCommon",
          name: "任务管理"
        },
        {
          id: 4,
          noSelect: "../../static/zxhImg/FlightoperationSelected.png",
          select: "../../static/zxhImg/Flightoperation.png",
          path: "/index/EngineerCommon",
          name: "飞行作业"
        },
        {
          id: 5,
          noSelect: "../../static/zxhImg/Dronemanagement.png",
          select: "../../static/zxhImg/DronemanagementSelected.png",
          path: "/index/EngineerCommon",
          name: "无人机管理"
        },
        {
          id: 9,
          noSelect: "../../static/zxhImg/gps.png",
          select: "../../static/zxhImg/gpsSelected.png",
          path: "/index/EngineerCommon",
          name: "GPS管理"
        },
        {
          id: 10,
          noSelect: "../../static/zxhImg/copter.png",
          select: "../../static/zxhImg/copterSelected.png",
          path: "/index/CopterManagement",
          name: "直升机管理"
        },
        {
          id: 6,
          noSelect: "../../static/zxhImg/UserManagement.png",
          select: "../../static/zxhImg/UserManagementSelected.png",
          path: "/index/Usermanagement",
          name: "用户管理"
        },
        // {
        //   id: 8,
        //   noSelect: "/static/zxhImg/data.png",
        //   select: "/static/zxhImg/selectedData.png",
        //   path: "/index/Usermanagement",
        //   name: "大数据"
        // }

      ]
    };
  },
  computed: {},
  mounted() {
    this.user_info = this.$publicdata.CheckuserLogin(); // 验证用户是否登录,公共接口
    let userType = sessionStorage.getItem("userType");
    this.menuLists.forEach(ele => {
      if (ele.name == "工程管理") {
        if (userType == 0) {
          ele.path = "/index/engineerManagement";
        } else {
          ele.path = "/index/gcEngineerManagement";
        }
      }
      if (ele.name == "用户管理") {
        if (userType == 0) {
          ele.path = "/index/UsermanagementEngineer";
        } else {
          ele.path = "/index/Usermanagement";
        }
      }
      if (ele.name == "任务管理") {
        if (userType == 0) {
          ele.path = "/index/EngineerCommon";
        } else {
          ele.path = "/index/TaskManagement";
        }
      }
      if (ele.name == "飞行作业") {
        if (userType == 0) {
          ele.path = "/index/EngineerCommon";
        } else {
          ele.path = "/index/Flight";
        }
      }
      if (ele.name == "无人机管理") {
        if (userType == 0) {
          ele.path = "/index/EngineerCommon";
        } else {
          ele.path = "/index/UAVmanagement";
        }
      }
      if (ele.name == "GPS管理") {
        if (userType == 0) {
          ele.path = "/index/EngineerCommon";
        } else {
          ele.path = "/index/GPSmanagement";
        }
      }

    });
    if (userType == 0) {
      this.menuLists.push({
        id: 7,
        noSelect: "../../static/zxhImg/update.png",
        select: "../../static/zxhImg/updateSelected.png",
        path: "/index/UpdateManagement",
        name: "版本管理"
      });
    }
    localStorage.setItem("selectName", '全局管理');
    if (localStorage.getItem("selectName")) {
      this.selectName = localStorage.getItem("selectName");
    } else {
      this.selectName = "全局管理";
    }
  },
  methods: {
    // 删除头像
    handleRemove(index) {
      this.formValidate.head_icon = "";
      this.uploadList.splice(index, 1);
    },
    // 用户信息
    userMessage() {
      this.personMsg = true;
      this.$post("/admin/admin/getUserInfo", {
        client: "web"
      }).then(res => {
        if (res.code == 1) {
          this.formValidate = res.data;
          this.uploadList[0] = res.data.head_icon;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    // 退出
    exit(index) {
      if (index == 1) {
        this.$Modal.confirm({
          title: "退出系统",
          content: "您确定要退出该系统吗？",
          onOk: () => {
            this.exitAsync(1);
          },
          onCancel: () => {}
        });
      } else {
        this.exitAsync(2);
      }
    },
    // 退出接口
    exitAsync(index) {
      let msg = "";
      if (index == 1) {
        msg = "退出成功";
      } else {
        msg = "请重新登录";
      }
      this.$post("/base/common/logout", {
        client: "web"
      }).then(res => {
        if (res.code == 1) {
          localStorage.clear();
          sessionStorage.clear();
          if (this.global_.websocket) {
            this.global_.websocket.close();
            this.$_bus.$emit('closeSocket',true);
          }
          this.$Notice.success({
            title: "退出",
            desc: msg
          });
          this.$router.push({
            path: "/"
          });
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //上传用户头像
    uploadBefore(file) {
      let isPic = this.$zxh_fun.truePic(file.type, this);
      if (isPic) {
        return;
      }
      if (file) {
        this.imgName = file.name;
        let fm = new FormData();
        fm.append("file[]", file);
        fm.append("client", "web");
        fm.append("use_type", 2);
        this.$post("/base/common/imageUp", fm).then(res => {
          if (res.code == 1) {
            this.formValidate.head_icon = res.data[0];
            this.uploadList.push(res.data[0]);
          } else {
            this.$Message.error(res.msg_customer);
          }
        });
      }
    },
    //修改个人信息
    submitMsg(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$post("/admin/admin/editUserInfo", {
            user_id: this.formValidate.user_id,
            password: this.$zxh_fun.encrypt(this.formValidate.password),
            name: this.formValidate.name,
            account: this.formValidate.account,
            head_icon: this.formValidate.head_icon
          }).then(res => {
            if (res.code == 1) {
              if (res.data.check_pass == 1) {
                this.exit(2);
              } else if (res.data.check_pass == 0) {
                this.$Message.success("修改成功！");
                this.personMsg = false;
                this.imgName = "上传用户头像";
                this.user_info.head_icon = this.formValidate.head_icon;
                this.user_info.name = this.formValidate.name;
                this.$refs[name].resetFields();
              }
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    //菜单选择
    choose(value) {
      this.selectId = value;
      let arr = this.menuLists.filter(ele => {
        return ele.id == value;
      });
      this.selectName = arr[0].name;
      localStorage.setItem("selectName", arr[0].name);
    }
  },
  watch: {},
};
</script>
<style lang="less" scoped>
h2 {
  float: left;
  font-size: 0.36rem;
  line-height: 0.43rem;
  margin-top: 0.35rem;
}
.headerRight {
  display: inline-flex;
  align-items: center;
  float: right;
  line-height: 0.64rem;
  cursor: pointer;
  img:nth-child(1) {
    width: 0.4rem;
    height: 0.4rem;
    border: 0.2rem;
    margin: 0px 0.1rem;
    border-radius: 50%;
  }
  img:nth-child(3) {
    width: 0.2rem;
    height: 0.2rem;
    margin: 0px 0px 0px 0.13rem;
  }
}
.layout .ivu-layout-header {
  padding: 0px 0.3rem 0px 0.45rem;
  line-height: 0px;
  height: 0.95rem;
}
.ivu-menu-item {
  text-align: center;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  color: black;
}
.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: black;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  display: none;
}
</style>




