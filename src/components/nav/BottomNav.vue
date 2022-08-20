<template>
  <div class="z-20 md:hidden py-2 text-gray-100 fixed bottom-0 inset-x-0 bg-bgLight flex justify-evenly align-middle">
      <a href="#" @click.prevent="$emit('toggleTimeList')" class="hover:bg-bgDark transition duration-150 w-full mx-3 py-2 rounded-md block text-center bg-dark">
          Time List
      </a>
      <div class="w-full mx-3 rounded-md flex text-center">
        <button @click="ToggleModal()" class="w-full px-3 py-2 rounded-md text-center bg-primary">
          <i class="fas fa-plus font-bold"></i>
        </button>
        <select @change="handleSessionChange($event)" class="bg-bgDark text-gray-50 px-4 py-2 rounded-md focus:outline-none" v-if="allSessions.length > 0">
            <option v-for="(s, idx) in allSessions" :key="idx" :value="s.doc.name" :selected="s.doc == currentSession">
              {{s.doc.name}}
            </option>
        </select><br>
      </div>
      <!-- <a href="#" class="hover:bg-bgDark transition duration-150 w-full mx-3 py-2 rounded-md block text-center bg-dark">
          Settings
      </a> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { mapMutations, mapState } from 'vuex'

export default defineComponent({
    name: 'BottomNav',
    methods: {
      handleSessionChange(event: Event) {
        let newSession = this.allSessions.filter((s: any) => {
          return s.doc.name == (event.currentTarget! as HTMLSelectElement).value
        })[0]
        
        this.SetCurrentSession(newSession.doc)
      },
      ...mapMutations('modalModule', ['ToggleModal']),
      ...mapMutations('sessionsModule', ['SetCurrentSession'])
    },
    computed: {
      ...mapState('sessionsModule', ['currentSession']),
      ...mapState('sessionsModule', ['allSessions']),
    }
})
</script>

<style>

</style>