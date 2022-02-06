<template>
  <el-row :gutter="20">
    <el-col :span="18" :offset="3">
      <el-container>
        <el-header>
          <Nav />
        </el-header>
        <el-main>
          <Main />
        </el-main>
        <el-footer>
          <div class="appendix">
            附件区
          </div>
        </el-footer>
      </el-container>
    </el-col>
  </el-row>
</template>

<script>
import Nav from '@/components/Nav'
import Main from './components/main'

export default {
  name: 'Player',
  components: {
    Nav,
    Main
  },
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>
<style lang="scss">
/*.el-carousel{*/
/*  margin: 0 40px;*/
/*}*/
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.appendix{
  width: 100%;
  height: 100px;
  line-height: 100px;
  background-color: gray;
  color: white;
  text-align: center;
}
</style>
