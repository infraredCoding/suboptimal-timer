<template>
  <nav class="relative flex flex-wrap items-center justify-between px-2 py-5 bg-dark shadow-md">
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">        
        <a class="text-xl font-brand leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white">
          SubOptimal Timer
        </a>
        <button class="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button" v-on:click="toggleNavbar()">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <div v-bind:class="{'hidden': !showMenu, 'flex': showMenu}" class="lg:flex lg:flex-grow items-center transition duration-150">
        <ul class="flex flex-col lg:flex-row list-none ml-auto">
          <li class="nav-item">
            <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:bg-bgDark transition duration-150 rounded" href="https://github.com/infraredCoding/suboptimal-timer">
              <i class="fab fa-github text-lg leading-lg text-white opacity-75" /><span class="ml-2">Star</span>
            </a>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <button class="px-4 py-3 flex items-center text-sm font-bold leading-snug text-white hover:bg-bgDark transition duration-150 rounded">
              {{ getUsername }}
            </button>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <button @click.prevent="logoutUser()" class="px-4 py-3 flex items-center text-sm uppercase font-bold leading-snug text-white hover:bg-bgDark transition duration-150 rounded">
              Logout
            </button>
          </li>
          <li class="nav-item" v-if="!loggedIn">
            <button @click.prevent="ToggleAuthLoginModal()" class="px-4 py-3 flex items-center text-sm uppercase font-bold leading-snug text-white hover:bg-bgDark transition duration-150 rounded">
              Login
            </button>
          </li>
          <li class="nav-item" v-if="!loggedIn">
            <button @click.prevent="ToggleAuthRegisterModal()" class="btn bg-primary mx-3 flex items-center text-sm uppercase font-bold leading-snug text-white transition duration-150 hover:opacity-75">
              Signup
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { defineComponent } from 'vue'

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    toggleNavbar(): void{
      this.showMenu = !this.showMenu;
    },
    ...mapMutations('authModule', ['ToggleAuthLoginModal', 'ToggleAuthRegisterModal']),
    ...mapActions('authModule', ['logoutUser'])
  },
  computed: {
    ...mapGetters('authModule', ['loggedIn', 'getUsername'])
  }
})
</script>