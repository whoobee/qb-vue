<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="card" v-if="this.teleop_config.camera.en">
          <div class="card-header mb-5">
            <h5 class="card-category unselectable">Camera</h5>
            <div class="col-md-12 col-sm-6 text-center">
              <div id="divCamera"></div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header mb-5">
            <h5 class="card-category unselectable">Joystick</h5>
            <base-button 
                  size="sm" 
                  :disabled="!this.current_state.status" 
                  v-on:click="armRobot()"
                  slot="header" 
                  type="danger" 
                  fill>
            {{this.nipple_data.status.lable}} Robot
            </base-button>
            <br>
            <br>
            <blockquote class="blockquote">
              <div id="zone_joystick" style="height:200px">
                <div class="col-md-12 text-center" style="padding:60px">
                  <!--<span class="unselectable text-muted" style="font-style:oblique">
                    Tap and drag on this area to move the robot.
                  </span>-->
                </div>
              </div>
            </blockquote>
            <span class="unselectable text-muted" style="font-style:oblique">
              Joystick status: {{this.nipple_data.status.txt}} ( x:{{nipple_data.x.toFixed(3)}} y:{{nipple_data.y.toFixed(3)}} )
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* Event Bus */
  import {bus} from '../main.js'
  import { BaseAlert } from '@/components';
  import nipplejs from 'nipplejs';
  
  /**
   * Returns a number whose value is limited to the given range.
   *
   * Example: limit the output of this computation to between 0 and 255
   * (x * 255).clamp(0, 255)
   *
   * @param {Number} min The lower boundary of the output range
   * @param {Number} max The upper boundary of the output range
   * @returns A number in the range [min, max]
   * @type Number
   */
  Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

  export default {
    computed: {
      current_state() {
        return this.$store.getters.getStatus;
      },
    },
    components: {
    },
    data() {
      return {
        viewer: null,
        teleop_config: {
          camera: {
            topic: "/camera/fisheye1/image_raw",
            host: "",
            port: 11315,
            aspect_ratio: 1/1,
            en: true,
          },
          joystick: {
            scale_x: 1,
            scale_y: -1,
            cmd: {
              topic: "/cmd_vel",
              msg: "geometry_msgs/Twist",
              rate: 100,
            },
          },
        },
        nipple_data: {
          manager: null,
          x: 0.0,
          y: 0.0,
          status: {
            state: false,
            lable: "Arm",
            txt: "disarmed"
          },
        },
        command: {
          topic: null,
          message: null,
        }
      }
    },
    methods: {
      configure: function(){
        if(this.$cookies.isKey('configuration_data')){
          /* Cammera config */
          this.teleop_config.camera.en = this.$cookies.get('configuration_data').teleop_config.camera.en;
          this.teleop_config.camera.topic = this.$cookies.get('configuration_data').teleop_config.camera.topic;
          this.teleop_config.camera.host = this.$cookies.get('configuration_data').teleop_config.camera.host;
          this.teleop_config.camera.port = this.$cookies.get('configuration_data').teleop_config.camera.port;
          this.teleop_config.camera.aspect_ratio = this.$cookies.get('configuration_data').teleop_config.camera.aspect_ratio;
            /* Joystick config */
          this.teleop_config.joystick.scale_x = this.$cookies.get('configuration_data').teleop_config.joystick.scale_x;
          this.teleop_config.joystick.scale_y = this.$cookies.get('configuration_data').teleop_config.joystick.scale_y;
          this.teleop_config.joystick.cmd.topic = this.$cookies.get('configuration_data').teleop_config.joystick.cmd.topic;
          this.teleop_config.joystick.cmd.msg = this.$cookies.get('configuration_data').teleop_config.joystick.cmd.msg;
          this.teleop_config.joystick.cmd.rate = this.$cookies.get('configuration_data').teleop_config.joystick.cmd.rate;
        }
        else{
          /* Cammera config */
          this.teleop_config.camera.topic = "/camera/fisheye1/image_raw";
          this.teleop_config.camera.host = this.current_state.ros_con.socket.url.split('://')[1].split(':')[0];
          this.teleop_config.camera.port = 11315;
          this.teleop_config.camera.aspect_ratio = 1/1;
          this.teleop_config.camera.en = true;
          /* Joystick config */
          this.teleop_config.joystick.scale_x = 0.7;
          this.teleop_config.joystick.scale_y = -1;
          this.teleop_config.joystick.cmd.topic = "/cmd_vel";
          this.teleop_config.joystick.cmd.msg = "geometry_msgs/Twist";
          this.teleop_config.joystick.cmd.rate = 100;
          this.notifyVue("danger" , 
            "Configuration not found.", 
            "Configuration cookie was not found. Loading default settings.",);
        }
      },
      init: function(){
        console.log("Tele-init");
        this.configure();
        if(this.teleop_config.camera.en == true){
          this.setCamera();
        }
        this.nipple_data.manager = nipplejs.create({
            zone: document.getElementById('zone_joystick'),
            color: 'lightgreen'
        });
        this.nipple_data.manager.on('start ', this.getJoystickData);
        this.nipple_data.manager.on('move', this.getJoystickData);
        this.nipple_data.manager.on('end', this.getJoystickData);

        this.command.topic = new ROSLIB.Topic({
            ros: this.current_state.ros_con,
            name: this.teleop_config.joystick.cmd.topic,
            messageType: this.teleop_config.joystick.cmd.msg,
            throttle_rate: this.teleop_config.joystick.cmd.rate,
        });
      },
      /* Deinitialize component */
      deinit: function() {
      },
      /* Determine configured ratio */
      getAspectRatio: function(){
        var ratio = 1;
        switch(this.teleop_config.camera.aspect_ratio){
          case 1: /* 1:1 - ratio */
            ratio = 1;
            break;
          case 2: /* 3:2 - ratio */
            ratio = 2/3;
            break;
          case 3: /* 4:3 - ratio */
            ratio = 3/4;
            break;
          case 4: /* 16:9 - ratio */
            ratio = 9/16;
            break;
          case 5: /* 21:9 - ratio */
            ratio = 9/21;
            break;
          default: /* 4:3 - ratio */
            ratio = 3/4;
            break;
        }
        return ratio;
      },
      /* Cammera setup */
      setCamera: function() {
        let width = document.getElementById("divCamera").offsetWidth;
        let height = this.getAspectRatio() * width;
        console.log(width + " : " + height);
        console.log(this.getAspectRatio());
        let host = this.teleop_config.camera.host;
        let port = this.teleop_config.camera.port;
        
        this.viewer = new MJPEGCANVAS.Viewer({
            divID: 'divCamera',
            host: host,
            port: port,
            width: width,
            height: height,
            topic: this.teleop_config.camera.topic,
            ssl: true,
        });
      },
      /* Grab data from joystick */
      getJoystickData: function(evt, data){
        switch(evt.type){
          case "start":
            this.nipple_data.x = 0;
            this.nipple_data.y = 0;
            break;
          case "move":
            this.nipple_data.x = data.vector.y * this.teleop_config.joystick.scale_x;
            this.nipple_data.y = data.vector.x * this.teleop_config.joystick.scale_y;
            this.command.message = new ROSLIB.Message({
              linear: { x: this.nipple_data.x, y: 0, z: 0, },
              angular: { x: 0, y: 0, z: this.nipple_data.y},
              });
              if (this.nipple_data.status.state == true){
                this.command.topic.publish(this.command.message);
              }
            break;
          case "end":
            this.nipple_data.x = 0;
            this.nipple_data.y = 0;
            break;
        }
      },
      /* Arm/disarm robot btn handler */
      armRobot: function(){
        if(this.nipple_data.status.state == false){
          this.nipple_data.status.state = true;
          this.nipple_data.status.lable = "Disarm"
          this.nipple_data.status.txt = "armed";  
        }
        else{
          this.nipple_data.status.state = false;
          this.nipple_data.status.lable = "Arm"
          this.nipple_data.status.txt = "disarmed";
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
  .unselectable {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }
</style>
