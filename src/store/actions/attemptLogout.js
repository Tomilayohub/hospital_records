const ATTEMPT_LOGOUT = ({ commit }) => {
    return new Promise( (resolve, reject) => {
        commit('ATTEMPT_LOGOUT');
        const result = true;
        result ? resolve(result) : reject(result);
    });
}

export default ATTEMPT_LOGOUT;