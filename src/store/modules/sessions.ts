import Session from '@/interface/timer/session.interface';
import { Solve } from '@/interface/timer/solve.interface';
import PouchDB from 'pouchdb'
import { Module } from 'vuex';
const db = new PouchDB('sessionsList');

const sessionsModule: Module<any, any> = {
    namespaced: true,

    state: {
        db: db,
        currentSession: null,
        allSessions: [] as Array<Session>,
        loaded: false,
    },

    actions: {
        initSessions({commit}){
            db.allDocs({
                include_docs: true,
                attachments: true
            }).then(function (result: any) {
                const sessions = result.rows
                commit('SetCurrentSession', sessions[sessions.length - 1].doc)
                commit('SetAllSessions', sessions)
            }).catch(function (err: Error) {
                console.log(err);
            });
        },
        addNewSession({commit}, payload){
            commit('PushNewSession', payload)
            db.put(payload)
        },
        deleteCurrentSession({commit, state}){
            let sl = state.currentSession
            sl = JSON.parse(JSON.stringify(sl))
            commit('DeleteSession')
            db.get(sl._id).then(function (doc) {
                return db.remove(doc);
            });
        },
    
        // Solves
        addNewSolve({commit, state}, payload){
            commit('AddSolveToSession', payload)
            let sl = state.currentSession
            sl = JSON.parse(JSON.stringify(sl))
            console.log(sl._id)
            db.get(sl._id).then((doc: any) => {
                db.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    name: doc.name,
                    puzzle: doc.puzzle,
                    solveList: sl.solveList
                })
            }).then((res: any) => {
                console.log(res)
            }).catch((err: Error) => {
                console.log(err)
            })
        },
    
        updateSolve({commit, state}, payload){
            commit('UpdateSolve', payload)
            let sl = state.currentSession
            sl = JSON.parse(JSON.stringify(sl))
            db.get(sl._id).then((doc: any) => {
                db.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    name: doc.name,
                    puzzle: doc.puzzle,
                    solveList: sl.solveList
                })
            }).then((res: any) => {
                console.log(res)
            }).catch((err: Error) => {
                console.log(err)
            })
        },

        deleteSolve({commit, state}, payload){
            commit('DeleteSolve', payload)
            let sl = state.currentSession
            sl = JSON.parse(JSON.stringify(sl))
            console.log(sl._id)
            db.get(sl._id).then((doc: any) => {
                db.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    name: doc.name,
                    puzzle: doc.puzzle,
                    solveList: sl.solveList
                })
            }).then((res: any) => {
                console.log(res)
            }).catch((err: Error) => {
                console.log(err)
            })
        }
    },

    mutations: {
        SetAllSessions(state, payload){
            state.allSessions = payload
        },
        SetCurrentSession(state, payload){
            state.currentSession = payload
        },
        PushNewSession(state, payload){
            state.allSessions.push(payload)
        },
        DeleteSession(state){
            state.allSessions.filter((session: Session) => session._id == state.currentSession._id);
        },
    
        // Solves
        AddSolveToSession(state, payload){
            state.currentSession.solveList.push(payload)
        },
    
        UpdateSolve(state, payload){
            const solveList = state.currentSession.solveList as Array<Solve>
            console.log(solveList, payload)
            const updatedSolve = solveList.filter(solve => solve.timestamp == payload.timestamp)[0];
            console.log(updatedSolve)
            updatedSolve.penalty = payload.penalty
        },

        DeleteSolve(state, payload){
            const solveList = state.currentSession.solveList as Array<Solve>
            const indexOfDeletedSolve = solveList.findIndex(solve => solve.timestamp === payload.timestamp);
            solveList.splice(indexOfDeletedSolve, 1);
        },

        SessionsHaveLoaded(state) {
            state.loaded = true;
            console.log('loaded')
        }
    },

    getters: {
        getSession(state){
            return state.currentSession
        }
    }
}

export default sessionsModule;