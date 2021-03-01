const state = {
    userToken: localStorage.getItem('USER_TOKEN') || "",
    loggedUser: localStorage.getItem('LOGGED_USER') || null,
    hospital: localStorage.getItem('HOSPITAL_DETAILS') || null,
    navbarDetails: localStorage.getItem('NAVBAR_DETAILS') || null,
    accounts: localStorage.getItem('GANACHE_ACCOUNTs') || "",
    loggedUserDashbaord: localStorage.getItem('LOGGED_USER_DASHBOARD') || "",
};

export default state;