<template>
  <div>
    <transition name="pop">
      <div v-if="authRegisterModal"  class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative w-auto my-6 mx-auto max-w-sm">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
            <!--header-->
            <div class=" bg-emerald-600 text-zinc-50 font-bold px-5 py-3 rounded-t-lg" v-if="successFullMessage && !registerMessage.error">
              Registration has been successful. Please close this modal and login
            </div>
            <div class=" bg-red-600 text-zinc-50 font-bold px-5 py-3 rounded-t-lg" v-if="registerMessage.error">
              {{ registerMessage.error }}
            </div>
            <div class="flex items-start justify-between p-5 border-solid border-blueGray-200 rounded-t">
                <h3 class="text-3xl font-semibold text-gray-50">
                Register
                </h3>
                <button class="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
                <span class="bg-transparent text-gray-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                </span>
                </button>
            </div>
            <!--body-->
            <div class="relative p-6 flex-auto">
                <input type="text" placeholder="name" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="user.name">
                <input type="email" placeholder="email" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="user.email">
                <input type="text" placeholder="username" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="user.username">
                <h6 class="text-red-600" v-if="checkUsernameIsInvalid">
                  Username Cannot Contain Special Characters (#, &amp;, @, % etc) nor spaces.
                </h6>
                <input type="password" placeholder="password" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="user.password">
                <input type="password" placeholder="confirm password" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none w-full" v-model="confirmPassword">
                <p class="text-danger font-bold" v-if="!checkPassword">Passwords Don&apos;t Match</p>
            </div>
            <div class="mx-auto mt-2" v-if="loading">
              <LoaderCube />
            </div>
            <!--footer-->
            <div class="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
                <button class="text-danger bg-transparent font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
                Close
                </button>
                <button class="text-gray-50 bg-primary rounded hover:bg-gray-50 hover:text-primary font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="register()">
                Register
                </button>
            </div>
            </div>
        </div>
      </div>
    </transition>
    <div v-if="authRegisterModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script lang="ts">
import { User } from '@/interface/auth/user.interface';
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import LoaderCube from "@/components/timer/Loader.vue";

export default defineComponent({
  name: "RegisterModal",
  components: {
    LoaderCube
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        username: '',
        password: '',
      } as User,
      confirmPassword: '',

      successFullMessage: false,

      errors: [],
      loading: false
    }
  },
  methods: {
    toggleModal(): void{
      this.ToggleAuthRegisterModal();
    },
    register(): void {
      if (this.checkPassword && !this.checkUsernameIsInvalid){
        this.loading = true
        this.registerUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          username: this.user.username
        }).then(res => {
          console.log(res)
          if (this.registerMessage.error){
            this.loading = false;  
          }else {
            this.successFullMessage = true;
            this.loading = false;
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    ...mapMutations('authModule', ['ToggleAuthRegisterModal']),
    ...mapActions('authModule', ['registerUser'])
  },
  computed: {
    ...mapState('authModule', ['authRegisterModal', 'registerMessage']),
    checkPassword(): boolean{
      if (this.user.password !== "" && this.confirmPassword !== "")
        return this.user.password == this.confirmPassword;
      return true;
    },
    checkUsernameIsInvalid(): boolean {
      //eslint-disable-next-line
      return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.user.username);
    }
  }
})
</script>
<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.35s ease;
}

.pop-enter-from,
.pop-leave-to {
  transform: translateY(-100%);
}
</style>