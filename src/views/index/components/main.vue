<template>
  <div>
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>公开课</span>
          </div>
          <div class="box">
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
          </div>
          <div class="box">
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>公开课</span>
          </div>

          <div class="box">
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.box {
  margin-bottom: 10px;

  .classBox {
    display: inline-block;
    text-align: center;
    height: 100px;
    width: 50%;

    .el-image {
      height: 100px;
      width: 65%;
    }

    .classTitle {
      font-size: 15px;
    }
  }
}

</style>
