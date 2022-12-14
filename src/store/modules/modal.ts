import { Solve } from "@/interface/timer/solve.interface";
import { Module } from "vuex";

const modalModule: Module<any, any> = {
    namespaced: true,

    state: {
        modalState: false,
        solveModal: false,
        selectedSolve: {} as Solve,
        sessionDeleteModal: false,
    },
    actions : {},
    mutations:  {
        ToggleModal(state) {
            state.modalState = !state.modalState;
        },
        ToggleSolveModal(state, solve: Solve) {
            state.solveModal = !state.solveModal;
            if (state.solveModal) { state.selectedSolve = solve }
            else { state.selectedSolve = {} }
        },
        ToggleSessionDeleteModal(state) {
            state.sessionDeleteModal = !state.sessionDeleteModal;
        },
    },
    getters:  {
        getModalState(state) {
            return state.modalState;
        }
    }

}
 
export default modalModule;