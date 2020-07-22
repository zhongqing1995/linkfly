<template>
  <div class="allManagement">
    <div class="all_content">
      <div class="wrapper">
        <div class="all_navBar">
          <!-- <div @click="changeNav(index)" v-for="(item,index) in all_navBar" :key="index">
            <span :class="[index == navBar_active?'navBar_active':'']">{{item.name}}</span>
          </div>-->
          <router-link
            @click.native="changeNav(index)"
            v-for="(item,index) in all_navBar"
            :key="index"
            :to="item.path"
          >
            <span :class="[index == navBar_active?'navBar_active':'']">{{item.name}}</span>
          </router-link>
        </div>
      </div>
      <!-- <keep-alive>
        <component :is="defult_compoent"></component>
      </!-->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import loanReturn from "./loanReturn";
import uavRegister from "./uavRegister";
import uavType from "./uavType";
export default {
  components: {
    loanReturn,
    uavRegister,
    uavType
  },
  data() {
    return {
      defult_compoent: "loanReturn",
      navBar_active: 0, // 默认的索引值
      all_navBar: [
        // 全局管理下的导航路径
        {
          name: "借出归还管理",
          path: "loanReturn"
        },
        {
          name: "无人机设备登记",
          path: "uavRegister"
        },
        {
          name: "无人机型号管理",
          path: "uavType"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    changeNav(index) {
      switch (index) {
        case 0:
          this.defult_compoent = "loanReturn";
          break;
        case 1:
          this.defult_compoent = "uavRegister";
          break;
        case 2:
          this.defult_compoent = "uavType";
          break;
      }
      this.navBar_active = index;
    }
  }
};
</script>

<style lang="less" scoped>
.all_content {
  position: relative;
  flex: 0.8;
  padding: 0px 0.52rem;
}

.all_navBar {
  height: 0.52rem;
  padding-left: 0.2rem;
  background: #000;
  opacity: 1;
  border-radius: 1000px;
  width: 5.8rem;
  display: inline-flex;
  align-items: center;
  a {
    margin-right: 0.1rem;
  }
  a span {
    display: block;
    width: 1.6rem;
    height: 0.4rem;
    line-height: 0.36rem;
    font-size: 0.2rem;
    font-family: PingFang SC;
    font-weight: 400;
    text-align: center;
    color: #acacac;
    opacity: 1;
    margin-right: 0.1rem;
    border: 1px solid #444;
    border-radius: 1000px;
  }
}

.all_navBar .navBar_active {
  width: 1.6rem;
  height: 0.4rem;
  font-size: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 1);
  color: white;
  opacity: 1;
  border-radius: 1000px;
}
</style>
