<template>
 <div class="box">
    <div class="photo"  >
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in ph" :key="index">
                    <img :src="item">
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </div>
 </div>
</template>

<script>
    import Swiper from 'swiper'
    export default {
        props:['ph'],
        data () {
            return {
            }
        },
        mounted:function () {
            var swiper = new Swiper('.swiper-container', {
                paginationClickable: true,
                loop: true,
                speed: 600,
                autoplay: 1000,
                onTouchEnd: function() {
                    swiper.startAutoplay()
                },
            });
        },
        methods:{
            cancel:function () {
                this.$emit('refreshList');
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "../../../../font/iconfont.css";
    .swiper-container{
        width: 600px;
        height: 460px;
    }
    img{
        width:100%;
        height: 100%;
        margin: auto;
    }



    .icon-x{
        color: #fff;
        position: absolute;
        z-index: 100000;
        font-size: 30px;
        right: -46px;
        top: -24px;
    }
    /*.swiper-slide{*/
        /*width: 400px;*/
        /*height: 300px;*/
    /*}*/
</style>
