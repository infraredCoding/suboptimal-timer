<template>
    <div id="tList" class="bg-dark shadow-2xl z-10 border-t-2 border-bgDark text-gray-50 w-72 overflow-auto text-center absolute inset-y-0 left-0 transform -translate-x-full transition duration-200 ease-in-out md:relative md:translate-x-0">
        <select @change="handleSessionChange($event)" class="bg-bgDark text-gray-50 px-4 py-2 my-2 rounded-md focus:outline-none" v-if="allSessions.length > 0">
            <option v-for="(s, idx) in allSessions" :key="idx" :value="s.doc.name" :selected="s.doc == currentSession">
              {{s.doc.name}}
            </option>
        </select>
        <button @click="ToggleSessionDeleteModal()" class="ml-2 my-3 btn-sm bg-red-600 hover:text-red-600 hover:bg-gray-100 transition duration-150">
            <i class="fa fa-trash "></i>
        </button>
        <br>
        <button @click="ToggleModal()" class="my-4 btn bg-secondary hover:text-secondary hover:bg-gray-100 transition duration-150">
            <i class="fas fa-plus mr-3"></i> New Session
        </button>
        <ul class="list-none text-md text-left ml-16 mt-2" v-if="currentSession">
          <li v-if="currentSession.solveList.length >= 5"><span class="pr-3 font-medium">Ao5</span> {{ getAverage(5) }}</li>
          <li v-if="currentSession.solveList.length >= 3"><span class="pr-3 font-medium">Mo3</span> {{ getMean(3) }}</li>
          <li v-if="currentSession.solveList.length >= 12"><span class="pr-3 font-medium">Ao12</span> {{ getAverage(12) }}</li>
          <li v-if="currentSession.solveList.length >= 50"><span class="pr-3 font-medium">Ao50</span> {{ getAverage(50) }}</li>
          <li v-if="currentSession.solveList.length >= 100"><span class="pr-3 font-medium">Ao100</span> {{ getAverage(100) }}</li>
          <li v-if="currentSession.solveList.length >= 1000"><span class="pr-3 font-medium">Ao1000</span> {{ getAverage(1000) }}</li>
        </ul>
        <ol class="text-center font-body mt-3" v-if="currentSession">
            <li v-for="(solve, idx) in currentSession.solveList.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))" :key="idx"> 
              {{idx + 1}}. <span class="pl-3 font-bold">{{ parseTime(solve.time, solve.penalty) }}</span> 
              <i @click="ToggleSolveModal(solve)" class="text-primary ml-2 px-1.5 py-1.5 rounded cursor-pointer hover:bg-gray-900 transition duration-100 fas fa-pen"></i>
            </li>
        </ol>
    </div>
    
</template>

<script lang="ts">
import { mapMutations, mapState } from 'vuex'
import moment from 'moment';
import { defineComponent } from '@vue/runtime-core';
import { Solve } from '@/interface/timer/solve.interface';

export default defineComponent({
    name: 'TimeList',
    data(){
        return {
          loading: true,
          small: true,
          timeList: [],
          sessionList: [],
          stats: {},
          currSession: this.currentSession
        }
    },
    props: {
      toggles: Boolean
    },
    watch:{
      toggles: function(newVal, oldVal) {
        if (this.small) {
          const tList = document.querySelector('#tList');
          tList!.classList.toggle('-translate-x-full')
          console.log(`timelist ${newVal} from ${oldVal}`)
        }
      }
    },
    mounted() {
      this.checkSmallScreen();
      window.addEventListener('resize', this.checkSmallScreen);
    },
    methods: {
      handleSessionChange(event: Event) {
        let newSession = this.allSessions.filter((s: any) => {
          return s.doc.name == (event.currentTarget! as HTMLSelectElement).value
        })[0]
        
        this.SetCurrentSession(newSession.doc)
      },
      parseTime(time: number, penalty: number): string{
        if (penalty == 2) return "DNF"
        var minutes = moment.duration(time).minutes();
        var formattedTime = minutes == 0 ? moment.utc(time).format('ss.SS') : moment.utc(time).format('mm:ss.SS')
        return penalty == 0 ? formattedTime : `${formattedTime}+`
      },
      checkSmallScreen(): void {
        let windowWidth = window.innerWidth;
        if (windowWidth <= 767){
          this.small = true;
          return;
        }
        this.small = false;
      },
      getAverage(n: number): string {
        if (this.currentSession.solveList.length < n) return 'N/A'

        let listOfSolves: Array<Solve> = this.currentSession.solveList.slice(0, n);

        let total = 0;
        let average = 0;
        let maxTime: Solve;
        let minTime: Solve;

        // check if multiple dnf exists return dnf
        let dnfsInList: Array<Solve> = listOfSolves.filter(solve => solve.penalty == 2)
        if (dnfsInList.length > 1) return 'DNF'
        if (dnfsInList.length == 1) {
          maxTime = dnfsInList[0];
        }else {
          maxTime = listOfSolves.filter(solve => solve.time == Math.max(...listOfSolves.map(item => item.time)))[0]
        }
        minTime = listOfSolves.filter(solve => solve.time == Math.min(...listOfSolves.map(item => item.time)))[0]

        let countingSolves: Array<Solve> = listOfSolves.filter(solve => solve !== minTime).filter(solve => solve !== maxTime);

        countingSolves.forEach(solve => {
          total += solve.time;
        });

        average = total / (n-2);
        var minutes = moment.duration(average).minutes();
        return minutes == 0 ? moment.utc(average).format('ss.SS') : moment.utc(average).format('mm:ss.SS')
      },
      getMean(n: number): string{
        if (this.currentSession.solveList.length < n) return 'N/A'

        let listOfSolves: Array<Solve> = this.currentSession.solveList.slice(0, n);
        let dnfsInList: Array<Solve> = listOfSolves.filter(solve => solve.penalty == 2)

        if (dnfsInList.length > 0) return 'DNF'

        let total = 0;
        let mean = 0;

        listOfSolves.forEach(solve => {
          total += solve.time;
        });

        mean = total / n;
        var minutes = moment.duration(mean).minutes();
        return minutes == 0 ? moment.utc(mean).format('ss.SS') : moment.utc(mean).format('mm:ss.SS')

      },
      ...mapMutations('modalModule', ['ToggleModal', 'ToggleSolveModal', 'ToggleSessionDeleteModal']),
      ...mapMutations('sessionsModule', ['SetCurrentSession'])
    },
    computed: {
      ...mapState('sessionsModule', ['currentSession']),
      ...mapState('sessionsModule', ['allSessions']),
    }
})
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #182B3C;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #264059;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>