<template>
  <div>
    <transition name="pop">
      <div v-if="authLoginModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative w-auto my-6 mx-auto max-w-sm">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
            <!--header-->
            <div class=" bg-red-600 text-zinc-50 font-bold px-5 py-3 rounded-t-lg" v-if="loginMessage.message">
              {{ loginMessage.message }}
            </div>
            <div class="flex items-start justify-between p-5 border-solid border-blueGray-200 rounded-t">
                <h3 class="text-3xl font-semibold text-gray-50">
                Login
                </h3>
                <button class="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
                <span class="bg-transparent text-gray-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                </span>
                </button>
            </div>
            <!--body-->
            <div class="relative p-6 flex-auto">
                <input type="text" placeholder="username" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="credentials.username">
                <input type="password" placeholder="password" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="credentials.password">
            </div>
            <div class="mx-auto mt-2" v-if="loading">
              <LoaderCube />
            </div>
            <!--footer-->
            <div class="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
                <button class="text-danger bg-transparent font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
                Close
                </button>
                <button class="text-gray-50 bg-primary rounded hover:bg-gray-50 hover:text-primary font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="login()">
                Login
                </button>
            </div>
            </div>
        </div>
      </div>
    </transition>
    <div v-if="authLoginModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script lang="ts">
import { LoginData } from '@/interface/auth/login.interface'
import { defineComponent } from 'vue'
import { mapMutations, mapState, mapActions } from 'vuex';
import LoaderCube from "@/components/timer/Loader.vue";

export default defineComponent({
    name: 'LoginModal',
    components: {
      LoaderCube
    },
    data() {
        return {
            credentials: {
              username: '',
              password: ''
          } as LoginData,

          loading: false
        }
    },
    methods: {
    toggleModal: function(){
      this.ToggleAuthLoginModal();
    },
    login(){
      var user = {username: this.credentials.username, password: this.credentials.password}
      this.loading = true;
      this.loginUser(user).then((res: Response) => {
        console.log(res)
        if (this.loginMessage.message){
          this.loading = false;
        }
        else {
          this.loading = false;
          this.toggleModal()
          window.location.reload()
        }
      }).catch((err: Error) => console.log(err))
    },
      ...mapMutations('authModule', ['ToggleAuthLoginModal']),
      ...mapActions("authModule", ['loginUser'])
    },
    computed: {
      ...mapState('authModule', ['authLoginModal', 'loginMessage'])
    }
})
</script>


<style>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.35s ease;
}
.pop-enter-from,
.pop-leave-to {
  transform: translateY(-100%);
}
</style>