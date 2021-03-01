const ATTEMPT_LOGIN = (state, payload) => {
    const stringifiedLoggedUserDetails = JSON.stringify(payload.loggedUser);
    const stringifiedNavbarDetails = JSON.stringify(payload.navbarDetails);

    localStorage.setItem('USER_TOKEN', payload.userToken);
    localStorage.setItem('LOGGED_USER', stringifiedLoggedUserDetails);
    localStorage.setItem('NAVBAR_DETAILS', stringifiedNavbarDetails);
    localStorage.setItem('GANACHE_ACCOUNTs', payload.accounts);
    
    state.userToken = payload.userToken;
    state.loggedUser = stringifiedLoggedUserDetails;
    state.navbarDetails = stringifiedNavbarDetails;
    state.accounts = payload.accounts;
}

export default ATTEMPT_LOGIN;