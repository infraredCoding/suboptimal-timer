<template>
  <div class="flex flex-col m-3 lg:m-0 lg:mt-3 lg:-mb-3 lg:ml-3 w-screen font-body bg-dark rounded-md overflow-y-auto" id="timer_wrapper">
      <div class="text-center mx-auto">
          <h6 class="text-center pt-6 text-md md:text-lg lg:text-xl px-10 md:px-16 text-gray-100" v-if="allSessions.length === 0">
            You have no sessions! Create one to Get Started
          </h6>
          <h6 class="text-center pt-6 text-md md:text-lg lg:text-xl px-10 md:px-16 text-gray-100">
            {{ scramble }}
          </h6>
          <div class="flex flex-col">
            <div class="py-7 md:py-5">
              <h1 :class="{'text-primary': timerState == 'ready' }" class="font-timer font-light text-7xl lg:text-8xl py-3 lg:py-2 text-gray-50 text-center">
                {{formattedTime}}
              </h1>
              <div class="text-center">
                  <span @click="solveOk()" class="text-gray-50 mx-2 px-3 py-1 font-bold transition duration-150 cursor-pointer rounded hover:bg-gray-50 hover:text-primary bg-primary">OK</span>
                  <span @click="solvePlusTwo()" class="text-gray-50 mx-2 px-3 py-1 font-bold transition duration-150 cursor-pointer rounded hover:bg-gray-50 hover:text-secondary bg-secondary">+2</span>
                  <span @click="solveDNF()" class="text-gray-50 mx-2 px-3 py-1 font-bold transition duration-150 cursor-pointer rounded hover:bg-gray-50 hover:text-danger bg-danger">DNF</span>
              </div>
            </div>
            <div class="flex" id="scrambleDisplay" v-show="currentSession">
            </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { randomScrambleForEvent } from 'cubing/scramble'
import { TwistyPlayer } from "cubing/twisty";
import { defineComponent } from '@vue/runtime-core'
import Session from '@/interface/timer/session.interface'
import { Solve } from '@/interface/timer/solve.interface';
// import Localbase from 'localbase'

// let db = new Localbase('db')
const player = new TwistyPlayer({
  hintFacelets: "none",
  backView: "top-right",
  background: "none",
  controlPanel:"none",
  visualization: "2D",
});

