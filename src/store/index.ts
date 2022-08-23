import Vuex, { StoreOptions } from 'vuex';
import authModule from './modules/auth';
import sessionsModule from './modules/sessions';
import modalModule from './modules/modal';
// import connectionModule from './modules/connection';

const store: StoreOptions<any> = {
  modules: {
    authModule,
    sessionsModule,
    modalModule,
    // connectionModule
  }
}

export default new Vuex.Store<any>(store);