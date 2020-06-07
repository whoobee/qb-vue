<template>
  <nav class="navbar navbar-expand-lg navbar-absolute unselectable"
       :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{toggled: $sidebar.showSidebar}">
          <button type="button"
                  class="navbar-toggler"
                  aria-label="Navbar toggle button"
                  @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <p class="navbar-brand">{{routeName}}</p>
      </div>
      <button class="navbar-toggler" type="button"
              @click="toggleMenu"
              data-toggle="collapse"
              data-target="#navigation"
              aria-controls="navigation-index"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
            <base-dropdown tag="li"
                           :menu-on-right="!$rtl.isRTL"
                           title-tag="a"
                           class="nav-item"
                           menu-classes="dropdown-navbar">
              <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                <div class="photo">
                  <img v-if="!this.current_state.status" src="img/icons/disconnected.png">
                  <img v-else-if="this.current_state.status" src="img/icons/connected.png">
                </div>
                <b class="caret d-none d-lg-block d-xl-block"></b>
                <p class="d-lg-none">
                  Control
                </p>
              </a>
              <li class="nav-link">
                <a v-on:click="connection_settings()" href="#" class="nav-item dropdown-item">Connection Settings</a>
              </li>
              <div class="dropdown-divider"></div>
              <li class="nav-link">
                <a v-on:click="connection_handle()" href="#" class="nav-item dropdown-item">{{this.current_state.btn_text}}</a>
              </li>
            </base-dropdown>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </nav>
</template>
<script>
  /* Event Bus */
  import {bus} from '../../main.js'
  import { CollapseTransition } from 'vue2-transitions';
  import Modal from '@/components/Modal';
  import { BaseAlert } from '@/components';

  export default {
    components: {
      CollapseTransition,
      Modal,
    },
    computed: {
      current_state() {
        this.connection_status = this.$store.getters.getStatus;
        return this.$store.getters.getStatus;
      },
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
      isRTL() {
        return this.$rtl.isRTL;
      }
    },
    data() {
      return {
        //connection status
        connection_status: {
          status:false, 
          status_text: "disconnected",
          btn_text: "Connect",
          ros_con: {}
          },
        //connection information from ConnectionForm
        connection_data: { 
          id:1, 
          address:'',
          port:'' 
        },
        //menu state
        showMenu: false,
      };
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      connection_settings(){
        //route to connection configuration form
        if (this.$router.currentRoute.path !== '/connection') this.$router.push('/connection');
      },
      connection_handle() {
        //check for status
        if(this.current_state.status == false){
          //disconnected, connect to rosbridge
          this.connect();
        }
        else{
          //connected, disconnect ros rosbridge
          this.disconnect();
        }
      },
      connect() {
        // check if cookie exists
        if(this.$cookies.isKey('connection_data')){
          // get cookie data
          this.connection_data.address = this.$cookies.get('connection_data').address;
          this.connection_data.port = this.$cookies.get('connection_data').port;
          // create roslib component
          this.connection_status.ros_con = new ROSLIB.Ros({url: this.connection_data.address + ":" + this.connection_data.port})
          //on connection handle
          this.connection_status.ros_con.on('connection', () => {
                // update connection status
                this.connection_status.status = true;
                this.connection_status.status_text = "connected";
                this.connection_status.btn_text = "Disconnect";
                // update status in store
                this.notifyVue("success" , 
                  "Connected", 
                  "Connected to ROS server.",);
                this.$store.commit('setStatus',this.connection_status);
            });
          //on error handle
          this.connection_status.ros_con.on('error', (error) => {
              // update connection status
              this.connection_status.status = false;
              this.connection_status.status_text = "disconnected";
              this.connection_status.btn_text = "Connect";
              this.connection_status.ros_con = {};
              // update status in store
              this.notifyVue("danger" , 
                  "Connection error", 
                  "Could not connect to the ROS server.",);
              this.$store.commit('setStatus',this.connection_status);
          });
          this.$cookies.set('reconnection_data', true, "5MIN");
          bus.$emit('ros-connected');
        }
        else{
          //cookie not found
          this.notifyVue("danger" , 
            "Invalid connection settings", 
            "Connection settings not configured. Please configure connection settings before connecting to the robot.",);
          this.connection_data.address = '';
          this.connection_data.port = '';
        }
      },
      disconnect() {
        if(this.$cookies.isKey('reconnection_data')){
          this.$cookies.remove("reconnection_data");
        }
        bus.$emit('ros-disconnected');
        this.connection_status.ros_con.close();
        //on close handle
        this.connection_status.ros_con.on('close', () => {
            // update connection status
            this.connection_status.status = false;
            this.connection_status.status_text = "disconnected";
            this.connection_status.btn_text = "Connect";
            this.connection_status.ros_con = {};
            // update status in store
            this.notifyVue("success" , 
                  "Disconnected", 
                  "Disconnected from ROS server.",);
            this.$store.commit('setStatus',this.connection_status);
            window.location.reload()
        });
      },
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
    mounted()
    {
      if(this.connection_status.status == false && 
      this.$cookies.isKey('reconnection_data')){
        this.connect();
      }
    }
  };
</script>
<style>
</style>
