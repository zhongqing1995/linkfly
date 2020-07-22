<template>
  <!-- 超管一级工程 -->
  <div class="engineer commonStyle">
    <div class="content">
      <div class="header">
        <Breadcrumb style="display:inline-block;" class="titleName">
          <BreadcrumbItem @click="search(1)">工程项目管理</BreadcrumbItem>
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
          <Button size="small" @click="clickPro" type="success">新建项目</Button>
        </div>
      </div>
      <div class="table">
        <Table :loading="loading" :columns="columns" :data="tabData" height="540" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="dialogShowMap" title="查看位置" width="600">
      <LookMap v-if="dialogShowMap" :map_point="map_point" :map_type="map_type"></LookMap>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑新增 -->
    <Modal
      v-model="modal"
      :title="title"
      width="600"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="工程名称" prop="pm_name">
              <Input type="text" placeholder="请输入工程名称" v-model="formInline.pm_name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem class="editRegion" label="区域" prop="region">
              <Cascader
                v-if="isLocation"
                placeholder="请选择区域"
                v-model="formInline.region"
                :data="regionArr"
                :load-data="loadData"
                @on-change="getRegion"
                change-on-select
              ></Cascader>

              <!--<FormOrganization-->
              <!--v-if="isLocation"-->
              <!--:organization="regionMsg"-->
              <!--v-model="formInline.region"-->
              <!--&gt;</FormOrganization>-->
              <Input
                v-else
                type="text"
                @on-focus="isLocation=true"
                v-model="formInline.regionName"
                clearable
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="成立时间" prop="start_time">
              <Date-picker
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择成立时间"
                style="width:184px;"
                @on-change="formInline.start_time=$event"
                v-model="formInline.start_time"
              ></Date-picker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="位置" prop="location">
              <!-- {{formInline.locationArr}} -->
              <Input type="text" @on-focus="mapshow=true" v-model="formInline.location" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="可新建用户数" prop="bind_num">
              <Input placeholder="请输入可新建用户数" type="text" v-model="formInline.bind_num" clearable></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="公司名称" prop="company_name">
              <Input placeholder="请输入公司名称" type="text" v-model="formInline.company_name" clearable></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注">
              <Input placeholder="请输入备注" type="text" v-model="formInline.comment" clearable></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="公司logo" prop="loge_image_path">
              <!-- <Input
                placeholder="请上传公司logo"
                type="text"
                v-model="formInline.loge_image_path"
                @on-focus="uploadPic=true"
                clearable
              ></Input>-->
              <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                <template>
                  <img :src="item" />
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                  </div>
                </template>
              </div>
              <Upload
                v-if="uploadList.length<1"
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :before-upload="uploadBefore"
                action
                type="drag"
                style="display: inline-block;width:58px;vertical-align:top;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('formInline')">取消</Button>
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
    <Modal v-model="mapshow" title="位置选择" width="600">
      <div class="map" v-if="mapshow">
        <ChooseMap @refreshList="siteSelection"></ChooseMap>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="uploadPic" title="上传图片" width="400">
      <template>
        <div style="text-align:center;" v-if="Boolean(pic)">
          <img style="max-width:200px;" :src="pic" alt srcset />
        </div>
        <Upload type="drag" v-else :before-upload="uploadBefore" action>
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>
              请点击上传PDF、JPG、PNG、DOC
              <br />在xxM以内，100*100尺寸的图片
            </p>
          </div>
        </Upload>
      </template>
      <div slot="footer">
        <Button @click="cancelPic" type="error">删除图片</Button>
        <Button @click="subPic" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script src='./index.js'></script>
<style lang="less" scoped>
.engineer {
}
</style>
