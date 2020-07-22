<template>
  <div class="measureStyle">
    <RadioGroup v-model="measure" type="button" @on-change="changeMeasure">
      <Radio label="距离测量"></Radio>
      <Radio label="面积测量"></Radio>
      <Radio label="关闭测量"></Radio>
    </RadioGroup>
  </div>
</template>
<script>
export default {
    data(){
        return {
            measure:"距离测量",
        }
    },
    methods:{
        changeMeasure(val) {
            this.$emit('measureChange',val);
        }
    }
}
</script>
<style lang="less" scoped>
.measureStyle {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
</style>