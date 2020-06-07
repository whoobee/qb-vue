<template>
  <footer class="footer unselectable">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <p class="copyright"><i class="tim-icons icon-chart-bar-32"></i>&nbsp;&nbsp;status:&nbsp; 
          <span v-if="this.current_state.status" class="text-success">{{this.current_state.status_text}}</span>
          <span v-else class="text-danger">{{this.current_state.status_text}}</span> </p>
        </li>
      </ul>
      <div class="copyright">
        © {{year}} made with <i class="tim-icons icon-heart-2"></i> by
        <a href="https://github.com/whoobee" target="_blank" rel="noopener">Whoobee</a>&nbsp; using BlackDashboard by
        <a href="https://www.creative-tim.com" target="_blank" rel="noopener">Creative Tim</a> <i>"for a better web"</i>.
      </div>
    </div>
  </footer>
</template>
<script>

  export default {
    components: {
    },
    computed: {
      current_state() {
        return this.$store.getters.getStatus;
      },
    },
    data() {
      return {
        year: new Date().getFullYear(),
        conStatus: "disconnected"
      }
    },
    methods: {
    },
  };
</script>
<style scoped>
  .status{
    font-size: 11px;
    color: rgb(167, 167, 167);
  }
</style>
