const UPDATE_LOGGED_USER_DASHBOARD = ({ commit }, payload) => {
    return new Promise( (resolve, reject) => {
        commit('UPDATE_LOGGED_USER_DASHBOARD', payload);
        const result = true;
        result ? resolve(result) : reject(result);
    });
}

export default UPDATE_LOGGED_USER_DASHBOARD;