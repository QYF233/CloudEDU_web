<template>

</template>

<script>

export default {
  name: 'C',
  props: ['btmStatus'],
  watch: {
    btmStatus: function() {
      console.log("C的时间")
    }
  }
}
</script>

<style scoped>

</style>
