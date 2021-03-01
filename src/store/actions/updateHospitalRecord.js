const UPDATE_HOSPITAL_RECORD = ({ commit }, payload) => {
    return new Promise( (resolve, reject) => {
        commit('UPDATE_HOSPITAL_RECORD', payload);
        const result = true;
        result ? resolve(result) : reject(result);
    });
}

export default UPDATE_HOSPITAL_RECORD;