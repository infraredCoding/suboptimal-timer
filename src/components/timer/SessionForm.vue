<template>
  <div>
    <transition name="pop">
      <div v-if="modalState" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative w-auto my-6 mx-auto max-w-sm">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
            <!--header-->
            <div class="flex items-start justify-between p-5 border-solid border-blueGray-200 rounded-t">
                <h3 class="text-3xl font-semibold text-gray-50">
                New Session
                </h3>
                <button class="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
                <span class="bg-transparent text-gray-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                </span>
                </button>
            </div>
            <!--body-->
            <div class="relative p-6 flex-auto">
                <h3 class="text-xl text-gray-100">Select Puzzle</h3>
                <select class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none" v-model="selectedPuzzle">
                    <option v-for="(p, i) in puzzleList" :key="i" :value="p">{{p}}</option>
                </select>
            </div>
            <!--footer-->
            <div class="flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
                <button class="text-danger bg-transparent font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
                Close
                </button>
                <button class="text-gray-50 bg-primary rounded hover:bg-gray-50 hover:text-primary font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="createNewSession()">
                Create Session
                </button>
            </div>
            </div>
        </div>
      </div>
    </transition>
    <div v-if="modalState" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations, mapActions } from 'vuex'
import {v4 as uuidv4} from 'uuid'
import { defineComponent } from '@vue/runtime-core'
import Session from '@/interface/timer/session.interface'
import { Solve } from '@/interface/timer/solve.interface'

let puzzleMap = new Map<string, string>(
  [
    ['3x3x3', "3x3x3"],
    ['2x2x2', "2x2x2"],
    ['4x4x4', "4x4x4"],
    ['5x5x5', "5x5x5"],
    ['6x6x6', "6x6x6"],
    ['7x7x7', "7x7x7"],
    ['3x3x3 Blindfolded (3BLD)', "3x3x3"],
    ['3x3x3 Fewest Moves (FMC)', "3x3x3"],
    ['3x3x3 One-Handed', "3x3x3"],
    ['Megaminx', "megaminx"],
    ['Pyraminx', "pyraminx"],
    ['Clock', "clock"],
    ['Skewb', "skewb"],
    ['Square-1', "square1"],
    ['4x4x4 Blindfolded (4BLD)', "4x4x4"],
    ['5x5x5 Blindfolded (5BLD)', "5x5x5"],
    ['3x3x3 Multi-Blind (MBLD)', "3x3x3"],
  ]
);
export default defineComponent({
  name: "CreateSessionModal",
  data() {
    return {
      selectedPuzzle: '3x3x3',
      puzzleList: [
          '3x3x3',
          '2x2x2',
          '4x4x4',
          '5x5x5',
          '6x6x6',
          '7x7x7',
          '3x3x3 Blindfolded (3BLD)',
          '3x3x3 Fewest Moves (FMC)',
          '3x3x3 One-Handed',
          'Megaminx',
          'Pyraminx',
          'Clock',
          'Skewb',
          'Square-1',
          '4x4x4 Blindfolded (4BLD)',
          '5x5x5 Blindfolded (5BLD)',
          '3x3x3 Multi-Blind (MBLD)',
      ]
    }
  },
  methods: {
    createNewSession(){
      var newSession = {
        _id: uuidv4(),
        name: `${this.selectedPuzzle}_${this.allSessions.length+1}`,
        puzzle: puzzleMap.get(this.selectedPuzzle),
        solveList: [] as Array<Solve>
      } as Session

      this.addNewSession(newSession)
      window.location.reload();

    },
    toggleModal(): void{
      this.ToggleModal();
    },
    ...mapMutations('modalModule', ['ToggleModal']),
    ...mapMutations('sessionsModule', ['SetCurrentSession']),
    ...mapActions('sessionsModule', ['addNewSession'])
  },
  computed: {
    ...mapState('modalModule', ['modalState']),
    ...mapState('sessionsModule', ['allSessions']),
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