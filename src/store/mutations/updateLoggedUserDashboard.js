const UPDATE_LOGGED_USER_DASHBOARD = (state, payload) => {
    localStorage.setItem('LOGGED_USER_DASHBOARD', payload);
    state.loggedUserDashbaord = payload;
}

export default UPDATE_LOGGED_USER_DASHBOARD;