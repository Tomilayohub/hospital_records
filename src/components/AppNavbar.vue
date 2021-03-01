<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark pr-5 pl-5">
        <a class="navbar-brand" href="#">
            <span v-if="isLoggedIn" style="display: flex; flex-direction: row; align-items: center;">
                <span v-html="navbarDetails.pageIcon"></span>
                {{navbarDetails.pageTitle}}
            </span>
            <span v-else style="display: flex; flex-direction: row; align-items: center;">
                <img alt="Vue logo" src="../assets/cbhr.png" width="40px" height="40px" style="margin-right: 10px;">
                CBHR
            </span>
        </a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav ml-auto">
                <li  v-if="isLoggedIn" class="nav-item mr-5" style="display: flex; flex-direction: row; align-items: center;">
                    <span v-html="navbarDetails.userIcon"></span>
                    <span class="text-info">{{navbarDetails.userName}}</span>
                </li>
                <li v-if="isLoggedIn" class="nav-item" style="display: flex; flex-direction: row; align-items: center;">
                    <a class="nav-link" @click="handleLogout" href="#"><i class="fas fa-sign-out-alt fa-2x"></i></a>
                </li>
                <li v-if="!isLoggedIn" class="nav-item">
                    <a class="nav-link" href="#"><i class="fas fa-headset fa-2x mr-3"></i> <span class="h5 text-info">+234 703 893 6341</span></a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: 'AppNavbar',

        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn
            },

            navbarDetails() {
                return this.$store.getters.navbarDetails
            },
        },

        methods: {
            handleLogout() {
                this.$store.dispatch('ATTEMPT_LOGOUT')
                    .then(() => {
                        this.$router.push({
                            name: "homepage"
                        })
                    })
                    .catch((err) => { console.log(err); })
            }
        }
    }
</script>

<style scoped>

</style>
