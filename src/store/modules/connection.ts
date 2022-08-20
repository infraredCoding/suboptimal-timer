import { Module } from "vuex";

const connectionModule: Module<any, any> = {
    namespaced: true,

    state: {
        online: window.navigator.onLine,
    },
    actions : {},
    mutations:  {
        ToggleConnectionState(state, newState: boolean) {
            state.online = newState;
        }
    },
    getters:  {}

}
 
export default connectionModule;