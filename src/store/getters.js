import state from './state';

import { isEmptyObject } from '../helpers/isEmptyObject'

const getters = {
    isLoggedIn() {
        return state.userToken.length > 0 && !isEmptyObject(JSON.parse(state.loggedUser));
    },

    loggedUser() {
        if (!state.loggedUser) {
            return {}
        }
        return JSON.parse(state.loggedUser)
    },

    hospital() {
        if (!state.hospital) {
            return {}
        }
        return JSON.parse(state.hospital)
    },

    navbarDetails() {
        if (!state.navbarDetails) {
            return {}
        }
        return JSON.parse(state.navbarDetails)
    },

    account() {
        return state.accounts;
    },

    loggedUserDashbaord() {
        return state.loggedUserDashbaord
    }
};

export default getters;