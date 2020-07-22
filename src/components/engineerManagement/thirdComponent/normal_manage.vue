<template>
    <div style="height: 100%;">
        <div  style="height: 100%;">
            <div id="container_nor" class="mymap"></div>
        </div>
        <Modal v-model="uploading" title="上传"   width="350px" >
            <ul class="uploading">
                 <li><span>项目名称</span><input type="text" /></li>
                <li>
                    <span>所属工程</span>
                    <select style="width: 33%">
                            <option></option>
                    </select>
                    <select  style="width: 33%">
                        <option></option>
                    </select>
                </li>
                <li>
                    <span>区域</span>
                    <select style="width: 20%">
                        <option></option>
                    </select>
                    <select style="width: 20%">
                        <option></option>
                    </select>
                    <select  style="width: 20%">
                        <option></option>
                    </select>
                </li>
                <Upload  style="width: 100%" action="//jsonplaceholder.typicode.com/posts/">
                    <Button style="width: 100%"  type="ghost" icon="ios-cloud-upload-outline" >上传</Button>
                </Upload>

            </ul>
        </Modal>
    </div>

</template>
<script>
    import axios from 'axios'
    export default {
        data:function () {
            return{
                disabledGroup:[],
                single: false,
                heating: '爪哇犀牛',
                uploading:false,//上传
                imageLayerArr:[],
            }n
        },
        methods: {
            loadmap(){
                var index=this;
                this.map = new AMap.Map('container_nor', {
                    resizeEnable: true,
                    center: [ 113.04277153862847,28.165057237413194,],//地图中心点
                    zoom: 13, //地图显示的缩放级别
                });
                this.map.on('mousewheel',function () {
                   index.$post('/uav/data/orthophotoquad',{
                    "zoom":index.map.getZoom(),
                  })
                    .then((response) => {
                      if(response.code=="s_ok"){
                        var all=response.var
                        for(var i=0;i<index.imageLayerArr.length;i++){
                          index.imageLayerArr[i].setMap(null);
                        }
                        index.imageLayerArr= [];
                        for(var i=0;i<all.length;i++) {
                          var a = new AMap.LngLat(Number(all[i].west), Number(all[i].south));
                          var b = new AMap.LngLat(Number(all[i].east), Number(all[i].north));
                          var bounds = new AMap.Bounds(a, b);
                          var imageLayer = new AMap.ImageLayer({
                            url: all[i].imagePath,
                            bounds: bounds,
                            zoom: index.map.getZoom()
                          });
                          index.imageLayerArr.push(imageLayer);
                          imageLayer.setMap(index.map)
                        }
                      }else if(response.code=="error"){

                      }
                    })



                })
                AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {

                    //图层切换控件
                    index.map.addControl(new BasicControl.LayerSwitcher({
                        position: 'rt'
                    }));
                });

                var autoOptions = {
                    input: "tipinput"
                };
                var auto= new AMap.Autocomplete(autoOptions);
                var placeSearch = new AMap.PlaceSearch({
                    map:this.map
                });
                AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
                function select(e) {
                    placeSearch.setCity(e.poi.adcode);
                    placeSearch.search(e.poi.name);  //关键字查询查询
                }
                //    贴图



            },
        },
        components:{
        },
        mounted(){
            this.loadmap();     //加载地图和相关组件
        },
        created:function () {
            
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "../../../font/iconfont.css";
   #container_nor{
       width: 100%;
       height: 100%;
   }
    .normal_box{
        height: 100%;
        padding-left: 64px;
        padding-right: 64px;
    }
    .map_header_left{
        position: absolute;
        z-index: 1000;
        top: 14px;
        left:500px;
        height: 35px;
        background: #f2f2f2;
        line-height: 35px;
        margin-left: 100px;
        border-radius: 20px;
    }
    .map_header_left>i{
        padding-left: 10px;
        padding-right: 10px;
    }
    .map_header_left input{
        width: 200px;
        height: 30px;
        background: #f2f2f2;
        border-radius: 0px 20px 20px 0px;
        border: 0;
    }
     .list{
         position: absolute;
         z-index: 10;
         left: 290px;
         top: 74px;
     }
    .list ul.master li{
        display: inline-block;
        text-align: center;
        margin-left: 10px;
    }
    .list ul li a{
        display: inline-block;
        width: 50px;
        height: 50px;
        background: rgba(0,0,0,0.8);
        color: #ffffff;
        border-radius: 5px;
    }
    .list ul li a i{
        display:block;

    }
    .priject_list{
        background: rgba(0,0,0,0.8);
        width: 200px;
        border-radius: 5px;
        margin-left: 10px;
        margin-top: 10px;
        border: 1px solid transparent;
    }
    .priject_list li.header{
         border-bottom: 1px solid rgba(255,255,255,0.4);
         text-align: right;
        line-height: 100%;
     }
    .priject_list li{
        color: #ffffff;
        margin: 5px;
    }
    .heating{
        background: rgba(0,0,0,0.8);
        width: 200px;
        border-radius: 5px;
        margin-left: 10px;
        margin-top: 10px;
        border: 1px solid transparent;
    }
    select{
        outline: none
    }
    .heating li{
        color: #ffffff;
        margin: 5px;
        line-height: 100%;

    }
    .heating li span{
        width: 10px;
        height: 10px;
        display: inline-block;
    }
    .uploading li{
        height: 40px;
        line-height: 40px;
        border: 1px solid #ddd;
        margin-bottom: 10px;
    }
    .uploading li span{
        display: inline-block;
        background: #eee;
        font-size: 14px;
        height: 38px;
        width: 75px;
        text-align: center;
        border-radius: 2px;
    }
    .uploading li input{
        height: 33px;
        width: 76%;
        outline: none;
        border: 1px solid transparent;

    }
    .uploading li select{
        height: 30px;
        border: 1px solid transparent;
        outline: none;
    }
    .ivu-upload .ivu-upload-select{
         width: 100%;
     }
    /*头部*/
    .normal_box .header{
        line-height: 84px;
        height: 84px;
    }
    .header>h2{
        position: relative;
        display: inline-block;
        font-size: 24px;

    }
    .header_left{
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
    }
    .header>.header-right{
        font-size: 16px;
        float: right;
    }
    .header>.header-right>select{
        width: 80px;
        height: 35px;

        border: 1px solid #e5e5e5;

        border-radius: 5px;
    }
    .header>.header-right>input{
        height: 35px;
        width: 100px;
        margin-left: 15px;
        margin-right: 15px;
        border: 1px solid #e5e5e5;
    }
    .header>.header-right>div.buttom{
        display: inline-block;
        width: 80px;
        height: 35px;
        background: #23a5f6;
        text-align: center;
        color: #fff;
        font-size: 14px;
        border-radius: 5px;
        line-height: 35px;
    }
    .header>.header-right>div.out{
        width:50px ;
        height: 35px;
        background: transparent;
        color: #23a5f6;
        border:1px solid #23a5f6;
        margin-left: 20px;
        margin-right: 30px;
    }
    .header>.header-right>div.inquire{
        background: #23a5f6;
        color: #fff;
    }
    .header>.header-right>span{
        color: #666;
        margin-right: 10px;
        font-size: 16px;
    }
    /*图片*/
    .box_list li{
        width: calc(100%/5 - 15px);
        min-width: 200px;
        /*max-width: 250px;*/
        float: left;
        margin-right: 15px;
        margin-bottom: 15px;
    }
    .box_list li img{
        width: 100%;
        height: auto;
    }
    .box_list .adder{
        width: calc(100% - 25px);
        display: inline-block;
    }
</style>
