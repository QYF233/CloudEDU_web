<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @tab-click="handleClick">
    <div class="title">
      <a href="index">云教</a>
    </div>
    <el-menu-item index="1">
      <router-link to="/index">首页</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link to="/player">公开课</router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link to="/publish">选修课</router-link>
    </el-menu-item>

    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/profile/index">
          <el-dropdown-item>
            {{ $t('navbar.profile') }}
          </el-dropdown-item>
        </router-link>
        <router-link to="/">
          <el-dropdown-item>
            {{ $t('navbar.dashboard') }}
          </el-dropdown-item>
        </router-link>
        <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
          <el-dropdown-item>
            {{ $t('navbar.github') }}
          </el-dropdown-item>
        </a>
        <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
          <el-dropdown-item>Docs</el-dropdown-item>
        </a>
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">{{ $t('navbar.logOut') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input
      v-model="searchVal"
      placeholder="职位 | 地区 | 工作年限"
      @keyup.enter.native="onSearch"
    >
      <i slot="prefix" class="el-input__icon el-icon-search" />
    </el-input>

  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '@/api/user'

export default {
  components: {},
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      activeIndex: '1',
      searchVal: ''
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.index)
      // this.activeIndex = tab.index
    },
    onSearch() {
      this.$router.push({
        path: '/search',
        query: {
          searchVal: this.searchVal
        }
      })
    },
    logout() {
      logout().then(res => {
        this.$message.success('退出成功')
        this.$router.push({
          path: '/login'
        })
      }).catch(e => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  float: left;
  font-size: 32px;
  font-weight: 400;
  margin-right: 40px;
  height: 60px;
  line-height: 60px;

  a {
    text-decoration: none;
    display: block;
  }
}

.el-input {
  float: right;
  display: inline-block;
  width: 210px;
  height: 60px;
  line-height: 60px;
  margin: 0 20px;
}

.avatar-container {
  float: right;
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>
