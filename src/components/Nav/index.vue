<template>
  <el-menu :default-active="$route.path" class="navbar" mode="horizontal" router>
    <div class="title">
      <!--      <a href="index">云教</a>-->
      <el-image
        :src="logo"
        fit="cover"
        class="logo"
      ></el-image>
    </div>
    <el-menu-item index="/index">
      首页
    </el-menu-item>
    <el-menu-item index="/public-room">
      公开课
    </el-menu-item>
    <el-menu-item index="/find-room">
      <div v-permission="['student']">已加入的教室</div>
      <div v-permission="['teacher']">已创建的教室</div>
      <div v-permission="['admin']">所有教室</div>
    </el-menu-item>
    <el-menu-item v-permission="['teacher','admin']" index="/publish">
      开始直播
    </el-menu-item>

    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
<!--        <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" class="user-avatar">-->
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/profile/index">
          <el-dropdown-item>
            {{ $t('navbar.profile') }}
          </el-dropdown-item>
        </router-link>
        <router-link to="/index">
          <el-dropdown-item>
            {{ $t('navbar.dashboard') }}
          </el-dropdown-item>
        </router-link>
        <router-link v-permission="['admin']" to="/admin">
          <el-dropdown-item>
            后台管理
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">{{ $t('navbar.logOut') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input
      v-model="searchVal"
      placeholder="课程名 | 教室名 | 班级名"
      @keyup.enter.native="onSearch"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"/>
    </el-input>

  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '@/api/user'
import permission from '@/directive/permission'
import store from '@/store'

export default {
  directives: { permission },
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
      logo: require('@/assets/images/cloudedu.png'),
      activeIndex: '/index',
      searchVal: ''
    }
  },
  created() {
    this.checkAvatar()
  },
  methods: {
    checkAvatar() {
      if (this.avatar == null) {
        this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      }
    },
    onSearch() {
      console.log('搜索', this.searchVal)
      this.$router.push({
        path: 'search',
        query: {
          searchVal: this.searchVal
        }
      })
    },

    async logout() {
      await this.$store.dispatch('user/logout')
      // await logout().then(res => {
      //   this.$message.success('退出成功')
      // }).catch(e => {
      // })
      await store.dispatch('roomInfo/setRoomInfo', {})
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  padding: 0 5%;
}

.logo {
  height: 60px;
  width: 100%;
}

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
