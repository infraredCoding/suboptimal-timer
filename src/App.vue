<template>
  <div class="bg-bgDark h-screen flex flex-col">
    <NavBar />
    <div class="relative overflow-hidden flex flex-grow">
      {{ online }}
      <TimeList :toggles="toggleTList"/>
      <Timer />
    </div>
    <BottomNav @toggleTimeList="toggleTimeList"/>
    <CreateSessionModal />
    <SolveDetails />

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
import LoginModal from './components/auth/LoginModal.vue'
import RegisterModal from './components/auth/RegisterModal.vue'
import { mapActions, mapState } from 'vuex'
import PouchDB from 'pouchdb'
import SolveDetails from "@/components/timer/SolveDetails.vue";

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
    // ...mapMutations('connectionModule', ['ToggleConnectionState'])
  },
  computed: {
    ...mapState('authModule', ['username']),
    ...mapState('sessionsModule', ['db'])
  },
  mounted() {
    this.initSessions();

    if (this.username !== '') {
      // let remoteDB = new PouchDB(`http://admin:password@localhost:5984/${this.username}`)
      const localDB = new PouchDB('sessionsList');

      // let sl = this.db
      // localDB = JSON.parse(JSON.stringify(sl))

      const url = new URL("http://localhost:5984/");
      url.username = 'admin';
      url.password = 'password';
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
  // created() {
  //   window.addEventListener('online', () => {
  //     console.log("connection regained")
  //     this.ToggleConnectionState(true)
  //   });
  //   window.addEventListener('offline', () => {
  //     console.log("connection lost")
  //     this.ToggleConnectionState(false)
  //   });
  // }
});
</script>

<style>
</style>
