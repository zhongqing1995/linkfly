<template>
  <div class="chj_log_box">
    <!--登录框-->
    <div class="logBox">
      <div class="download">
        <span @mouseenter="loadIcon" @mouseleave="hiddenIcon">LinkFly移动端下载</span>
        <img :src="imgSrc" alt srcset />
      </div>
      <!--标题-->
      <div style="text-align: center;position: absolute;top: 40px;width:100%;">
        <img src="/static/linkFly/dbwa.png" style="display:inline-block;width:40%;" alt />
      </div>
      <Row class="content" @keyup.13="submit">
        <div class="contentText">
          <Row type="flex" class="lg">
            <Col span="24" class="name" style="margin-top:40px;text-align:center;">
              <img src="/static/linkFly/logo2.png" style="width:80px;" alt />
              <p style="margin:20px 0px;color:#fff;">无人机智慧管家</p>
            </Col>
          </Row>
          <Row type="flex" class="lg">
            <Col span="24" class="lg">
              <!-- <Input type="text" @keyup.enter="submit" placeholder="请输入账号" v-model="account" /> -->
              <input type="text" v-model="account" placeholder="请输入账号" />
            </Col>
          </Row>
          <Row type="flex" class="lg">
            <Col span="24">
              <!-- <Input type="password" @keyup.enter="submit" placeholder="请输入密码" v-model="password" /> -->
              <input type="password" v-model="password" placeholder="请输入密码" />
            </Col>
          </Row>
          <div style="clear:both;"></div>
          <Row type="flex" class="ok_log">
            <Col span="24">
              <div
                class="primary"
                @click="login"
                style="width: 100%;height: 40px;background: #666666;line-height: 40px;font-weight:bold;border-radius:24px;"
              >登&emsp;录</div>
            </Col>
          </Row>
          <Row type="flex" class="lg" style="float:right;">
            <Col span="24">
              <Checkbox @on-change="change" v-model="single">
                <span :style="{'color':single?'#2d8cf0':'#808080'}">记住密码</span>
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Row>
    </div>
    <!--底部-->
    <!-- <div class="chj_loh_copyright">湘ICP备19003646号-1 湘公网安备 43010302000915号</div> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions } from "vuex";
export default {
  data: function() {
    return {
      account: "",
      password: "",
      mess: "",
      erro: "",
      erro_show: false,
      single: false,
      imgSrc: ""
    };
  },
  created: function() {
    //武装部免登录
    if (window.location.href.lastIndexOf("?") > -1) {
      var text = window.location.href.substring(
        window.location.href.lastIndexOf("?") + 1,
        window.location.href.length
      );
      var account = text
        .split("&")[0]
        .substring(
          text.split("&")[0].lastIndexOf("=") + 1,
          text.split("&")[0].length
        );
      var pwd = text
        .split("&")[1]
        .substring(
          text.split("&")[1].lastIndexOf("=") + 1,
          text.split("&")[1].length
        );
      this.account = account;
      this.password = pwd;
      this.login();
    }
    this.account = sessionStorage.account;
    this.password = sessionStorage.pwd;
  },
  methods: {
    ...mapActions(["getSecondData", "getAdminId"]),
    login: function() {
      sessionStorage.clear();
      let then = this;
      this.$post("/admin/login/Login", {
        account: this.account,
        password: this.$zxh_fun.encrypt(this.password),
        client: "web"
      }).then(res => {
        if (res.code == 0) {
          this.$Notice.error({
            title: "登录提示",
            desc: res.msg_customer
          });
        }
        sessionStorage.setItem("user_info", JSON.stringify(res.data.user_info));
        let token = "?token=" + res.data.token;
        sessionStorage.setItem("token", token);
        let type = res.data.user_info.type;
        sessionStorage.setItem("userType", type);
        if (type == 1) {
          sessionStorage.setItem(
            "secondData",
            JSON.stringify(res.data.user_info)
          );
          this.getSecondData(res.data.user_info);
          sessionStorage.setItem(
            "adminId",
            JSON.stringify(res.data.user_info.user_id)
          );
          this.getAdminId(res.data.user_info.user_id);
        }
        if (typeof res.data.user_info.name != "undefined") {
          then.$router.push({
            // path: "/index/allManagement/allManagement"
            path: "/index/bigDataManagement"
          });
        }
      });
    },
    //回车登录
    submit(e) {
      if (e.keyCode === 13) {
        this.login();
      }
    },
    //  记住密码
    change(val) {
      if (this.single) {
        sessionStorage.account = this.account;
        sessionStorage.pwd = this.password;
      } else {
        sessionStorage.clear();
      }
    },
    loadIcon() {
      this.$post("/admin/qr_code/getCodePic", {}).then(res => {
        if (res.code == 1) {
          this.imgSrc = res.data[0];
        }
      });
    },
    hiddenIcon() {
      this.imgSrc = "";
    }
  }
};
</script>
<style scoped>
@import "../../font/iconfont";
* {
  padding: 0;
  margin: 0;
}

.lg input {
  width: 100%;
  border: transparent;
  /* background: transparent; */
  /* border-bottom: 1px solid #808080; */
  height: 36px;
  border-radius: 16px;
  text-indent: 2em;
}

.chj_log_box {
  position: relative;
  background-image: url(/static/linkFly/bj.png);
  background-repeat: no-repeat;
  background-color: #000;
  background-size: 100% 100%;
  max-width: 100%;
  min-width: 1280px;
  height: 100vh;
  overflow: hidden;
  padding-right: 15px;
}
.logBox {
  /* position: absolute;
  left: 50%;
  top: 52%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-image: url("/static/linkFly/login.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 80%;
  height: 640px;
  border-radius: 5px; */
}
.download {
  text-align: right;
  color: #fff;
  cursor: pointer;
  position: relative;
  top: 10px;
}
.download span {
  width: 120px;
}
.download span:hover {
  color: #32a3e1;
}
.download img {
  width: 240px;
  position: absolute;
  top: 20px;
  right: 0px;
}
.content {
  height: 380px;
  position: absolute;
  top: 16%;
  right: 4%;
}
.title {
  color: #707584;
  text-align: center;
  font-size: 36px;
  padding: 20px;
}
.contentText {
  width: 300px;
  height: 400px;
  float: right;
  margin-right: 230px;
  margin-top: 60px;
  padding: 0 30px;
  background-image: url("/static/linkFly/dlbjk.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.name > h3 {
  font-size: 24px;
  font-weight: normal;
  width: 100%;
  padding: 10px 0px;
}
.name > span {
  width: 80px;
  height: 1px;
  display: block;
  background-color: #808080;
  margin-bottom: 40px;
}
.lg {
  margin-bottom: 10px;
}
.ok_log {
  margin: 20px 0px;
}
.chj_loh_copyright {
  /* color: #333; */
  color: #fff;
  font-size: 12px;
  position: fixed;
  margin: auto;
  width: 360px;
  margin-left: -168px;
  left: 50%;
  bottom: 20px;
  text-align: center;
}
.primary {
  width: 100%;
  height: 30px;
  background: rgb(45, 94, 160);
  text-align: center;
  line-height: 30px;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
</style>
