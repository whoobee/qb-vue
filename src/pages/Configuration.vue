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
    <card style="height:65px">
      <div class="row">
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="success" v-on:click="configSave()" slot="footer" fill>
            <i class="tim-icons icon-check-2"></i> Save</base-button>
        </div>
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="danger" v-on:click="configDefault()" slot="footer" fill>
            <i class="tim-icons icon-simple-remove"></i> Revert</base-button>
        </div>
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="default" v-on:click="configExport()" slot="footer" fill>
            <i class="tim-icons icon-minimal-down"></i> Export</base-button>
        </div>
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="default" v-on:click="$refs.importInput.click()" slot="footer" fill>
            <i class="tim-icons icon-minimal-up"></i> Import</base-button>
          <input type="file" ref="importInput" @change="configImport" style="display: none"><br/>
        </div>
      </div>
    </card>
    <div class="row">
      <div class="col-lg-12">
        <card>
          <h5 style="border-bottom: 1px solid gray" 
          slot="header" 
          class="title">
            Connection
          </h5>
          <base-input label="Rosbridge address:"
                    v-model="connection_data.address"
                    placeholder="ws://192.168.0.45">
          </base-input>
          <br>
          <base-input label="Rosbridge port:"
                    v-model="connection_data.port"
                    placeholder="9090">
          </base-input>
        </card>
      </div>
      <div class="col-lg-12">
        <card>
          <h5 style="border-bottom: 1px solid gray" 
          slot="header" 
          class="title">
            Status
          </h5>
          <base-input label="Status polling rate:"
                    v-model="configuration_data.status_config.poll_rate"
                    placeholder="2000">
          </base-input>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.robot_con.en">Enable</base-checkbox>
            <base-input label="Robot control websocket address:"
                      :disabled="!configuration_data.status_config.robot_con.en"
                      v-model="configuration_data.status_config.robot_con.address"
                      placeholder="ws://192.168.0.45">
            </base-input>
            <base-input label="Robot control websocket port:"
                      :disabled="!configuration_data.status_config.robot_con.en"
                      v-model="configuration_data.status_config.robot_con.port"
                      placeholder="8090">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.message.en">Enable</base-checkbox>
            <base-input label="Messages topic:"
                      :disabled="!configuration_data.status_config.message.en"
                      v-model="configuration_data.status_config.message.topic"
                      placeholder="/rosout">
            </base-input>
            <base-input label="Messages type:"
                      :disabled="!configuration_data.status_config.message.en"
                      v-model="configuration_data.status_config.message.msg"
                      placeholder="rosgraph_msgs/Log">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.drive.en">Enable</base-checkbox>
            <base-input label="Drive train status topic:"
                      :disabled="!configuration_data.status_config.drive.en"
                      v-model="configuration_data.status_config.drive.topic"
                      placeholder="/odrive/status">
            </base-input>
            <base-input label="Drive train msg type:"
                      :disabled="!configuration_data.status_config.drive.en"
                      v-model="configuration_data.status_config.drive.msg"
                      placeholder="/odrive/status">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.sensor.en">Enable</base-checkbox>
            <base-input label="Sensor status topic:"
                      :disabled="!configuration_data.status_config.sensor.en"
                      v-model="configuration_data.status_config.sensor.topic"
                      placeholder="/camera/realsense2_camera_manager/bond">
            </base-input>
            <base-input label="Sensor msg type:"
                      :disabled="!configuration_data.status_config.sensor.en"
                      v-model="configuration_data.status_config.sensor.msg"
                      placeholder="bond/Status">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.current_1.en">Enable</base-checkbox>
            <base-input label="Drive #1 current topic:"
                      :disabled="!configuration_data.status_config.current_1.en"
                      v-model="configuration_data.status_config.current_1.topic"
                      placeholder="/odrive/left/current">
            </base-input>
            <base-input label="Drive #1 current topic:"
                      :disabled="!configuration_data.status_config.current_1.en"
                      v-model="configuration_data.status_config.current_1.msg"
                      placeholder="/odrive/left/current">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.current_2.en">Enable</base-checkbox>
            <base-input label="Drive #2 current topic:"
                      :disabled="!configuration_data.status_config.current_2.en"
                      v-model="configuration_data.status_config.current_2.topic"
                      placeholder="/odrive/right/current">
            </base-input>
            <base-input label="Drive #2 current topic:"
                      :disabled="!configuration_data.status_config.current_2.en"
                      v-model="configuration_data.status_config.current_2.msg"
                      placeholder="/odrive/right/current">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.temp_1.en">Enable</base-checkbox>
            <base-input label="Drive #1 temperature topic:"
                      :disabled="!configuration_data.status_config.temp_1.en"
                      v-model="configuration_data.status_config.temp_1.topic"
                      placeholder="/odrive/left/temperature">
            </base-input>
            <base-input label="Drive #1 temperature topic:"
                      :disabled="!configuration_data.status_config.temp_1.en"
                      v-model="configuration_data.status_config.temp_1.msg"
                      placeholder="/odrive/left/temperature">
            </base-input>
          </blockquote>
          <br>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.status_config.temp_2.en">Enable</base-checkbox>
            <base-input label="Drive #2 temperature topic:"
                      :disabled="!configuration_data.status_config.temp_2.en"
                      v-model="configuration_data.status_config.temp_2.topic"
                      placeholder="/odrive/left/temperature">
            </base-input>
            <base-input label="Drive #2 temperature topic:"
                      :disabled="!configuration_data.status_config.temp_2.en"
                      v-model="configuration_data.status_config.temp_2.msg"
                      placeholder="/odrive/left/temperature">
            </base-input>
          </blockquote>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <card>
          <h5 style="border-bottom: 1px solid gray" 
          slot="header" 
          class="title">
            Navigation
          </h5>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.nav_config.en">Enable</base-checkbox>
            <base-input label="Map topic:"
                      :disabled="!configuration_data.nav_config.en"
                      v-model="configuration_data.nav_config.map.topic"
                      placeholder="/map">
            </base-input>
            <br>
            <base-input label="Navigation topic:"
                      :disabled="!configuration_data.nav_config.en"
                      v-model="configuration_data.nav_config.nav.topic"
                      placeholder="/move_base">
            </base-input>
            <br>
            <base-input label="Navigation cancel topic:"
                      :disabled="!configuration_data.nav_config.en"
                      v-model="configuration_data.nav_config.cancel.topic"
                      placeholder="/move_base/cancel">
            </base-input>
            <base-input label="Navigation cancel type:"
                      :disabled="!configuration_data.nav_config.en"
                      v-model="configuration_data.nav_config.cancel.msg"
                      placeholder="actionlib_msgs/GoalID">
            </base-input>
            <br>
            <base-input label="Pose topic:"
                      :disabled="!configuration_data.nav_config.en"
                      v-model="configuration_data.nav_config.pose.topic"
                      placeholder="/robot_pose">
            </base-input>
          </blockquote>
        </card>
      </div>
      <div class="col-lg-12">
        <card>
          <h5 style="border-bottom: 1px solid gray" 
          slot="header" 
          class="title">
            Teleop
          </h5>
          <blockquote class="blockquote">
            <base-checkbox class="mb-3" v-model="configuration_data.teleop_config.camera.en">Enable</base-checkbox>
            <base-input label="Web server address:"
                      :disabled="!configuration_data.teleop_config.camera.en"
                      v-model="configuration_data.teleop_config.camera.host"
                      placeholder="192.168.0.45">
            </base-input>
            <br>
            <base-input label="Web server port:"
                      :disabled="!configuration_data.teleop_config.camera.en"
                      v-model="configuration_data.teleop_config.camera.port"
                      placeholder="11315">
            </base-input>
            <br>
            <base-input label="Camera raw topic:"
                      :disabled="!configuration_data.teleop_config.camera.en"
                      v-model="configuration_data.teleop_config.camera.topic"
                      placeholder="/camera/fisheye1/image_raw">
            </base-input>
            <br>
            <fieldset :disabled="!configuration_data.teleop_config.camera.en">
            <base-dropdown menu-classes="dropdown-black"
               title-classes="btn btn-secondary"
               title="Aspect ratio">
              <h6 class="dropdown-header">Default ratio: 4:3</h6>
              <a class="dropdown-item" v-on:click="()=>{this.configuration_data.teleop_config.camera.aspect_ratio=1;}">1:1</a>
              <a class="dropdown-item" v-on:click="()=>{this.configuration_data.teleop_config.camera.aspect_ratio=2;}">3:2</a>
              <a class="dropdown-item" v-on:click="()=>{this.configuration_data.teleop_config.camera.aspect_ratio=3;}">4:3</a>
              <a class="dropdown-item" v-on:click="()=>{this.configuration_data.teleop_config.camera.aspect_ratio=4;}">16:9</a>
              <a class="dropdown-item" v-on:click="()=>{this.configuration_data.teleop_config.camera.aspect_ratio=5;}">21:9</a>
            </base-dropdown>
            </fieldset>
          </blockquote>
          <br>
          <base-input label="Joystick x scale:"
                    v-model="configuration_data.teleop_config.joystick.scale_x"
                    placeholder="1.0">
          </base-input>
          <base-input label="Joystick y scale:"
                    v-model="configuration_data.teleop_config.joystick.scale_y"
                    placeholder="1.0">
          </base-input>
          <base-input label="Command topic:"
                    v-model="configuration_data.teleop_config.joystick.cmd.topic"
                    placeholder="/cmd_vel">
          </base-input>
          <base-input label="Command type:"
                    v-model="configuration_data.teleop_config.joystick.cmd.msg"
                    placeholder="geometry_msgs/Twist">
          </base-input>
          <base-input label="Command topic rate:"
                    v-model="configuration_data.teleop_config.joystick.cmd.rate"
                    placeholder="100">
          </base-input>
        </card>
      </div>
    </div>
    <card style="height:65px">
      <div class="row">
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="success" v-on:click="configSave()" slot="footer" fill>
            <i class="tim-icons icon-check-2"></i> Save</base-button>
        </div>
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="danger" v-on:click="configDefault()" slot="footer" fill>
            <i class="tim-icons icon-simple-remove"></i> Revert</base-button>
        </div>
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="default" v-on:click="configExport()" slot="footer" fill>
            <i class="tim-icons icon-minimal-down"></i> Export</base-button>
        </div>
        <div class="col-3 text-center align-self-center" style="height:60px">
          <base-button size="sm" type="default" v-on:click="$refs.importInput.click()" slot="footer" fill>
            <i class="tim-icons icon-minimal-up"></i> Import</base-button>
          <input type="file" ref="importInput" @change="configImport" style="display: none"><br/>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
  /* Event Bus */
  import {bus} from '../main.js'
  /* Alert component */
  import { BaseAlert } from '@/components';
  /* File saving */
  import { saveAs } from 'file-saver';

  Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
  }
  function DumpObjectIndented(obj, indent){
    var result = "";
    if (indent == null) indent = "";

    for (var property in obj)
    {
      var value = obj[property];
      if (typeof value == 'string')
        value = "'" + value + "'";
      else if (typeof value == 'object')
      {
        if (value instanceof Array)
        {
          // Just let JS convert the Array to a string!
          value = "[ " + value + " ]";
        }
        else
        {
          // Recursive dump
          // (replace "  " by "\t" or something else if you prefer)
          var od = DumpObjectIndented(value, indent + "  ");
          // If you like { on the same line as the key
          //value = "{\n" + od + "\n" + indent + "}";
          // If you prefer { and } to be aligned
          value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
        }
      }
      result += indent + "'" + property + "' : " + value + ",\n";
    }
    return result.replace(/,\n$/, "");
  }

  export default {
    components: {
    },
    computed: {
      /* computed for getting general state */
      current_state() {
        return this.$store.getters.getStatus;
      },
    },
    data() {
      return {
        connection_data: {
          address:"ws://192.168.0.45",
          port:9090,
        },
        configuration_data: {
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
          teleop_config: {
            camera: {
              topic: "/camera/fisheye1/image_raw",
              host: "192.168.0.45",
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
      }
    },
    methods: {
      config: function(){
        if(this.$cookies.isKey('connection_data')){
          /* Connection Config */
          this.connection_data.address = this.$cookies.get('connection_data').address;
          this.connection_data.port = this.$cookies.get('connection_data').port;
          //cookie found
          this.notifyVue("success" , 
            "Connection settings cookie found", 
            "Connection settings restored from cookie.",);
        }
        else{
          //cookie not found
          this.notifyVue("danger" , 
            "Invalid connection settings", 
            "Connection settings not configured. Please configure connection settings before connecting to the robot.",);
          this.connection_data.address = '';
          this.connection_data.port = '';
        }
        if(this.$cookies.isKey('configuration_data')){
          /* Status Config */
          this.configuration_data.status_config.poll_rate = this.$cookies.get('configuration_data').status_config.poll_rate;
          this.configuration_data.status_config.robot_con.en = this.$cookies.get('configuration_data').status_config.robot_con.en;
          this.configuration_data.status_config.robot_con.address = this.$cookies.get('configuration_data').status_config.robot_con.address;
          this.configuration_data.status_config.robot_con.port = this.$cookies.get('configuration_data').status_config.robot_con.port;
          this.configuration_data.status_config.message.topic = this.$cookies.get('configuration_data').status_config.message.topic;
          this.configuration_data.status_config.message.msg = this.$cookies.get('configuration_data').status_config.message.msg;
          this.configuration_data.status_config.message.en = this.$cookies.get('configuration_data').status_config.message.en;
          this.configuration_data.status_config.drive.topic = this.$cookies.get('configuration_data').status_config.drive.topic;
          this.configuration_data.status_config.drive.msg = this.$cookies.get('configuration_data').status_config.drive.msg;
          this.configuration_data.status_config.drive.en = this.$cookies.get('configuration_data').status_config.drive.en;
          this.configuration_data.status_config.sensor.topic = this.$cookies.get('configuration_data').status_config.sensor.topic;
          this.configuration_data.status_config.sensor.msg = this.$cookies.get('configuration_data').status_config.sensor.msg;
          this.configuration_data.status_config.sensor.en = this.$cookies.get('configuration_data').status_config.sensor.en;
          this.configuration_data.status_config.current_1.topic = this.$cookies.get('configuration_data').status_config.current_1.topic;
          this.configuration_data.status_config.current_1.msg = this.$cookies.get('configuration_data').status_config.current_1.msg;
          this.configuration_data.status_config.current_1.en = this.$cookies.get('configuration_data').status_config.current_1.en;
          this.configuration_data.status_config.current_2.topic = this.$cookies.get('configuration_data').status_config.current_2.topic;
          this.configuration_data.status_config.current_2.msg = this.$cookies.get('configuration_data').status_config.current_2.msg;
          this.configuration_data.status_config.current_2.en = this.$cookies.get('configuration_data').status_config.current_2.en;
          this.configuration_data.status_config.temp_1.topic = this.$cookies.get('configuration_data').status_config.temp_1.topic;
          this.configuration_data.status_config.temp_1.msg = this.$cookies.get('configuration_data').status_config.temp_1.msg;
          this.configuration_data.status_config.temp_1.en = this.$cookies.get('configuration_data').status_config.temp_1.en;
          this.configuration_data.status_config.temp_2.topic = this.$cookies.get('configuration_data').status_config.temp_2.topic;
          this.configuration_data.status_config.temp_2.msg = this.$cookies.get('configuration_data').status_config.temp_2.msg;
          this.configuration_data.status_config.temp_2.en = this.$cookies.get('configuration_data').status_config.temp_2.en;
          /* Teleop Config */
            /* Cammera config */
          this.configuration_data.teleop_config.camera.en = this.$cookies.get('configuration_data').teleop_config.camera.en;
          this.configuration_data.teleop_config.camera.topic = this.$cookies.get('configuration_data').teleop_config.camera.topic;
          this.configuration_data.teleop_config.camera.host = this.$cookies.get('configuration_data').teleop_config.camera.host;
          this.configuration_data.teleop_config.camera.port = this.$cookies.get('configuration_data').teleop_config.camera.port;
          this.configuration_data.teleop_config.camera.aspect_ratio = this.$cookies.get('configuration_data').teleop_config.camera.aspect_ratio;
            /* Joystick config */
          this.configuration_data.teleop_config.joystick.scale_x = this.$cookies.get('configuration_data').teleop_config.joystick.scale_x;
          this.configuration_data.teleop_config.joystick.scale_y = this.$cookies.get('configuration_data').teleop_config.joystick.scale_y;
          this.configuration_data.teleop_config.joystick.cmd.topic = this.$cookies.get('configuration_data').teleop_config.joystick.cmd.topic;
          this.configuration_data.teleop_config.joystick.cmd.msg = this.$cookies.get('configuration_data').teleop_config.joystick.cmd.msg;
          this.configuration_data.teleop_config.joystick.cmd.rate = this.$cookies.get('configuration_data').teleop_config.joystick.cmd.rate;
          /* Nav Config */
          this.configuration_data.nav_config.en = this.$cookies.get('configuration_data').nav_config.en;
          this.configuration_data.nav_config.map.topic = this.$cookies.get('configuration_data').nav_config.map.topic;
          this.configuration_data.nav_config.nav.topic = this.$cookies.get('configuration_data').nav_config.nav.topic;
          this.configuration_data.nav_config.cancel.topic = this.$cookies.get('configuration_data').nav_config.cancel.topic;
          this.configuration_data.nav_config.cancel.msg = this.$cookies.get('configuration_data').nav_config.cancel.msg;
          this.configuration_data.nav_config.pose.topic = this.$cookies.get('configuration_data').nav_config.pose.topic;
          //cookie found
          this.notifyVue("success" , 
            "Configuration settings cookie found", 
            "Configuration settings restored from cookie.",);
        }
        else{
          this.notifyVue("danger" , 
            "Configuration not found.", 
            "Configuration cookie was not found. Reverting to default settings.",);
          this.configDefault();
        }
      },
      init: function(){
        this.config();
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
      configSave: function() {
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
        this.$cookies.set('configuration_data', this.configuration_data, Infinity)
        this.notifyVue("success" , 
          "Data stored", 
          "Configuration stored in cookie.",);
      },
      configDefault: function() {
        /* Connection Config */
        this.connection_data.address = "ws://192.168.0.45";
        this.connection_data.port = 9090;
        /* Status Config */
        this.configuration_data.status_config.poll_rate = 2000;
        this.configuration_data.status_config.robot_con.en = true;
        this.configuration_data.status_config.robot_con.address = "ws://192.168.0.45";
        this.configuration_data.status_config.robot_con.port = 8090;
        this.configuration_data.status_config.message.topic = "/rosout";
        this.configuration_data.status_config.message.msg = "rosgraph_msgs/Log";
        this.configuration_data.status_config.message.en = true;
        this.configuration_data.status_config.drive.topic = "/odrive/status";
        this.configuration_data.status_config.drive.msg = "std_msgs/String";
        this.configuration_data.status_config.drive.en = true;
        this.configuration_data.status_config.sensor.topic = "/camera/realsense2_camera_manager/bond";
        this.configuration_data.status_config.sensor.msg = "bond/Status";
        this.configuration_data.status_config.sensor.en = true;
        this.configuration_data.status_config.current_1.topic = "/odrive/left/current";
        this.configuration_data.status_config.current_1.msg = "std_msgs/Float64";
        this.configuration_data.status_config.current_1.en = true;
        this.configuration_data.status_config.current_2.topic = "/odrive/right/current";
        this.configuration_data.status_config.current_2.msg = "std_msgs/Float64";
        this.configuration_data.status_config.current_2.en = true;
        this.configuration_data.status_config.temp_1.topic = "/odrive/left/temperature";
        this.configuration_data.status_config.temp_1.msg = "std_msgs/Float64";
        this.configuration_data.status_config.temp_1.en = true;
        this.configuration_data.status_config.temp_2.topic = "/odrive/right/temperature";
        this.configuration_data.status_config.temp_2.msg = "std_msgs/Float64";
        this.configuration_data.status_config.temp_2.en = true;
        /* Teleop Config */
          /* Cammera config */
        this.configuration_data.teleop_config.camera.en = true;
        this.configuration_data.teleop_config.camera.topic = "/camera/fisheye1/image_raw";
        this.configuration_data.teleop_config.camera.host = "192.168.0.45";
        this.configuration_data.teleop_config.camera.port = 11315;
        this.configuration_data.teleop_config.camera.aspect_ratio = 1/1;
          /* Joystick config */
        this.configuration_data.teleop_config.joystick.scale_x = 0.7;
        this.configuration_data.teleop_config.joystick.scale_y = -1;
        this.configuration_data.teleop_config.joystick.cmd.topic = "/cmd_vel";
        this.configuration_data.teleop_config.joystick.cmd.msg = "geometry_msgs/Twist";
        this.configuration_data.teleop_config.joystick.cmd.rate = 100;
        /* Nav Config */
        this.configuration_data.nav_config.en = true;
        this.configuration_data.nav_config.map.topic = "/map";
        this.configuration_data.nav_config.nav.topic = "/move_base";
        this.configuration_data.nav_config.cancel.topic = "/move_base/cancel";
        this.configuration_data.nav_config.cancel.msg = "actionlib_msgs/GoalID";
        this.configuration_data.nav_config.pose.topic = "/robot_pose";
      },
      /* Export handler */
      configExport: function() {
        var saveDataJson = JSON.stringify(this.configuration_data);
        var blob = new Blob([saveDataJson], {
          type: "text/plain;charset=utf-8"
        });
        var filename = "ros-config.json";
        saveAs(blob, filename);
      },
      /* Import handler */
      configImport: function() {
        let file = this.$refs.importInput.files[0];
        if(!file || file.type !== 'application/json') {
          this.notifyVue("danger" , 
            "Incorrect format", 
            "Uploaded file format is incorrect.",);
          return;
        }
        // Credit: https://stackoverflow.com/a/754398/52160
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload =  evt => {
          var loadData = null;
          var json = evt.target.result;
          loadData = JSON.parse(json);
          this.configuration_data = loadData;
          this.notifyVue("success" , 
            "Upload successful", 
            "Configuration uploaded successfuly",);
          return;
        }
        reader.onerror = evt => {
          this.notifyVue("danger" , 
            "Upload error", 
            "Unknown uploading process error.",);
          return;
        }
      },
    },
    mounted() {
      this.init();
    },
    beforeDestroy(){
    }
  };
</script>

<style scoped>
  .note{
    font-size: 10px;
    color: rgb(167, 167, 167);
  }
</style>
