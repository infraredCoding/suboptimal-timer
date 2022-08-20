import { Module } from "vuex";
import axios, { AxiosError } from 'axios'
import { LoginData } from "@/interface/auth/login.interface";
import { User } from "@/interface/auth/user.interface";

const authModule: Module<any, any> = {
    namespaced: true,

    state: {
        authRegisterModal: false,
        authLoginModal: false,
        authState: false,
        token: localStorage.getItem('token') || '',
        username: localStorage.getItem('username') || '',

        loginMessage: {},
        registerMessage: {}
    },

    getters: {
        loggedIn(state): boolean{
            return state.token !== '';
        },
        getToken(state): string {
            return state.token;
        },
        getUsername(state): string{
            return state.username;
        }
    },

    actions: {
        async loginUser(context, credentials: LoginData){
            return axios.post('http://127.0.0.1:5000/api/auth/login', {
                username: credentials.username,
                password: credentials.password
            }).then(response => {
                const token = response.data.token
                localStorage.setItem('token', token)
                localStorage.setItem('username', credentials.username)
                context.commit('saveToken', token)
                context.commit('saveUsername', credentials.username)
                context.commit('clearLoginError')
            }).catch(err => {
                console.log(err)
                context.commit('addLoginError', err);
            })
        },
        async registerUser(context, credentials: User){
            return axios.post('http://127.0.0.1:5000/api/auth/register', {
              username: credentials.username,
              name: credentials.name,
              email: credentials.email,
              password: credentials.password,
            }).then(response => {
                console.log("res", response)
                context.commit('clearRegistrationError')
            })
              .catch(err => {
                console.log("Error", err)
                context.commit('addRegistrationError', err);
            })
        },
        logoutUser(context){
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            context.commit('deleteToken')
            context.commit('deleteUsername')
            window.location.reload()
        }
    },

    mutations: {
        addRegistrationError(state, err: AxiosError){
            state.registerMessage = err.response?.data
        },
        addLoginError(state, err: AxiosError){
            state.loginMessage = err.response?.data
        },
        clearRegistrationError(state){
            state.registerMessage = {}
        },
        clearLoginError(state){
            state.loginMessage = {}
        },
        ToggleAuthRegisterModal(state) {
            state.authRegisterModal = !state.authRegisterModal;
        },
        ToggleAuthLoginModal(state) {
            state.authLoginModal = !state.authLoginModal;
        },
        saveToken(state, token){
            state.token = token
        },
        saveUsername(state, username){
            state.username = username
        },
        deleteToken(state){
            state.token = null;
        },
        deleteUsername(state){
            state.username = null;
        }
    }
} 

export default authModule;