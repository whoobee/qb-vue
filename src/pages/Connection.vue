<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header mb-5">
          <h5 class="card-category">Connection</h5>
          <connection-form>
          </connection-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ConnectionForm from '../components/ConnectionForm';

  export default {
    components: {
      ConnectionForm,
    },
    methods: {
    },
    data() {
      return {

      }
    }
  };
</script>
<style>
</style>
