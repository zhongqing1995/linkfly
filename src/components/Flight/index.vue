<template>
  <div class=" allManagement">
    <div class="all_content">
      <div class="wrapper">
        <div class="all_navBar" v-if="userType==0">
          <div @click="changeNav(index)" v-for="(item,index) in all_navBar" :key="index">
            <span :class="[index == navBar_active?'navBar_active':'']">{{item.name}}</span>
          </div>
        </div>
        <div v-else style="padding-top:10px;">

        </div>
      </div>
      <keep-alive>
        <component :is="defult_compoent"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import FlightWork from "./FlightWork";
import FlightType from "./FlightType";
export default {
  components: {
    FlightWork,
    FlightType
  },
  data() {
    return {
      defult_compoent: "FlightWork",
      navBar_active: 0, // 默认的索引值
      userType:'',
      all_navBar: [
        // 全局管理下的导航路径
       
        {
          name: "飞行作业",
          path: "FlightWork"
        },
         {
          name: "作业类型",
          path: "FlightType"
        },
      ]
    };
  },
  mounted() {
    this.userType = sessionStorage.getItem('userType');
  },
  methods: {
    changeNav(index) {
      index == 0
        ? (this.defult_compoent = "FlightWork")
        : (this.defult_compoent = "FlightType");
      this.navBar_active = index;
      console.log(this.defult_compoent)
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
  width: 3rem;
  display: inline-flex;
  align-items: center;
  div {
    margin-right: 0.1rem;
    cursor: pointer;
  }
  div span {
    display: block;
    width: 1.2rem;
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
  width: 1.2rem;
  height: 0.4rem;
  font-size: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 1);
  color: white;
  opacity: 1;
  border-radius: 1000px;
}
</style>