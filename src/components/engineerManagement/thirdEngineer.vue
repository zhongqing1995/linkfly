<template>
  <div class="commonStyle">
    <div class="content">
      <div class="header">
        <Breadcrumb class="titleName" style="display:inline-block;" v-if="userType==0">
          <BreadcrumbItem to="/index/engineerManagement">工程管理</BreadcrumbItem>
          <BreadcrumbItem to="/index/secondEngineerManagement">{{rowData.pm_name}}</BreadcrumbItem>
          <BreadcrumbItem>{{threeData.pm_name}}</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb class="titleName" style="display:inline-block;" v-if="userType==1">
          <BreadcrumbItem>工程管理</BreadcrumbItem>
          <BreadcrumbItem to="/index/gcEngineerManagement">{{secondName}}</BreadcrumbItem>
          <BreadcrumbItem>{{threeData.pm_name}}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Tabs size="small" style="margin-top:10px;">
        <TabPane name="0" label="空中图片">
          <AerialImages></AerialImages>
        </TabPane>
        <TabPane name="1" label="地面数据">
          <floor></floor>
        </TabPane>
        <TabPane label="空中视频">
          <AerialVideo></AerialVideo>
        </TabPane>
        <TabPane label="全景图">
          <quanjing></quanjing>
        </TabPane>
        <TabPane label="正射">
          <zhengshe></zhengshe>
        </TabPane>
        <TabPane label="标注">
          <labels></labels>
        </TabPane>
        <TabPane label="KML">
          <KML></KML>
        </TabPane>
        <TabPane label="三维">
          <tiles3D></tiles3D>
        </TabPane>
        <!-- <TabPane label="直升机">
          <zhishengji></zhishengji>
        </TabPane> -->
      </Tabs>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      userType: "",
      secondName: ""
    };
  },
  computed: {
    ...mapState(["threeData", "rowData"])
  },
  components: {
    AerialImages: resolve => {
      require(["./thirdComponent/AerialImages.vue"], resolve);
    },
    floor: resolve => {
      require(["./thirdComponent/floor.vue"], resolve);
    },
    AerialVideo: resolve => {
      require(["./thirdComponent/Aerial_video.vue"], resolve);
    },
    panoramas: resolve => {
      require(["./thirdComponent/panoramas.vue"], resolve);
    },
    labels: resolve => {
      require(["./thirdComponent/label.vue"], resolve);
    },
    quanjing: resolve => {
      require(["./thirdComponent/quanjingLists.vue"], resolve);
    },
    zhengshe: resolve => {
      require(["./thirdComponent/zhengsheLists.vue"], resolve);
    },
    zhishengji: resolve => {
      require(["./thirdComponent/zhishengji.vue"], resolve);
    },
    KML: resolve => {
      require(["./thirdComponent/KML.vue"], resolve);
    },
    tiles3D: resolve => {
      require(["./thirdComponent/tiles3D.vue"], resolve);
    },
  },
  mounted() {
    this.userType = sessionStorage.getItem("userType");
    this.secondName = JSON.parse(sessionStorage.getItem("user_info")).pm_name;
  }
};
</script>
<style lang="less" scoped>
</style>
