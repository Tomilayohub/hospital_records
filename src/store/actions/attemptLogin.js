import { generateLoggedUserToken } from '../../helpers/generateLoggedUserToken'
import { generateNavbarDetails } from '../../helpers/generateNavbarDetails'

import { store } from '../../store'

const ATTEMPT_LOGIN = ({ commit }, payload) => {
    return new Promise( (resolve, reject) => {
        const loginParam = {}
        loginParam.userToken = generateLoggedUserToken(payload.userId)
        loginParam.loggedUser = payload
        loginParam.navbarDetails = generateNavbarDetails(payload, store.getters.hospital) 
        loginParam.accounts = payload.userId
        
        commit('ATTEMPT_LOGIN', loginParam);
        const result = true;
        result ? resolve(result) : reject(result);
    });
}

export default ATTEMPT_LOGIN;