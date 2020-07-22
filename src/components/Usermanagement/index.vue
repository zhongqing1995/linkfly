<template>
  <div class="commonStyle">
    <div class="box">
      <div class="header">
        <div class="header_left">
          普通用户列表&emsp;&emsp;
          <span>{{all_num}}/{{bind_num}}</span>
        </div>
        <div class="header-right">
          <ul>
            <li v-if="tabActive!='name1'&&tabActive!='name4'">
              <label>用户名</label>
              <Input
                size="small"
                v-model="look_name"
                placeholder="请输入用户名"
                style="width: 130px"
                clearable
              ></Input>
            </li>
            <li v-if="tabActive=='name1'">
              <label>工程名称</label>
              <Input
                size="small"
                v-model="pm_name"
                placeholder="请输入工程名称"
                style="width: 130px"
                clearable
              ></Input>
            </li>
            <li v-if="tabActive=='name1'">
              <label>团队名称</label>
              <Input
                size="small"
                v-model="team_name"
                placeholder="请输入团队"
                style="width: 130px"
                clearable
              ></Input>
            </li>
            <li v-if="tabActive=='name1'">
              <label>团队成员</label>
              <Input
                size="small"
                v-model="user_name"
                placeholder="请输入团队成员"
                style="width: 130px"
                clearable
              ></Input>
            </li>
            <li>
              <Button v-if="tabActive!='name4'" size="small" @click="initChage()" type="primary">查询</Button>
            </li>
            <li
              class="header_add_righ"
              v-if="(tabActive=='name2'||tabActive=='name3')&&userType==1"
            >
              <Button size="small" @click="openDialog" type="success">新增用户</Button>
            </li>
            <li class="header_add_righ" v-if="tabActive=='name1'&&userType==1">
              <Button size="small" @click="openTeamDialog" type="success">新增团队</Button>
            </li>
            <li class="header_add_righ" v-if="tabActive=='name4'&&userType==1">
              <Button size="small" @click="openSpeacialDialog" type="success">新增特殊工程管理员</Button>
            </li>
          </ul>
        </div>
      </div>
      <Tabs v-model="tabActive" style="width:100%" @on-click="tabClick">
        <TabPane label="团队列表" name="name1">
          <Table :loading="loading" :columns="columns" :data="datas" height="500" size="small"></Table>
          <div class="foot">
            <Page show-elevator show-total :total="total" @on-change="changePage"></Page>
          </div>
        </TabPane>
        <TabPane label="APP飞手" name="name2">
          <Table
            :loading="loading"
            :columns="columns1"
            :data="datas"
            ellipsis
            height="500"
            size="small"
          ></Table>
          <div class="foot">
            <Page show-elevator show-total :total="total" @on-change="changePage"></Page>
          </div>
        </TabPane>
        <TabPane label="小程序用户" name="name3">
          <Table
            :loading="loading"
            :columns="columns1"
            :data="datas"
            ellipsis
            height="500"
            size="small"
          ></Table>
          <div class="foot">
            <Page show-elevator show-total :total="total" @on-change="changePage"></Page>
          </div>
        </TabPane>
        <TabPane label="特殊工程管理员列表" name="name4">
          <Table
            :loading="loading"
            :columns="columns2"
            :data="datas"
            ellipsis
            height="500"
            size="small"
          ></Table>
          <div class="foot">
            <Page show-elevator show-total :total="total" @on-change="changePage"></Page>
          </div>
        </TabPane>
      </Tabs>
      <!-- 新增/修改框 -->
      <Modal
        v-model="dialogForm"
        :title="title"
        width="678px"
        @on-cancel="countermand('formValidate')"
      >
        <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <div class="add_text">
            <form-item label="用户名" prop="name" style="width: 50%;display: inline-block;">
              <Input type="text" v-model="formValidate.name" clearable></Input>
            </form-item>
            <form-item
              label="工程名称"
              :prop="ispm?'pm_id':'pm_name'"
              style="width: 49%;display: inline-block;"
              v-if="tabActive=='name1'"
            >
              <Select
                v-model="formValidate.pm_id"
                clearable
                filterable
                v-if="ispm"
                @on-change="pmChange"
              >
                <Option
                  v-for="item in pmList"
                  :value="item.pm_id"
                  :key="item.pm_id"
                >{{ item.pm_name }}</Option>
              </Select>
              <Input v-else type="text" v-model="formValidate.pm_name" disabled></Input>
            </form-item>
            <form-item
              label="工程名称"
              :prop="ispm?'pm_id':'pm_name'"
              style="width: 49%;display: inline-block;"
              v-else
            >
              <Select
                v-model="formValidate.pm_id"
                filterable
                remote
                multiple
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="请输入字符进行模糊查询"
                clearable
              >
                <Option
                  v-for="(item,index) in pmList"
                  :value="item.pm_id"
                  :key="index"
                >{{ item.pm_name }}</Option>
              </Select>
            </form-item>
            <form-item label="平台权限" prop="type" style="width: 50%;display: inline-block;">
              <Select v-model="formValidate.type" disabled>
                <Option
                  v-for="item in this.cityList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </form-item>
            <form-item label="体验时间" style="width: 49%;display: inline-block;">
              <Date-picker
                v-model="formValidate.experience_time"
                format="yyyy-MM-dd"
                type="date"
                style="width: 100%"
                placeholder="请选择日期"
                :disabled="tabActive=='name1'?false:true"
                @on-change="formValidate.experience_time=$event"
                clearable
              ></Date-picker>
            </form-item>
            <form-item label="用户账号" prop="account" style="width: 50%;display: inline-block;">
              <Input
                type="text"
                v-model="formValidate.account"
                clearable
                autocomplete="new-password"
              ></Input>
            </form-item>
            <form-item label="用户密码" prop="password" style="width: 49%;display: inline-block;">
              <Input
                type="password"
                v-model="formValidate.password"
                clearable
                autocomplete="new-password"
              ></Input>
            </form-item>
            <form-item label="功能权限" prop="permission" style="width: 50%;display: inline-block;">
              <Select
                v-model="formValidate.permission"
                multiple
                style="width:234px"
                clearable
                :disabled="tabActive=='name1'?false:true"
              >
                <Option value="1" key="1">直播</Option>
                <Option value="2" key="2">巡检</Option>
                <Option value="3" key="3">作业</Option>
              </Select>
            </form-item>
            <form-item label="公司名称" style="width: 49%;display: inline-block;">
              <Input type="text" v-model="formValidate.company_name" disabled></Input>
            </form-item>
            <form-item label="公司logo" style="width: 50%;display: inline-block;">
              <img style="width:50px;" :src="logo" alt />
            </form-item>
            <form-item label="用户头像" prop="head_icon" style="width: 49%;display: inline-block;">
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
                :before-upload="(file)=>uploadBefore(file,title)"
                action
                type="drag"
                style="display: inline-block;width:58px;vertical-align:top;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </form-item>
          </div>
        </i-form>
        <div slot="footer">
          <i-button type="primary" @click="handleSubmit('formValidate',ispm)">确定</i-button>
        </div>
      </Modal>
      <!-- 团队新增/修改框 -->
      <Modal
        v-model="dialogTeam"
        :title="teamTitle"
        width="678px"
        @on-cancel="countermandTeam('teamForm')"
      >
        <i-form ref="teamForm" :model="teamForm" :rules="teamRule" :label-width="100">
          <div class="add_text">
            <form-item label="团队名称" prop="team_name" style="width: 50%;display: inline-block;">
              <Input type="text" v-model="teamForm.team_name" clearable></Input>
            </form-item>
            <form-item label="所属二级工程" prop="second_pm_id" style="width: 49%;display: inline-block;">
              <Select v-model="teamForm.second_pm_id" clearable @on-change="selectUser">
                <Option
                  v-for="item in secondLists"
                  :value="item.pm_id"
                  :key="item.pm_id"
                >{{ item.pm_name }}</Option>
              </Select>
            </form-item>
            <form-item label="团队成员" prop="team" style="width: 50%;display: inline-block;">
              <Input
                type="text"
                v-model.number="teamForm.user_id"
                :readonly="true"
                @on-focus="chooseUser"
              >
                <img
                  src="/static/publicimg/bangding.png"
                  style="margin-top: 4px;"
                  slot="suffix"
                  alt
                  srcset
                />
              </Input>
            </form-item>
            <form-item label="备注" prop="comment" style="width: 49%;display: inline-block;">
              <Input type="text" v-model="teamForm.comment"></Input>
            </form-item>
          </div>
        </i-form>
        <div slot="footer">
          <i-button type="primary" @click="handleTeamSubmit('teamForm')">确定</i-button>
        </div>
      </Modal>
      <!-- 特殊工程管理员 -->
      <Modal
        v-model="dialogSpeacialUser"
        :title="speacialUserTitle"
        width="678px"
        @on-cancel="countermandSpeacailUser('speacialUserForm')"
      >
        <i-form
          ref="speacialUserForm"
          :model="speacialUserForm"
          :rules="speacialUserRule"
          :label-width="100"
        >
          <div class="add_text">
            <form-item label="用户名称" prop="name" style="width: 50%;display: inline-block;">
              <Input type="text" v-model="speacialUserForm.name" clearable></Input>
            </form-item>
            <form-item label="账号" prop="account" style="width: 49%;display: inline-block;">
              <Input type="text" autocomplete="new-password" v-model="speacialUserForm.account"></Input>
            </form-item>
            <form-item label="密码" prop="password" style="width: 50%;display: inline-block;">
              <Input type="password" autocomplete="new-password" v-model="speacialUserForm.password" clearable></Input>
            </form-item>
            <form-item label="用户头像" prop="head_icon" style="width: 49%;display: inline-block;">
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
                :before-upload="(file)=>uploadBefore(file,title)"
                action
                type="drag"
                style="display: inline-block;width:58px;vertical-align:top;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </form-item>
          </div>
        </i-form>
        <div slot="footer">
          <i-button type="primary" @click="handleSpeacialUserSubmit('speacialUserForm')">确定</i-button>
        </div>
      </Modal>
      <Modal v-model="userDialog" title="用户选择" width="760" @on-ok="chooseUserOk">
        <div class="add_text">
          <ul class="user">
            <CheckboxGroup v-model="userIds">
              <li v-for="(item,index) in userLists" :key="index">
                <Checkbox :label="item.user_id">{{item.name}}</Checkbox>
              </li>
            </CheckboxGroup>
          </ul>
          <div style="clear:both;"></div>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script src='./other.js'></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
