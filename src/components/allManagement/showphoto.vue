<template>
  <div style="height:100%;">
    <div id="photo"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
export default {
  name: "photo",
  computed: {
    ...mapState(["threePhoto"])
  },
  mounted() {
    let div = document.getElementById("photo");
    let PSV = new PhotoSphereViewer({
      panorama: this.threePhoto,
      // panorama: "/static/img/1.jpg",
      container: div,
      time_anim: false,
      navbar: ["autorotate", "zoom", "markers", "caption", "fullscreen"],
      size: {
        width: "100%",
        //ysq修改 原值500
        height: 600
      }
    });
    // console.log(this.photoName,999)
    // this.$_bus.$off("showPhoto");
    // this.$_bus.$on("showPhoto", val => {
    //   let div = document.getElementById("photo");
    //   console.log(div, 99);
    //   // let PSV = new PhotoSphereViewer({
    //   //   // panorama: val,
    //   //   panorama: "/static/img/1.jpg",
    //   //   container: div,
    //   //   time_anim: false,
    //   //   navbar: ["autorotate", "zoom", "markers", "caption", "fullscreen"],
    //   //   size: {
    //   //     width: "100%",
    //   //     height: 500
    //   //   }
    //   // });
    // });
  }
};
</script>
<style lang="less" scoped>
</style>