let puzzleMapping= new Map([
    ['3x3x3', "333"],
    ['2x2x2', "222"],
    ['4x4x4', "444"],
    ['5x5x5', "555"],
    ['6x6x6', "666"],
    ['7x7x7', "777"],
    ['3x3x3 Blindfolded (3BLD)', "333bld"],
    ['3x3x3 Fewest Moves (FMC)', "333fm"],
    ['3x3x3 One-Handed', "333oh"],
    ['Megaminx', "minx"],
    ['Pyraminx', "pyra"],
    ['Clock', "clock"],
    ['Skewb', "skewb"],
    ['Square-1', "sq1"],
    ['4x4x4 Blindfolded (4BLD)', "444bld"],
    ['5x5x5 Blindfolded (5BLD)', "555bld"],
    ['3x3x3 Multi-Blind (MBLD)', "333mbld"],
]) 
export default defineComponent({
    name: 'CubeTimer',
    data () {
      return {

        timerState: 'stopped',
        lastKeyUp: 0,
        keyDownAt: 0,

        lastTouchUp: 0,
        TouchDownAt: 0,

        currentTime: 0,
        currentPenalty: 0,
        ticker: 0,

        scramble: '',
        currentPuzzle: '',
      }
    },
    computed: {
      formattedTime(): string{
        var minutes = moment.duration(this.currentTime).minutes();
        var time = minutes == 0 ? moment.utc(this.currentTime).format('ss.SS') : moment.utc(this.currentTime).format('mm:ss.SS')

        switch (this.currentPenalty) {
          case 0:
            return time

          case 1:
            return `${time}+`

          case 2:
            return 'DNF'
        }
        return time
      },
      ...mapState('sessionsModule', ['currentSession', 'loaded', 'allSessions']),
      ...mapGetters('sessionsModule', ['getSession'])
    },
    mounted(){
      document.querySelector('#scrambleDisplay')!.appendChild(player);

      let timerContainer = document.querySelector("#timer_wrapper");
      
      window.addEventListener('keyup', e => this.startTimer(e))
      window.addEventListener('keydown', e => this.prepOrStop(e))

      timerContainer!.addEventListener('touchend', e => this.startTimerTouch())
      timerContainer!.addEventListener('touchstart', e => this.prepOrStopTouch())
      
      player.classList.add("mx-auto", "w-64", "md:w-80", "sm:w-96")
    },
    watch: {
      scramble(newScramble, old) {
        console.log(old)
        if (newScramble != '') {
          player.alg = newScramble;
        }
      },
      currentSession(newSession, oldSession) {
        if (oldSession == null) {
          console.log("got a session")
          this.SessionsHaveLoaded();
        }
        console.log(newSession)
        this.getScramble(puzzleMapping.get(newSession.puzzle) || "333")
        this.currentPuzzle = newSession.puzzle
        player.puzzle = newSession.puzzle;
        player.alg = this.scramble
      },
    },
    methods: {
      setCurrentPuzzle(){
        if (this.loaded)
          this.currentPuzzle = this.currentSession.puzzle
      },
      async getScramble(puzzle: string){
        this.scramble = (await randomScrambleForEvent(puzzle)).toString()
      },
      // timer functionalities
      startTimer (e: KeyboardEvent){
        if (e.key == " "){
          if (this.scramble !== ''){
            this.lastKeyUp = moment.now();

            if (this.timerState == 'ready'){
              this.timerState = 'running'

              this.ticker = setInterval(() => {
                this.currentTime += 10
              }, 10)
            }
          }
        }
      },

      startTimerTouch (){
        if (this.scramble !== '') {
          this.lastTouchUp = moment.now();

          if (this.timerState == 'ready'){
            this.timerState = 'running'

            this.ticker = setInterval(() => {
              this.currentTime += 10
            }, 10)
          }
        }
      },

      prepOrStop(e: KeyboardEvent){
        if (e.key == " "){
          switch (this.timerState) {
            case 'stopped':
              this.keyDownAt = moment.now();

              setTimeout(() => {
                if (+this.keyDownAt > +this.lastKeyUp){
                  this.timerState = 'ready'
                  this.currentTime = 0
                }
              }, 200)
              break;

            case 'running':
              this.timerState = 'stopped'
              clearInterval(this.ticker)
              this.addNewSolve({
                time: this.currentTime,
                scramble: this.scramble,
                timestamp: moment.utc(),
                penalty: this.currentPenalty
              });

              this.getScramble(puzzleMapping.get(this.currentPuzzle) || "333");
              break;
          
            default:
              break;
          }
        }
      },

      prepOrStopTouch(){
        switch (this.timerState) {
          case 'stopped':
            this.TouchDownAt = moment.now();

            setTimeout(() => {
              if (+this.TouchDownAt > +this.lastTouchUp){
                this.timerState = 'ready'
                this.currentTime = 0
              }
            }, 200)
            break;

          case 'running':
            this.timerState = 'stopped'
            clearInterval(this.ticker)
            this.addNewSolve({
              time: this.currentTime,
              scramble: this.scramble,
              timestamp: moment.utc(),
              penalty: this.currentPenalty
            });

            this.getScramble(puzzleMapping.get(this.currentPuzzle) || "333");
            break;
        
          default:
            break;
        }
      },

      // Penalties
      solveOk() {
        if (this.currentPenalty == 1){
          this.currentTime -= 2000
        }
        this.currentPenalty = 0
        let currentSolve: Solve = this.currentSession.solveList[this.currentSession.solveList.length - 1]
        currentSolve.time = this.currentTime
        currentSolve.penalty = this.currentPenalty
        this.updateSolve(currentSolve)
      },
      solvePlusTwo() {
        if (this.currentPenalty !== 1){
          this.currentPenalty = 1
          this.currentTime += 2000
          let currentSolve: Solve = this.currentSession.solveList[this.currentSession.solveList.length - 1]
          currentSolve.time = this.currentTime
          currentSolve.penalty = this.currentPenalty
          this.updateSolve(currentSolve)
        }
      },
      solveDNF() {
        if (this.currentPenalty == 1){
          this.currentTime -= 2000
        }
        this.currentPenalty = 2
        let currentSolve: Solve = this.currentSession.solveList[this.currentSession.solveList.length - 1]
        currentSolve.time = this.currentTime
        currentSolve.penalty = this.currentPenalty
        this.updateSolve(currentSolve)
      },

      ...mapActions('sessionsModule', ['addNewSolve', 'updateSolve']),
      ...mapMutations('sessionsModule', ['SessionsHaveLoaded'])
    }
})
</script>

<style scoped>
</style>