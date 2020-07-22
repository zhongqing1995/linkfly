<template>
  <div>
    <div
      style="display: inline-block;  width: 50%;height: 500px;"
      @mousemove="change()"
      @mousewheel="changezoom()"
    >
      <div id="a" class="pano"></div>
    </div>
    <div style=" display: inline-block;  width: 49%; height: 500px;">
      <div @mousemove="change()" id="b" class="pano"></div>
    </div>
  </div>
</template>
<script>
import PhotoSphereViewer from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
export default {
  data() {
    return {
      PSV: null,
      PSVTWO: null
    };
  },
  methods: {
    panorama: function() {
      var div = document.getElementById("a");
      this.PSV = new PhotoSphereViewer({
        panorama: "../../../static/img/2.jpg",
        container: div,
        time_anim: false,
        markers: [
          {
            // 当单击时打开面板的图像标记
            id: "image",
            longitude: 5.6981,
            latitude: -0.1377,
            image: "../../../static/img/icon.png",
            width: 32,
            height: 32,
            anchor: "bottom center",
            tooltip: "这个是我的地盘",
            content: document.getElementById("a").innerHTML
          }
        ],
        navbar: [
          "autorotate",
          "zoom",
          "markers",
          {
            id: "my-button",
            title: "Hello world",
            className: "custom-button",
            content: "Custom",
            onClick: function() {
              alert("Hello from custom button");
            }
          },
          "caption",
          "fullscreen"
        ],
        size: {
          width: "100%",
          height: 500
        }
      });
    },
    panoramatwo: function() {
      var div = document.getElementById("b");
      this.PSVTWO = new PhotoSphereViewer({
        panorama: "../../../static/img/1.jpg",
        container: div,
        time_anim: false,
        navbar: ["autorotate", "zoom", "markers", "caption", "fullscreen"],
        size: {
          width: "100%",
          height: 500
        }
      });
    },
    change: function() {
      this.PSVTWO.rotate(
        this.PSV.sphericalCoordsToTextureCoords(this.PSV.getPosition())
      );
    }
  },
  mounted() {
    this.panorama();
    this.panoramatwo();
    var then = this;
    this.PSV.on("zoom-updated", function() {
      then.PSVTWO.zoom(then.PSV.getZoomLevel());
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
