import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        status: {
            status:false, 
            status_text: "disconnected",
            btn_text: "Connect",
            ros_con: null
        }
    },
    getters: {
        getStatus: state => { 
            return state.status;
        },
    },
    mutations: {
        setStatus(state, new_status){
            state.status = new_status;
        },
    }
})

