const ATTEMPT_LOGOUT = (state) => {
    localStorage.removeItem('USER_TOKEN')
    localStorage.removeItem('LOGGED_USER')
    localStorage.removeItem('NAVBAR_DETAILS')
    localStorage.removeItem('GANACHE_ACCOUNTs')
    localStorage.removeItem('LOGGED_USER_DASHBOARD')
    localStorage.removeItem('HOSPITAL_DETAILS')

    state.userToken = ""
    state.loggedUser = null
    state.hospital = null
    state.navbarDetails = null
    state.accounts = ""
    state.loggedUserDashbaord = ""
}

export default ATTEMPT_LOGOUT;