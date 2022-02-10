<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('beforeunload'))))
    window.addEventListener('beforeunload', () => {
      const state = JSON.stringify(this.$store.state)
      localStorage.setItem('beforeunload', state)
    })
  }

}
</script>
