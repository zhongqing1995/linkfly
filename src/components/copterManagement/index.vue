<template>
  <div id="CopterManagement" class="allManagement">
    <div class="all_content">
      <!--<div class="wrapper">-->
        <!--<div class="all_navBar">-->
          <!--<router-link-->
            <!--@click.native="changeNav(index)"-->
            <!--v-for="(item,index) in all_navBar"-->
            <!--:key="index"-->
            <!--:to="item.path"-->
          <!--&gt;-->
            <!--<span :class="[index == navBar_active?'navBar_active':'']">{{item.name}}</span>-->
          <!--</router-link>-->
        <!--</div>-->
      <!--</div>-->

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import copterList from "./copterList";
  export default {
    components: {
      copterList,
    },
    data() {
      return {
        defult_compoent: "copterList",
        navBar_active: 0, // 默认的索引值
        all_navBar: [
          // 全局管理下的导航路径
          {
            name: "直升机列表",
            path: "copterList"
          }
        ]
      };
    },
    mounted() {},
    methods: {
      changeNav(index) {
        switch (index) {
          case 0:
            this.defult_compoent = "copterList";
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
