<template>
  <div class="contianer">
    <div class="card card-header mb-5">
      <h5 class="card-category unselectable">Echo topic</h5>
      <div class="row">
        <div class="col-md-12 text-center align-self-center">
          <v-select 
            class="select-bar" 
            placeholder="Choose a topic" 
            :options="topicList.topics" 
            v-on:input="getSelectedTopic($event)"
            label="topics">
          </v-select>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="col-md-12">
          <div class="table-full-width table-responsive col-12" style="height: 400px">
            <base-table id="debug_table" 
                        type="mini"
                        :data="echoTable.data"
                        :columns="echoTable.columns"
                        thead-classes="text-primary" style="font-size: 12px">
            </base-table>
          </div>
        </div>
      </div>
      <div class="row unselectable">
        <div class="col-md-4">
          <br>
          <h6 class="text-muted"><small>Topic: {{this.selected_topic.name}}</small></h6>
        </div>
        <div class="col-md-4">
          <br>
          <h6 class="text-muted"><small>Status: {{this.selected_topic.status}}</small></h6>
        </div>
        <div class="col-md-4">
          <br>
          <h6 class="text-muted"><small>Rate: {{this.selected_topic.poll_rate}} MS</small></h6>
        </div>
      </div>
    </div>
    <div class="card card-header mb-5">
      <div class="row">
        <div class="col-md-3 align-self-center">
          <base-dropdown class="dropup" menu-classes="dropdown-black"
               title-classes="btn btn-secondary"
               title="topic poll-rate">
              <h6 class="dropdown-header">Default rate: 100ms</h6>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=10;getSelectedTopic(this.selected_topic.name);}">10 ms</a>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=50;getSelectedTopic(this.selected_topic.name);}">50 ms</a>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=100;getSelectedTopic(this.selected_topic.name);}">100 ms</a>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=200;getSelectedTopic(this.selected_topic.name);}">200 ms</a>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=500;getSelectedTopic(this.selected_topic.name);}">500 ms</a>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=1000;getSelectedTopic(this.selected_topic.name);}">1000 ms</a>
              <a class="dropdown-item" v-on:click="()=>{this.selected_topic.poll_rate=5000;getSelectedTopic(this.selected_topic.name);}">5000 ms</a>
          </base-dropdown>
        </div>
        <div class="col-md-3 align-self-center">
          <base-button type="danger center" v-on:click="stopSelectedTopic()" fill>Unsubscribe</base-button>
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
  /* dropdown list component */
  import vSelect from "vue-select";
  import "vue-select/dist/vue-select.css";

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
      BaseTable,
      "v-select": vSelect
    },
    computed: {
      /* computed for getting general state */
      current_state() {
        return this.$store.getters.getStatus;
      },
    },
    data() {
      return {
        selected_topic: {
          topic: null,
          name: "n/a",
          poll_rate: 100,
          status: "unsubscribed",
        },
        topicList: {
          size: 0,
          topics: [],
          types: []
        },
        /* data structure for debug table */
        echoTable: {
          title: "no topic selected",
          columns: ["TimeStamp", "Data"],
          data: [],
          maxMsgDisplaid : 500
        },
      }
    },
    methods: {
      /* Init component */
      init: function(){
        console.log("Debug-init");
        this.current_state.ros_con.getTopics(this.getTopicList);
      },
      /* Deinitialize component */
      deinit: function() {
        /* Stop topics */
        this.stopSelectedTopic();
      },
      /* Initialize topic list */
      getTopicList: function(topics){
        this.topicList.size = topics.topics.length;
        this.topicList.topics = topics.topics;
        this.topicList.types = topics.types;
      },
      /* Get topic info from ROS */
      getSelectedTopicData: function(message){
        var data = {timestamp: 0, data: ""};
        this.echoTable.title = this.selected_topic.topic.name;
        var t = new Date();
        data.timestamp = t.getHours().pad(2)+":"+t.getMinutes().pad(2)+":"+t.getSeconds().pad(2) +":"+t.getMilliseconds().pad(3)+"";
        data.data = DumpObjectIndented(message, null);
        this.echoTable.data.unshift(data);
        if( this.echoTable.data.length > this.echoTable.maxMsgDisplaid){
            this.echoTable.data.pop();
        }
      },
      /* Handler for unsubscribe topic */
      stopSelectedTopic: function(){
        if(this.selected_topic.topic != null)
        {
          this.selected_topic.topic.unsubscribe();
          this.selected_topic.status = "unsubscribed"
        }
      },
      /* Subscribe to selected topic */
      getSelectedTopic: function(selectedTopic){
        var selectedType;
        if(selectedTopic!=null && selectedTopic!="n/a")
        {
          this.echoTable.data = [];
          selectedType = this.topicList.types[this.topicList.topics.indexOf(selectedTopic)];
          this.stopSelectedTopic();
          this.selected_topic.topic = new ROSLIB.Topic({
            ros : this.current_state.ros_con,
            name : selectedTopic,
            messageType : selectedType,
            throttle_rate : this.selected_topic.poll_rate,
          });
          this.selected_topic.name = this.selected_topic.topic.name;
          this.selected_topic.topic.subscribe(this.getSelectedTopicData);
          this.selected_topic.status = "subscribed"
        }
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
        "Please make sure the connection with the robot is established...",);
      }
      else{
        this.init();
      }
    },
    beforeDestroy(){
      /* Deregister events */
      bus.$off('ros-connected', this.init);
      bus.$off('ros-disconnected', this.deinit);
      this.deinit();
    }
  };
</script>

<style scoped>
  .note{
    font-size: 10px;
    color: rgb(167, 167, 167);
  }

</style>
<style>
  .select-bar .vs__search::placeholder,
  .select-bar .vs__dropdown-toggle,
  .select-bar .vs__clear,
  .select-bar .vs__dropdown-menu {
    background: rgb(225, 223, 235);
    border: none;
  }
  .select-bar .vs__open-indicator {
    fill: #7d86b9;
  }
</style>
