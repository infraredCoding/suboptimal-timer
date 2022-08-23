<template>
  <div>
    <transition name="pop">
      <div v-if="sessionDeleteModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative w-auto my-6 mx-auto max-w-md">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
            <!--header-->
            <div class="flex items-start justify-between p-5 border-solid border-blueGray-200 rounded-t">
                <h3 class="text-3xl font-semibold text-gray-50">
                Delete {{ currentSession.name }}
                </h3>
                <button class="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
                <span class="bg-transparent text-gray-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                </span>
                </button>
            </div>
            <!--body-->
            <div class="relative p-6 flex-auto">
                <h6 class="text-zinc-100">Are you sure you want to delete {{ currentSession.name }}? By confirming you&apos;ll also delete all the solves in it.</h6>
            </div>
            <!--footer-->
            <div class="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
                <span @click="removeSession()" class="text-gray-50 mx-2 px-3 py-1 font-bold transition duration-150 cursor-pointer rounded hover:bg-gray-50 hover:text-danger bg-danger">Delete</span>
                <button class="text-danger bg-transparent font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
                Close
                </button>
            </div>
            </div>
        </div>
      </div>
    </transition>
    <div v-if="sessionDeleteModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapMutations, mapState, mapActions } from 'vuex';

export default defineComponent({
    name: 'SessionDeleteModal',
    methods: {
        toggleModal: function(){
            this.ToggleSessionDeleteModal();
        },
        removeSession(){
            this.deleteCurrentSession();
            window.location.reload()
        },
        ...mapMutations('modalModule', ['ToggleSessionDeleteModal']),
        ...mapActions('sessionsModule', ['deleteCurrentSession']),

    },
    computed: {
        ...mapState('modalModule', ['sessionDeleteModal']),
        ...mapState('sessionsModule', ['currentSession'])
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