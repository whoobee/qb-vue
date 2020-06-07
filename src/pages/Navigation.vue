<template>
  <div class="container unselectable">
    <div class="row" v-if="this.nav_config.en">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header mb-5">
            <h5 class="card-category">Map</h5>
              <div id="map" style="width:100%"></div>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="card">
          <div class="card-header mb-5">
            <h5 class="card-category">Control</h5>
            <div class="col-12 text-center align-self-center">
              <base-button size="sm" :disabled="(!this.current_state.status)" v-on:click="stop_nav()" slot="footer" type="danger" fill>Stop Navigation</base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-12 text-center align-self-center">
      <br>
      <br>
      <br>
      <h1 class="text-muted"><small>Navigation disabled from configuration</small></h1>
    </div>
  </div>
</template>
<script>
  /* Event Bus */
  import {bus} from '../main.js'
  import { BaseAlert } from '@/components';

  export default {
    computed: {
      current_state() {
        return this.$store.getters.getStatus;
      },
    },
    components: {
      BaseAlert
    },
    data() {
      return {
        mapViewer: null,
        mapGridClientNav: null,
        nav_cancel_topic: null,
        nav_config: {
          en: true,
          map: {
            topic: "/map",
          },
          nav: {
            topic: "/move_base",
          },
          cancel: {
            topic: "/move_base/cancel",
            msg: "actionlib_msgs/GoalID",
          },
          pose: {
            topic: "/robot_pose",
          },
        },
      }
    },
    methods: {
      /* Nav congfiguration */
      config: function(){
        if(this.$cookies.isKey('configuration_data')){
          this.nav_config.en = this.$cookies.get('configuration_data').nav_config.en;
          this.nav_config.map.topic = this.$cookies.get('configuration_data').nav_config.map.topic;
          this.nav_config.nav.topic = this.$cookies.get('configuration_data').nav_config.nav.topic;
          this.nav_config.cancel.topic = this.$cookies.get('configuration_data').nav_config.cancel.topic;
          this.nav_config.cancel.msg = this.$cookies.get('configuration_data').nav_config.cancel.msg;
          this.nav_config.pose.topic = this.$cookies.get('configuration_data').nav_config.pose.topic;
        }
        else{
          this.nav_config.en = true;
          this.nav_config.map.topic = "/map";
          this.nav_config.nav.topic = "/move_base";
          this.nav_config.cancel.topic = "/move_base/cancel";
          this.nav_config.cancel.msg = "actionlib_msgs/GoalID";
          this.nav_config.pose.topic = "/robot_pose";
          this.notifyVue("danger" , 
            "Configuration not found.", 
            "Configuration cookie was not found. Loading default settings.",);
        }
      },
      /* Nav initialization */
      init: function(){
        console.log("Nav-init");
        this.config();
        if(this.nav_config.en == true){
          // Setup the map viewer.
          let width = document.getElementById("map").offsetWidth;
          this.mapViewer = new ROS2D.Viewer({
              divID: 'map',
              width: width,
              height: 480,
              background: '#27293D'
          });
          // Setup the nav2d map client.
          this.mapGridClientNav = NAV2D.OccupancyGridClientNav({
              ros: this.current_state.ros_con,
              rootObject: this.mapViewer.scene,
              viewer : this.mapViewer,
              serverName : this.nav_config.nav.topic,
              withOrientation: true,
              robot_pose: this.nav_config.pose.topic,
          });
          this.nav_cancel_topic = new ROSLIB.Topic({
              ros : this.current_state.ros_con,
              name : this.nav_config.cancel.topic,
              messageType : this.nav_config.cancel.msg
          });
        }
      },
      /* Deinitialize component */
      deinit: function() {
      },
      /* Stop Nav handler */
      stop_nav: function() {
        var cancel_goal = new ROSLIB.Message({
            stamp : {
              secs : 0,
              nsecs : 0
            },
            id : ""
            });
        if (this.nav_cancel_topic != null){
          this.nav_cancel_topic.publish(cancel_goal);
          this.notifyVue("success" , 
            "Stop message", 
            "Stop command sent.");
        }
        else {
          this.notifyVue("danger" , 
            "Publish failure", 
            "Cannot publish message" + this.nav_cancel_topic.name);
        }
      },
      /* Notification handler */
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
    },
    created() {
      /* Listen for connect event */
      bus.$on('ros-connected', this.init);
      /* Listen for disconnect event */
      bus.$on('ros-disconnected', this.deinit);
    },
    /* dom is up*/
    mounted() {
      if(this.current_state.status == false )
      {
        this.notifyVue("danger" , 
        "Connection failure", 
        "Please make sure the connection with the robot is established...");
      }
      else{
        this.init();
      }
    },
    beforeDestroy() {
      /* Deregister events */
      bus.$off('ros-connected', this.init);
      bus.$off('ros-disconnected', this.deinit);
      this.deinit();
    }
  };
</script>
<style>
</style>
