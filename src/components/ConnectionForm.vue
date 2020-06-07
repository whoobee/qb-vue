<template>
  <div class="container unselectable">
    <card>
      <div class="row">
        <div class="col-12">
            <p class="blockquote blockquote-primary"><i class="tim-icons icon-alert-circle-exc"></i> The configuration data is stored as browser <strong>cookie </strong>.<br>
            Please make sure that cookies are accepted by your browser in order for this dashboard to work properly.</p>
        </div>
      </div>
    </card>
    <card>
      <h5 slot="header" class="title">Miro Bot Connection</h5>
      <div class="row">
        <div class="col-md-7 pr-md-1">
          <base-input label="Address:"
                    v-model="connection_data.address"
                    placeholder="192.168.0.45">
          </base-input>
        </div>
        <div class="col-md-5 pl-md-1">
          <base-input label="Port:"
                    v-model="connection_data.port"
                    placeholder="8000">
          </base-input>
        </div>
      </div>
      <base-button type="danger" v-on:click="connection_save()" slot="footer" fill>Save</base-button>
    </card>
    <p class="note">(*) connection data will be stored locally as cookie.</p>
  </div>
</template>
<script>
  import { BaseAlert } from '@/components';

  export default {
    components: {
    },
    props: {
      model: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    methods: {
      notifyVue(type, title, message) {
        this.$notify({
          title: title,
          message: message,
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "right",
          verticalAlign: "bottom",
          type: type,
          timeout: 5000
        });
      },
      connection_save: function() {
        if((this.connection_data.address != "") & (this.connection_data.port != "")){
          this.$cookies.set('connection_data', this.connection_data, Infinity)
          this.notifyVue("success" , 
            "Data stored", 
            "Connection data stored in cookie.",);
        }
        else{
          this.notifyVue("danger" , 
            "Invalid connection data", 
            "Connection data is incorrect. Please add valid URL address and Port.",);
        }
      },
      connect: function() {
      },
      close: function() {
      }
    },
    created(){
      if(this.$cookies.isKey('connection_data')){
        this.connection_data.address = this.$cookies.get('connection_data').address
        this.connection_data.port = this.$cookies.get('connection_data').port
      }
      else{
        this.connection_data.address = ''
        this.connection_data.port = ''
      }
    },
    data() {
      return {
        connection_data: { 
          id:1, 
          address:'',
          port:'' 
          },
      }
    }
  }
</script>
<style scoped>
  .note{
    font-size: 10px;
    color: rgb(167, 167, 167);
  }
</style>
