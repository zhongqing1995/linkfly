<template>
  <!--聊天室-->
  <div class="chj_map_chaRoom">
    <div class="chj_map_chalist">
      <ul>
        <li
          style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
          v-for="(item,index) in chatMsgLists.list"
          @click="chooseChat(item,index)"
          :key="index"
          v-bind:class="{addxuanzhe:currentUser.uid==item.from_id}"
          :title="item.from_name"
        >{{item.from_name}}</li>
      </ul>
    </div>
    <div class="chj_map_text">
      <div class="chj_map_charheader">
        <span>{{currentUser.name}}</span>
        <i @click="closex()">X</i>
      </div>
      <div class="chj_map_charcontent" id="chj_map_id">
        <ul id="chatul">
          <li
            v-if="item.from_id==currentUser.uid || item.target_id==currentUser.uid"
            v-for="(item,index) in chatMsgLists.record"
            :key="index"
            v-bind:class="{liaotian:item.from_id==userInfo.user_id}"
          >
            <img
              v-if="item.from_id!=userInfo.user_id"
              :src="item.from_id==userInfo.user_id?userInfo.head_icon:currentUser.head_icon_path"
              alt="用户头像"
            />
            <div v-show="item.msg_type=='normal'" class="chj_map_chartext">{{item.msg_content}}</div>
            <audio v-show="item.msg_type=='voice'" :src="item.msg_content" controls="controls"></audio>
            <img
              v-if="item.from_id==userInfo.user_id"
              :src="item.from_id==userInfo.user_id?userInfo.head_icon:currentUser.head_icon_path"
              alt="用户头像"
            />
          </li>
        </ul>
      </div>
      <span style="height:20px;display:block;">
        <Icon type="ios-mic" color="#000" size="20" title="语音" @click="toVoice" />
        <i v-if="disVoice" class="span1">{{duration}}s</i>
      </span>
      <div>
        <textarea
          :disabled="disVoice"
          style="border:1px solid transparent;width:100%;height:80px;"
          v-model="send_content"
          @keyup.enter="sendContent"
        ></textarea>
      </div>

      <div class="chj_map_charsend" @click="sendContent()">发送(enter)</div>
    </div>
  </div>
