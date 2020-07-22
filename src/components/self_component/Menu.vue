<template>
  <div>
    <div :class="['oprtion_menu',nomrimg?'oprtion_menu_empt':'']" ref="oprtion_menu">
      <img
        @click="changeImg(item,index)"
        v-for="(item,index) in Coprtion_menu "
        :key="index"
        :src="(item.defult_index == 2 && selectImg === index)?item.select:item.src"
        :alt="item.alt"
      >
      <div class="img_wapper" @click="changIcon">
        <img src="../../../static/zxhImg/management1@2x.png" alt>
        <img
          :class="['img_icon',!nomrimg?'rotat':'']"
          src="../../../static/zxhImg/management1@2x.png"
        >
        <img src="../../../static/zxhImg/management1@2x.png" alt>
        <img src="../../../static/zxhImg/management1@2x.png" alt>

        <!-- <img v-else class="norm_img" key="norm" src="../../../static/zxhImg/management3@2x.png" alt> -->
      </div>
    </div>
    <!-- <div class="oprtion_menu_emp,oprtion_menu">

    </div>-->
  </div>
</template>

<script>
export default {
  props: ["oprtion_menu"],
  data() {
    return {
      nomrimg: true,
      selectImg: 0
    };
  },
  computed: {
    Coprtion_menu(value) {
      let oprtion_menu_empt = [];
      return this.nomrimg ? oprtion_menu_empt : this.oprtion_menu;
    }
  },
  methods: {
    changIcon() {
      this.nomrimg = !this.nomrimg;
    },
    changeImg(item, index) {
      // 改变图标
      this.selectImg = index;
      item.defult_index = 2;
    }
  },
  mounted() {
    // console.log("计算数据", this.$refs.oprtion_menu);
  }
};
</script>

<style lang="less" scoped>
.img_wapper {
  position: relative;
  img {
    width: 0.27rem;
    height: 0.27rem;
  }
  img:nth-child(1) {
    position: absolute;
    top: -0.28rem;
    left: -0.24rem;
  }
  img:nth-child(2) {
    position: absolute;
    top: -0.28rem;
    right: -0.25rem;
  }
  img:nth-child(3) {
    position: absolute;
    top: -0.06rem;
    left: -0.24rem;
  }
  img:nth-child(4) {
    position: absolute;
    top: -0.06rem;
    right: -0.25rem;
  }

  .img_icon {
    transition: all 0.6s linear;
    position: absolute;
    top: -6px;
    right: -6px;
    transform: rotateZ(45deg);
  }
}

.oprtion_menu {
  transition: all 0.5s ease;
  position: absolute;
  width: 5.1rem;
  height: 0.80rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 50px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  right: 0.25rem;
  top: 0.19rem;
}
.oprtion_menu_empt {
  width: 0.8rem;
}

.rotat {
  transition: all 0.6s linear;
  transform: rotateZ(0deg) !important;
}

.slide-fade-enter-active {
  transition: all 1s ease;
  opacity: 0.5;
}
.slide-fade-leave-active {
  //transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  opacity: 0.5;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0.5;
}
</style>