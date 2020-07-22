<template>
  <div class="right_contnet">
    <span @click="close" style="color:#fff;float:right;font-weight:bold;cursor:pointer;">X</span>
    <!-- 喊话窗口-->
    <div class="speak" v-show="speaKChat">
      <img src="../../../static/zhibo/clac.png" alt />
      <img src="../../../static/zhibo/wurenji.png" alt style="position: absolute;" />
      <!-- <img src="../../../static/zhibo/send.png" alt style="position: absolute;" v-show="speak_send" /> -->
      <div>
        <!-- <i-button
          v-if="!speak_send"
          @click="startMic"
          style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
        >点击喊话</i-button>-->
        <span style="color:#FFFFFF">
          已向
          <span style="color:yellow;">{{currentUser.name}}</span>提出喊话申请......
          <!-- <Icon
            style="font-size: 0.3rem;cursor: pointer;"
            type="ios-close"
            @click="speak_send = false"
          ></Icon>-->
        </span>
        <div style="text-align:center;margin-top:20px;">
          <i-button
            @click="stopMic"
            style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
          >点击挂断</i-button>
        </div>
      </div>
    </div>
    <div class="speak" v-show="toSpeaker">
      <img src="../../../static/zhibo/clac.png" alt />
      <img src="../../../static/zhibo/wurenji.png" alt style="position: absolute;top:2.55rem" />
      <img src="../../../static/zhibo/send.png" alt style="position: absolute;" />
      <div>
        <div style="text-align:center;margin-top:20px;">
          <i-button
            @click="startVoice"
            style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
          >点击录音</i-button>
          <i-button
            @click="stopMic"
            style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
          >点击挂断</i-button>
        </div>
      </div>
    </div>
    <!-- 录音窗口 -->
    <div class="speak" v-show="rec">
      <img src="../../../static/zhibo/clac.png" alt :class="{'play_keyframes':operindex==1}" />
      <img src="../../../static/zhibo/wurenji.png" alt style="position: absolute;" />
      <div class="recorde">
        <div>录音时间</div>
        <div style="text-align:center">{{duration+'s'}}</div>
      </div>
      <div>
        <!-- <i-button
          @click="startVoice"
          style="background:rgba(164,207,242,1);color:white;width:1rem;height:0.35rem;"
        >{{operation[operindex]}}</i-button>
        <i-button
          @click="cancelVoice"
          style="background:rgba(164,207,242,1);color:white;width:1rem;height:0.35rem;"
        >取消</i-button>-->
        <i-button
          @click="sendlVoice"
          style="background:rgba(164,207,242,1);color:white;margin-top:20px;"
        >发送</i-button>
      </div>
    </div>
  </div>
</template>
<script>
import Recorder from "js-audio-recorder";
export default {
  props: ["currentUser", "websock", "speakState"],
  data() {
    return {
      toSpeaker: false,
      speaKChat: true,
      speak_send: true,
      rec: false,
      operation: ["开始", "暂停", "继续"],
      operindex: 0,
      duration: 0,
      macroTimer: null,
      isMicAnswer: null,
      userInfo: {}
    };
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    this.creatReoverds(); // 创建录音对象
  },
  methods: {
    close() {
      this.$emit("closeSpeaker", true);
    },
    stopMic() {
      this.speaKChat = false;
      this.showRight = false;
      this.websock.send(
        JSON.stringify({
          dataType: 3,
          type: "speak_control",
          to_uid: this.uid,
          to_name: this.name,
          from_uid: this.userInfo.user_id,
          from_name: this.userInfo.name
        })
      );
    },
    creatReoverds() {
      this.Recorders = new Recorder({
        sampleBits: 16000, // 采样位数，范围8或16
        sampleRate: 44100, // 采样率，范围11025、16000、22050、24000、44100、48000
        numChannels: 1 // 声道，范围1或2
      });
    },
    startMic() {
      this.speak_send = true;
      let that = this;
      this.websock.send(
        JSON.stringify({
          dataType: 0,
          type: "speak_control",
          to_uid: this.currentUser.uid,
          to_name: this.currentUser.name,
          from_uid: this.userInfo.user_id,
          from_name: this.userInfo.name
        })
      );
      let duration = 0;
      clearInterval(this.macroTimer);
      this.macroTimer = setInterval(function() {
        duration++;
        if (duration >= 60 && !that.isMicAnswer) {
          that.$Message.warning("等待时间超过60s，自动关闭!");
          // that.speak_send = false;
          that.speaKChat = false;
          clearInterval(that.macroTimer);
          that.websock.send(
            JSON.stringify({
              dataType: 3,
              type: "speak_control",
              to_uid: that.uid,
              to_name: that.name,
              from_uid: that.userInfo.user_id,
              from_name: that.userInfo.name
            })
          );
        }
      }, 1000);
    },
    startVoice() {
      let that = this;
      this.toSpeaker = false;
      this.speaKChat = false;
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
          //that.srcChoose = false;
          if (this.operindex == 0) {
            this.Recorders == null ? this.creatReoverds() : this.Recorders;
            this.Recorders.start(); // 开始录音
            this.operindex = 1; // 切换到暂停
          } else if (this.operindex == 1) {
            this.Recorders.pause(); // 暂停录音
            this.operindex = 2;
          } else if (this.operindex == 2) {
            //继续录音
            this.Recorders.resume();
            this.operindex = 1;
          }
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
    cancelVoice() {
      //取消发送
      this.operindex = 0;
      if (this.Recorders) {
        this.Recorders = null;
      }
      this.duration = 0;
      this.showChat = true;
      this.rec = false;
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
      this.operindex = 0;
      this.Recorders.stop();
      let blob = this.Recorders.getWAVBlob();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }; //添加请求头
      let formData = new FormData();
      formData.append("target_id", this.uid);
      formData.append("target_type", 0);
      formData.append("speaker_time", this.duration);
      formData.append("from_name", this.userInfo.name);
      formData.append("speaker[]", blob, "r" + Date.parse(new Date()) + ".m4a");
      this.$post("/admin/Speaker/sendSpeaker", formData, config).then(
        response => {
          if (response.code == 1) {
            this.$Message.success("发送成功!");
            this.rec = false;
            this.toSpeaker = true;
            this.speaKChat = false;
            this.duration = 0;
          } else {
            this.$Message.error("发送失败! ");
            this.duration = 0;
          }
          this.isSuccess = false;
        }
      );
    }
  },
  watch: {
    speakState: {
      handler(newval, oldval) {
        if (newval == 1) {
          this.speaKChat = false;
          this.showRight = false;
        } else if (newval == 2) {
          this.speaKChat = false;
          this.toSpeaker = true;
          this.rec = false;
        } else if (newval == 3) {
          this.speak_send = false;
          this.speaKChat = false;
          this.showRight = false;
        } else if (newval == 4) {
          this.rec = true;
        }
        clearInterval(this.macroTimer);
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    // this.websock.close();
  }
};
</script>
<style lang="less" scoped>
.right_contnet {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(26, 26, 26, 1);
  opacity: 1;
  z-index: 9999999999;
  padding: 10px;
  .speak {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    img:nth-child(1) {
      width: 3.78rem;
      height: 3.79rem;
    }
    img:nth-child(2) {
      position: absolute;
      width: 2rem;
      height: 1.06rem;
    }
    img:nth-child(3) {
      width: 1.56rem;
      height: 0.61rem;
      top: 0.75rem;
    }
  }
}
</style>