@import "../../../font/iconfont.css";
.box {
  margin: 0 0.52rem;
  background: rgba(254, 254, 255, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 20px;
  padding: 0 0.52rem;
}

ul {
  list-style-type: none;
}
a {
  text-decoration: none;
}
.header {
  line-height: 64px;
  height: 64px;
}
.header > h2 {
  position: relative;
  display: inline-block;
  font-size: 24px;
}
.header > .header-right {
  float: right;
}
.header_left {
  display: inline-block;
  font-size: 0.3rem;
  color: #151314;
  font-family: PingFang SC;
  font-weight: 500;
}
.header-right > ul > li {
  display: inline-block;
  margin-right: 10px;
}
.header-right > ul > li a {
  display: inline-block;
  width: 50px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  background: #23a5f6;
  color: #fff;
  border-radius: 5px;
}
.header-right > ul > li.header_add_righ > div {
  display: inline-block;
  width: 90px;
  height: 35px;
  background: #23a5f6;
  text-align: center;
  color: #fff;
  line-height: 35px;
  border: 1px solid #1e8cde;
  border-radius: 5px;
}
.header-right > ul > li.header_add_righ {
  margin-right: 0;
}
.header-right > ul > li input {
  display: inline-block;
  width: 100px;
  height: 35px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
.header-right > ul > li select {
  height: 35px;
  width: 80px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
.header-right > ul > li span {
  margin-right: 10px;
  font-size: 14px;
  color: #666;
}

.foot {
  width: 100%;
  height: 50px;
  margin-top: 10px;
  text-align: center;
}

.project li {
  display: inline-block;
  margin-left: 10px;
  width: 23%;
}

.remove_delete {
  letter-spacing: 2px;
  margin-left: 60px;
  font-size: 16px;
  padding-right: 5px;
}
.remove_text > i {
  float: left;
  margin-left: 20px;
  font-size: 30px;
  color: #af1c09;
}

.ivu-form-item /deep/ .ivu-upload span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.add_text {
  .user li {
    float: left;
    line-height: 30px;
    margin-right: 10px;
  }
}
</style>
