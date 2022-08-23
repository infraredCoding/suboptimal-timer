<template>
  <div class="bg-bgDark h-screen flex flex-col">
    <NavBar />
    <div class="relative overflow-hidden flex flex-grow">
      <TimeList :toggles="toggleTList"/>
      <Timer />
    </div>
    <BottomNav @toggleTimeList="toggleTimeList"/>
    <CreateSessionModal />
    <SolveDetails />
    <SessionDeleteModal />

    <!-- auth modals -->
    <LoginModal />
    <RegisterModal />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from './components/nav/Navbar.vue'
import TimeList from './components/timer/TimeList.vue'
import Timer from './components/timer/Timer.vue'
import BottomNav from './components/nav/BottomNav.vue'
import CreateSessionModal from './components/timer/SessionForm.vue'
import SessionDeleteModal from './components/timer/SessionDeleteModal.vue'
import LoginModal from './components/auth/LoginModal.vue'
import RegisterModal from './components/auth/RegisterModal.vue'
import { mapActions, mapState } from 'vuex'
import PouchDB from 'pouchdb'
import SolveDetails from "@/components/timer/SolveDetails.vue";

const COUCHDB_SERVER_URI = process.env.VUE_APP_COUCHDB_SERVER_URI;
const USERNAME = process.env.VUE_APP_COUCHDB_ADMIN_USERNAME
const PASSWORD = process.env.VUE_APP_COUCHDB_ADMIN_PASSWORD

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});


export default defineComponent({
  name: 'App',
  components: {
   NavBar,
   BottomNav,
   TimeList,
   Timer,
   CreateSessionModal,
   SolveDetails,
   SessionDeleteModal,
   LoginModal,
   RegisterModal
  },
  data() {
    return {
      toggleTList: false,
    }
  },
  methods: {
    toggleTimeList() {
      this.toggleTList = !this.toggleTList;
    },
    ...mapActions('sessionsModule', ['initSessions']),
  },
  computed: {
    ...mapState('authModule', ['username']),
    ...mapState('sessionsModule', ['db'])
  },
  mounted() {
    this.initSessions();

    if (this.username !== '') {
      const localDB = new PouchDB('sessionsList');

      const url = new URL(COUCHDB_SERVER_URI);
      url.username = USERNAME;
      url.password = PASSWORD;
      url.pathname = this.username.toLowerCase();
      const authedURL = url.toString();

      const remoteDB = new PouchDB(authedURL);

      let sync = localDB.sync(remoteDB, {
        live: true,
        retry: true,
      });

      sync.on("change", (info: any) => {
        console.log(info)
        if (info.direction == "pull"){
          window.location.reload()
        }
      });
      sync.on("error", (err: any) => console.log(err));
      }

  },
});
</script>

<style>
</style>
