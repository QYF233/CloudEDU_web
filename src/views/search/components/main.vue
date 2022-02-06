<template>
  <el-row :gutter="20">
    <el-col :span="15" :offset="3">
      <el-input
        v-model="searchVal"
        placeholder="请输入"
        @keyup.enter.native="onSearch"
      />
    </el-col>
    <el-col :span="3">
      <el-button type="primary">搜索</el-button>
    </el-col>

    <el-col :span="20" :offset="2" class="result">
      <el-row :gutter="20">
        <el-col v-for="n in 10" :span="6">
          <el-card :body-style="{ padding: '0px' }" class="room" @click.native="goRoom(n)">
            <el-image
              class="image"
              :src="url"
              fit="cover"
            />
            <div style="padding: 14px;">
              <span>房间{{ n }}号</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
export default {
  name: 'Main',
  data() {
    return {
      textarea: '',
      searchVal: '',
      url: 'https://router.vuejs.org/logo.png'
    }
  },
  watch: {
    '$route'(to, from) {
      this.getSearchVal()
    }
  },
  created() {
    this.getSearchVal()
  },
  methods: {
    getSearchVal() {
      this.searchVal = this.$route.params.searchVal
    },
    onSearch() {
      this.$router.push({
        name: '/search',
        params: {
          searchVal: this.searchVal
        }
      })
    },
    goRoom(n) {
      this.$router.push({
        name: 'player',
        params: {
          roomId: n
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.result {
  margin-top: 50px;
  margin-bottom: 50px;

  .room {
    height: 150px;
    margin: 20px 0;
    overflow: hidden;
    cursor: pointer;
  }

  .image {
    height: 80px;
    width: 100%;
  }

  .title {
    width: 100%;
  }
}

</style>
