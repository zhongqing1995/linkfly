<template>
  <!-- 超管一级工程 -->
  <div class="engineer commonStyle">
    <div class="content">
      <div class="header">
        <Breadcrumb style="display:inline-block;" class="titleName">
          <BreadcrumbItem>一级工程列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="search">
          <label for>项目名：</label>
          <Input
            size="small"
            v-model="projectName"
            placeholder="请输入项目名"
            style="width: 150px"
            clearable
          />
          <label for>区域：</label>
          <Cascader
            size="small"
            v-model="region"
            :data="regionArr"
            :load-data="loadData"
            @on-change="getRegion"
            change-on-select
            placeholder="请选择区域"
            style="width: 150px;display:inline-block"
          ></Cascader>
          <label for>日期：</label>
          <Date-picker
            size="small"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
            @on-change="dateTime=$event"
            style="width: 150px"
          ></Date-picker>
          <Button size="small" @click="search(1)" type="primary">查询</Button>
        </div>
      </div>
      <div class="table">
        <Table :loading="loading" :columns="columns" :data="tabData" height="540" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script src='./engineer.js'></script>
<style lang="less" scoped>
.engineer {
}
</style>