</template>
<script>
import Recorder from "js-audio-recorder";
export default {
  props: ["currentUser", "chatMsgLists"],
  data() {
    return {
      userInfo: {},
      showChat: true,
      send_content: "",
      duration: 0,
      Recorders: null,
      disVoice: false,
      chatUsers: []
    };
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    var that = this;
    //  事件监听
    //获取被按下的键值keydown
    var execute = true;
    document.onkeydown = function(e) {
      var keyNum = window.event ? e.keyCode : e.which;
      if (keyNum == 32) {
        if (execute && that.disVoice) {
          that.startVoice();
        }
        execute = false;
      }
    };
    document.onkeyup = function(e) {
      var keyNum = window.event ? e.keyCode : e.which;
      if (keyNum == 32 && that.disVoice) {
        that.Recorders.stop();
        that.sendlVoice();
        execute = true;
      }
    };
  },
  methods: {
    chooseChat(item, index) {
      this.$emit("currentChange", item);
    },
    creatReoverds() {
      this.Recorders = new Recorder();
    },
    startVoice() {
      let that = this;
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then(stream => {
          let that = this;
          this.Recorders == null ? this.creatReoverds() : this.Recorders;
          this.Recorders.start(); // 开始录音
          this.Recorders.onprocess = function(duration) {
            that.duration = Math.ceil(duration);
          };
        })
        .catch(err => {
          this.$Notice.warning({
            title: "提示",
            desc: "检测到您的电脑未连接麦克风的设备，请连接!"
          });
        });
    },
    sendlVoice() {
      // 发送
      if (this.Recorders == null) {
        this.$Notice.warning({
          title: "提示",
          desc: "录音失败，请重新点击开始录音"
        });
        return;
      }
      let blob = this.Recorders.getWAVBlob();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }; //添加请求头
      let formData = new FormData();
      formData.append("client", "web");
      formData.append("file[]", blob, "chat" + Date.parse(new Date()) + ".m4a");
      formData.append("use_type", 3);
      formData.append("file_type", "mp3");
      this.$post("/base/common/imageUp", formData).then(response => {
        if (response.code == 1) {
          let url = response.data[0];
          this.$post(
            "/admin/chat/sendVoice",
            {
              voice: url,
              target_id: this.currentUser.uid,
              from_name: this.userInfo.name,
              voice_time: this.duration
            },
            config
          ).then(response => {
            if (response.code == 1) {
              this.$Message.success("发送成功!");
              this.duration = 0;
            } else {
              this.$Message.error("发送失败! ");
              this.duration = 0;
            }
          });
        } else {
          this.duration = 0;
        }
      });
    },
    closex() {
      this.$emit("closeChat", true);
    },
    toVoice() {
      this.creatReoverds();
      this.disVoice = !this.disVoice;
    },
    sendContent() {
      if (this.send_content == "") {
        // 输入的内容为空
        this.$Message.error("对方不想说话，并且向你抛出了一个异常");
        return;
      }
      let name = this.userInfo.name;
      this.$post("/admin/chat/sendText", {
        target_id: this.currentUser.uid,
        msg: this.send_content.replace(/[\n\r\t]/g, ""),
        from_name: name
      }).then(response => {
        if (response.code == 1) {
          this.send_content = "";
          var e = document.getElementById("chj_map_id");
          e.scrollTop = e.scrollHeight;
        }
      });
    }
  },
  watch: {
    "chatMsgLists.record": function(newval, oldval) {
      if (newval) {
        setTimeout(function() {
          var e = document.getElementById("chj_map_id");
          e.scrollTop = e.scrollHeight;
        }, 10);
      }
    }
  }
};
</script>
<style lang="less" scoped>
/*聊天室*/
.chj_map_chaRoom {
  position: fixed;
  width: 450px;
  height: 370px;
  background: #ffffff;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 9px;
  color: #000;
  z-index: 99999999999;
}

.chj_map_charheader {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #e7e7e7;
  line-height: 40px;
}

.chj_map_charheader span {
  margin-left: 10px;
}

.chj_map_charheader i {
  float: right;
  margin-right: 10px;
  font-weight: bold;
}

.chj_map_chalist {
  width: 100px;
  background: #e4e5e6;
  height: 100%;
  float: left;
  overflow-y: auto;
}

.chj_map_chalist li {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.chj_map_chalist li.addxuanzhe {
  background: #c7c6c5;
}

.chj_map_chalist img {
  width: 30px;
  vertical-align: middle;
}

.chj_map_text {
  display: inline-block;
  width: 77%;
  height: 100%;
}

.chj_map_charcontent {
  border-bottom: 1px solid #ececec;
  height: 200px;
  background: #f5f5f5;
  overflow-y: auto;
  padding: 10px 0px;
}

.chj_map_text > span > i {
  margin-left: 15px;
}

.chj_map_charsend {
  width: 80px;
  background: #dddddd;
  height: 20px;
  line-height: 20px;
  text-align: center;
  float: right;
}

.chj_map_chartext {
  padding: 5px;
  background: #ddd;
  border-radius: 5px;
  display: inline-block;
  text-align: left;
  line-height: 20px;
  max-width: 310px;
  vertical-align: middle;
}

.chj_map_charcontent li {
  margin-top: 10px;
}

.chj_map_charcontent img {
  border-radius: 50%;
  width: 0.3rem;
  height: 0.3rem;
  vertical-align: middle;
}

.liaotian > .chj_map_charname {
  float: right;
  margin-left: 5px;
}

.liaotian {
  text-align: right;
}

audio,
video {
  vertical-align: middle;
}
</style>