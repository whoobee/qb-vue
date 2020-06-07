<template>
  <div class="container">

    <div v-if="this.status_config.robot_con.en == true" class="row">
      <div class="col-lg-12">
        <card type="chart">
          <base-button 
              v-if="this.robot_ws.state != 'engaged'"
              block  
              class="animation-on-hover" type="danger"
              v-on:click='engageRosNode()'>
            <i class="tim-icons icon-bell-55 icon-spaceship"></i> Engage
          </base-button>
          <base-button 
              v-else
              block  
              class="animation-on-hover" type="info"
              v-on:click='engageRosNode()'>
            <i class="tim-icons icon-bell-55 icon-button-power"></i> Disengage
          </base-button>
          <br>
          <p class="text-muted unselectable" style="font-size:10px">(*) if websocket is up, this command will start/stop master ROS node</p>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4">
        <card type="chart" style="height: 150px">
          <template slot="header">
            <h4 class="unselectable" style="border-bottom: 1px solid gray">
              <i class="tim-icons icon-bell-55 text-danger "></i> System Status
            </h4>
          </template>
          <div class="copyright">
            <ul class="list-unstyled">
              <li class="unselectable" style="padding:5px" v-if="this.status_config.drive.en">
                Drive status: 
                <span 
                    v-if="this.status.drive == 'connected'" 
                    class="text-success">{{status.drive}}
                </span>
                <span 
                    v-else 
                    class="text-danger">{{status.drive}}
                </span>
              </li>
              <li class="unselectable" style="padding:5px" v-if="this.status_config.sensor.en">
                Sensors status: 
                <span 
                    v-if="this.status.sensors == 'connected'" 
                    class="text-success">{{status.sensors}}
                </span>
                <span 
                    v-else 
                    class="text-danger">{{status.sensors}}
                </span>
              </li>
            </ul>
          </div>
        </card>
      </div>
      <div class="col-lg-4">
        <card type="chart" style="height: 150px">
          <template slot="header">
            <h4 class="unselectable" style="border-bottom: 1px solid gray">
              <i class="tim-icons icon-sound-wave text-info "></i> Current
            </h4>
          </template>
          <div class="copyright">
            <ul class="list-unstyled">
              <li class="unselectable" style="padding: 5px" v-if="this.status_config.current_1.en">
                Drive#1 Current: 
                <span 
                    v-if="this.current.drive_1 > 800" 
                    class="text-danger">{{current.drive_1}} <small>m</small>A
                </span>
                <span 
                    v-else
                    class="text-success">{{current.drive_1}} <small>m</small>A
                </span>
              </li>
              <li class="unselectable" style="padding: 5px" v-if="this.status_config.current_2.en">
                Drive#2 Current: 
                <span 
                    v-if="this.current.drive_1 > 800" 
                    class="text-danger">{{current.drive_2}} <small>m</small>A
                </span>
                <span 
                    v-else 
                    class="text-success">{{current.drive_2}} <small>m</small>A
                </span>
              </li>
            </ul>
          </div>
        </card>
      </div>
      <div class="col-lg-4">
        <card type="chart" style="height: 150px">
          <template slot="header">
            <h4 class="unselectable" style="border-bottom: 1px solid gray">
              <i class="tim-icons icon-alert-circle-exc text-success "></i> Temperature
            </h4>
          </template>
          <div class="copyright">
            <ul class="list-unstyled">
              <li class="unselectable" style="padding: 5px" v-if="this.status_config.temp_1.en">
                Drive#1 Temp: 
                <span 
                    v-if="this.temp.drive_1 > 80" 
                    class="text-danger">{{temp.drive_1}} °C
                </span>
                <span 
                    v-else
                    class="text-success">{{temp.drive_1}} °C
                </span>
              </li>
              <li class="unselectable" style="padding: 5px" v-if="this.status_config.temp_2.en">
                Drive#2 Temp: 
                <span 
                    v-if="this.temp.drive_2 > 80" 
                    class="text-danger">{{temp.drive_2}} °C
                </span>
                <span 
                    v-else
                    class="text-success">{{temp.drive_2}} °C
                </span>
              </li>
            </ul>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card" v-if="this.status_config.message.en">
          <div class="card-header mb-5">
            <h5 class="card-category unselectable">Messages</h5>
            <div class="table-full-width table-responsive col-12" style="height: 400px">
              <base-table :data="debugTable.data"
                          :columns="debugTable.columns"
                          thead-classes="text-primary" style="font-size: 12px">
              </base-table>
            </div>
            <br>
            <p class="text-muted unselectable" style="font-size:10px">(*) max messages displaied ( {{debugTable.maxMsgDisplaid}} )</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* Event Bus */
  import {bus} from '../main.js'
  /* Alert component */
  import { BaseAlert } from '@/components';
  /* Table component */
  import { BaseTable } from "@/components";

  Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
  }

  export default {
    components: {
      BaseTable,
    },
    computed: {
      /* computed for getting general state */
      current_state() {
        return this.$store.getters.getStatus;
      },
    },
    data() {
      return {
        status_config: {
          poll_rate: 2000,
          robot_con: {
            en: true,
            address: "ws://192.168.0.45",
            port: "8090",
          },
          message: {
            topic: "/rosout",
            msg: "rosgraph_msgs/Log",
            en: true,
          },
          drive: {
            topic: "/odrive/status",
            msg: "std_msgs/String",
            en: true,
          },
          sensor: {
            topic: "/camera/realsense2_camera_manager/bond",
            msg: "bond/Status",
            en: true,
          },
          current_1: {
            topic: "/odrive/left/current",
            msg: "std_msgs/Float64",
            en: true,
          },
          current_2: {
            topic: "/odrive/right/current",
            msg: "std_msgs/Float64",
            en: true,
          },
          temp_1: {
            topic: "/odrive/left/temperature",
            msg: "std_msgs/Float64",
            en: true,
          },
          temp_2: {
            topic: "/odrive/right/temperature",
            msg: "std_msgs/Float64",
            en: true,
          },
        },
        robot_ws: {
          state: "disconnected",
          socket: null,
        },
        status: {
          drive: "n/c",
          sensors: "n/c",
        },
        current: {
          drive_1: 0,
          drive_2: 0
        },
        temp: {
          drive_1: 0,
          drive_2: 0
        },
        /* data structure for debug table */
        debugTable: {
          title: "/rosout",
          columns: ["Timestamp", "Name", "Message"],
          data: [],
          maxMsgDisplaid : 500
        },
        messages_topic: null,
        drive_status_topic: null,
        current_1_topic: null,
        current_2_topic: null,
        temp_1_topic: null,
        temp_2_topic: null,
        sensors_topic: null,
        /* data structure for debug table */
        debugTable: {
          title: "/rosout",
          columns: ["Timestamp", "Name", "Message"],
          data: [],
          maxMsgDisplaid : 500
        },
      }
    },
    methods: {
      /* Config component */
      configure: function(){
        if(this.$cookies.isKey('configuration_data')){
          this.status_config.robot_con.en = this.$cookies.get('configuration_data').status_config.robot_con.en;
          this.status_config.robot_con.address = this.$cookies.get('configuration_data').status_config.robot_con.address;
          this.status_config.robot_con.port = this.$cookies.get('configuration_data').status_config.robot_con.port;
          this.status_config.poll_rate = this.$cookies.get('configuration_data').status_config.poll_rate;
          this.status_config.message.topic = this.$cookies.get('configuration_data').status_config.message.topic;
          this.status_config.message.msg = this.$cookies.get('configuration_data').status_config.message.msg;
          this.status_config.message.en = this.$cookies.get('configuration_data').status_config.message.en;
          this.status_config.drive.topic = this.$cookies.get('configuration_data').status_config.drive.topic;
          this.status_config.drive.msg = this.$cookies.get('configuration_data').status_config.drive.msg;
          this.status_config.drive.en = this.$cookies.get('configuration_data').status_config.drive.en;
          this.status_config.sensor.topic = this.$cookies.get('configuration_data').status_config.sensor.topic;
          this.status_config.sensor.msg = this.$cookies.get('configuration_data').status_config.sensor.msg;
          this.status_config.sensor.en = this.$cookies.get('configuration_data').status_config.sensor.en;
          this.status_config.current_1.topic = this.$cookies.get('configuration_data').status_config.current_1.topic;
          this.status_config.current_1.msg = this.$cookies.get('configuration_data').status_config.current_1.msg;
          this.status_config.current_1.en = this.$cookies.get('configuration_data').status_config.current_1.en;
          this.status_config.current_2.topic = this.$cookies.get('configuration_data').status_config.current_2.topic;
          this.status_config.current_2.msg = this.$cookies.get('configuration_data').status_config.current_2.msg;
          this.status_config.current_2.en = this.$cookies.get('configuration_data').status_config.current_2.en;
          this.status_config.temp_1.topic = this.$cookies.get('configuration_data').status_config.temp_1.topic;
          this.status_config.temp_1.msg = this.$cookies.get('configuration_data').status_config.temp_1.msg;
          this.status_config.temp_1.en = this.$cookies.get('configuration_data').status_config.temp_1.en;
          this.status_config.temp_2.topic = this.$cookies.get('configuration_data').status_config.temp_2.topic;
          this.status_config.temp_2.msg = this.$cookies.get('configuration_data').status_config.temp_2.msg;
          this.status_config.temp_2.en = this.$cookies.get('configuration_data').status_config.temp_2.en;
        }
        else{
          this.status_config.robot_con.en = true;
          this.status_config.robot_con.address = "ws://192.168.0.45";
          this.status_config.robot_con.port = 8090;
          this.status_config.poll_rate = 2000;
          this.status_config.message.topic = "/rosout";
          this.status_config.message.msg = "rosgraph_msgs/Log";
          this.status_config.message.en = true;
          this.status_config.drive.topic = "/odrive/status";
          this.status_config.drive.msg = "std_msgs/String";
          this.status_config.drive.en = true;
          this.status_config.sensor.topic = "/camera/realsense2_camera_manager/bond";
          this.status_config.sensor.msg = "bond/Status";
          this.status_config.sensor.en = true;
          this.status_config.current_1.topic = "/odrive/left/current";
          this.status_config.current_1.msg = "std_msgs/Float64";
          this.status_config.current_1.en = true;
          this.status_config.current_2.topic = "/odrive/right/current";
          this.status_config.current_2.msg = "std_msgs/Float64";
          this.status_config.current_2.en = true;
          this.status_config.temp_1.topic = "/odrive/left/temperature";
          this.status_config.temp_1.msg = "std_msgs/Float64";
          this.status_config.temp_1.en = true;
          this.status_config.temp_2.topic = "/odrive/right/temperature";
          this.status_config.temp_2.msg = "std_msgs/Float64";
          this.status_config.temp_2.en = true;
          this.notifyVue("danger" , 
            "Configuration not found.", 
            "Configuration cookie was not found. Loading default default settings.",);
        }
      },
      /* Initialize component */
      init: function(){
        console.log("Dash-init");
        if(this.status_config.message.en == true) {
          this.messages_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.message.topic,
            messageType :this.status_config.message.msg
          });
          this.messages_topic.subscribe(this.updateDebugTableData);
        }
        /* drive Status */
        if(this.status_config.drive.en == true) {
          this.drive_status_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.drive.topic,
            messageType : this.status_config.drive.msg,
            throttle_rate : this.status_config.poll_rate,
          });
          this.drive_status_topic.subscribe(this.getDriveStatus);
        }
        /* drive L Wheel Current */
        if(this.status_config.current_1.en == true) {
          this.current_1_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.current_1.topic,
            messageType : this.status_config.current_1.msg,
            throttle_rate : this.status_config.poll_rate,
          });
          this.current_1_topic.subscribe(this.getDrive1Current);
          }
        /* drive R Wheel Current */
        if(this.status_config.current_2.en == true) {
          this.current_2_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.current_2.topic,
            messageType : this.status_config.current_2.msg,
            throttle_rate : this.status_config.poll_rate,
          });
          this.current_2_topic.subscribe(this.getDrive2Current);
          }
        /* drive L Wheel Temp */
        if(this.status_config.temp_1.en == true) {
          this.temp_1_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.temp_1.topic,
            messageType : this.status_config.temp_1.msg,
            throttle_rate : this.status_config.poll_rate,
          });
          this.temp_1_topic.subscribe(this.getDrive1Temp);
        }
        /* drive R Wheel Temp */
        if(this.status_config.temp_2.en == true) {
          this.temp_2_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.temp_2.topic,
            messageType : this.status_config.temp_2.msg,
            throttle_rate : this.status_config.poll_rate,
          });
          this.temp_2_topic.subscribe(this.getDrive2Temp);
        }
        /* sensors status */
        if(this.status_config.sensor.en == true) {
          this.sensors_topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : this.status_config.sensor.topic,
            messageType : this.status_config.sensor.msg,
            throttle_rate : this.status_config.poll_rate,
          });
          this.sensors_topic.subscribe(this.getSensorsData);
        }
        setTimeout(()=>this.stopStatusSubscribers(), 5000);
      },
      /* Deinitialize component */
      deinit: function() {
        this.unsubscribeTopics();
      },
      /* function for balloon notification */
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
      /* Start/Stop ROS master node */
      engageRosNode: function() {
        var payload = {
          command: "engage",
          arg: "all"
        }
        switch(this.robot_ws.state){
          case "disconnected":
          case "connected":
          case "disengaged":
            payload.command = "engage";
            payload.arg = "all";
            break;
          case "engaged":
            payload.command = "disengage";
            payload.arg = "all";
            break;
          default:
            payload.command = null;
            payload.arg = null;
            break;
        }
        console.log("Send msg: " + JSON.stringify(payload));
        this.robot_ws.socket.send(JSON.stringify(payload));
      },
      /* Status event from ROS master node */
      getRosNodeState: function(event) {
        console.log("Res msg: " + event.data);
        var response = JSON.parse(event.data);
         switch(response.response){
          case "engaged":
            if(response.arg == "all")
              this.robot_ws.state = "engaged";
            break;
          case "disengaged":
            if(response.arg == "all")
              this.robot_ws.state = "disengaged";
            break;
          default:
            response.command = null;
            response.arg = null;
            break;
         }
      },
      /* callback function for updating debug table */
      updateDebugTableData: function(message){
          var data = {id: 0, timestamp: 0, name: "", message: ""};
          var t = new Date(1970, 0, 1); // Epoch
          t.setSeconds(message.header.stamp.secs);
          data.id = 0;
          data.timestamp = t.getHours().pad(2)+":"+t.getMinutes().pad(2)+":"+t.getSeconds().pad(2)/*+":"+t.getMilliseconds().pad(3)+""*/;
          data.name = message.name;
          data.message = message.msg;
          this.debugTable.data.push(data);
          if( this.debugTable.data.length > this.debugTable.maxMsgDisplaid){
             this.debugTable.data.shift();
          }
      },
      /* callback function for getting drive info */
      getDriveStatus: function(message){
        this.status.drive = message.data;
      },
      getDrive1Current: function(message){
        this.current.drive_1 = (message.data * 1000).toFixed(2);
      },
      getDrive2Current: function(message){
        this.current.drive_2 = (message.data * 1000).toFixed(2);
      },
      getDrive1Temp: function(message){
        this.temp.drive_1 = message.data.toFixed(1);
      },
      getDrive2Temp: function(message){
        this.temp.drive_2 = message.data.toFixed(1);
      },
      /* callback function for getting sensors info */
      getSensorsData: function(message){
          if(message.active)
            this.status.sensors = "connected";
          else
            this.status.sensors = "not connected";
      },
      unsubscribeTopics: function(){
        if(this.messages_topic != null && this.status_config.message.en == true)
        {
          this.messages_topic.unsubscribe();
        }
        if(this.drive_status_topic != null && this.status_config.drive.en == true)
        {
          this.drive_status_topic.unsubscribe();
        }
        if(this.current_1_topic != null && this.status_config.current_1.en == true)
        {
          this.current_1_topic.unsubscribe();
        }
        if(this.current_2_topic != null && this.status_config.current_2.en == true)
        {
          this.current_2_topic.unsubscribe();
        }
        if(this.temp_1_topic != null && this.status_config.temp_1.en == true)
        {
          this.temp_1_topic.unsubscribe();
        }
        if(this.temp_2_topic != null && this.status_config.temp_2.en == true)
        {
          this.temp_2_topic.unsubscribe();
        }
        if(this.sensors_topic != null && this.status_config.sensor.en == true)
        {
          this.sensors_topic.unsubscribe();
        }
      },
      stopStatusSubscribers: function(){
        if(this.messages_topic != null && this.status_config.message.en == true)
        {
          this.messages_topic.unsubscribe();
        }
        if(this.drive_status_topic != null && this.status_config.drive.en == true)
        {
          this.drive_status_topic.unsubscribe();
        }
        if(this.sensors_topic != null && this.status_config.temp_2.en == true)
        {
          this.sensors_topic.unsubscribe();
        }
      },
      getTopicMsgType: function(type){
        this.topic_msg_type = 'rosgraph_msgs/Log';
      }
    },
    created() {
      /* Read configuration */
      this.configure();
      /* Listen for connect event */
      bus.$on('ros-connected', this.init);
      /* Listen for disconnect event */
      bus.$on('ros-disconnected', this.deinit);
      /* Connect to system status websocket */
      var robot_con_url = this.status_config.robot_con.address + ":" + this.status_config.robot_con.port;
      this.robot_ws.socket = new WebSocket(robot_con_url);
      this.robot_ws.socket.onmessage = this.getRosNodeState;
      this.robot_ws.socket.onopen = (event) => {
        this.robot_ws.state = "connected";
      }
    },
    mounted() {
      if(this.current_state.status == false ){
        this.notifyVue("danger" , 
        "Connection failure", 
        "Please make sure the connection with the robot is established...",);
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
