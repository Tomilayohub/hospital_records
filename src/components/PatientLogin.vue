<template>
    <div class="login-view">
        <form class="login-form mt-5">
            <div v-if="errors.message" class="alert alert-danger" role="alert">
                {{errors.message}}
            </div>
            <div class="login-type-icon mt-5 mb-3 d-flex justify-content-center">
                <i class="fas fa-hospital-user fa-5x"></i>
            </div>   
            <h1 class="h2 mb-3 font-weight-normal d-flex justify-content-center">Sign In</h1>

            <div class="form-group mb-4">
                <label class="d-flex justify-content-left mb-0">User Token</label>
                <input type="text" readonly @input="updateUserTokenErrorStatus" class="form-control" placeholder="User Token" v-model="form.userToken" required autofocus>
                <small v-if="errors.userToken" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.userToken}}</small>
            </div>

            <div class="form-group">
                <label class="d-flex justify-content-left mb-0">Password</label>
                <input type="password" @input="updatePasswordErrorStatus" id="inputPassword" class="form-control mb-3" placeholder="Password" v-model="form.password" required>
                <small v-if="errors.password" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.password}}</small>
            </div>
            
            <button v-if="!isLoading" @click.prevent="attemptLogin" class="btn btn-success btn-block pt-3 pb-2" type="submit">
                Sign in
            </button>
            <button v-else class="btn btn-success btn-block  pt-3 pb-2" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
            
            <div class="form-group d-flex justify-content-center">
                <router-link to="/" class="btn btn-lg btn-outline-secondary mb-5 mt-5">Switch Account &nbsp;<i class="fas fa-sync-alt"></i></router-link>
            </div>

            <p class="mt-5 mb-3 text-muted">&copy; 2020, Consortium Blockchain Health Records.</p>
        </form>
    </div>
</template>

<script>


    import BlockchainHealthRecord from '../abis/BlockchainHealthRecord.json'

    export default {
        name: 'PatientLogin',

        data() {
            return {
                form: {
                    userToken: "",
                    password: ""
                },
                errors: {
                    userToken: "",
                    password: "",
                    message: ""
                },
                isLoading: false,
                blockchainHealthRecord: null,
                web3: null
            }
        },

        methods: {
            attemptLogin() {
                this.isLoading = true;
                if (! this.validateForm()) {
                    this.isLoading = false; 
                    return;
                }

                this.blockchainHealthRecord.methods.patientLogin(this.form.password).send({from: this.form.userToken })
                    .then((receipt) => {
                        const response = receipt.events.LoginAttemptFailed || receipt.events.PatientAccount
                        if (response.returnValues.errorMessage) {
                            this.errors.message = response.returnValues.errorMessage
                            this.isLoading = false
                        } else {
                            const userDetails = response.returnValues
                            this.$store.dispatch('ATTEMPT_LOGIN', userDetails)
                                .then(() => {
                                    this.$router.push({ 
                                        name: "patient_dashboard",
                                        params: {
                                            patientId: userDetails.id
                                        }
                                    })
                                    this.isLoading = false
                                }).catch(err => { console.log('PATIENT LOGIN STORE ERROR:', err ); this.isLoading = false })  
                        }
                    }).catch((err)=>{
                        this.isLoading = false
                        console.log("PATIENT LOGIN API ERROR: ", err) 
                     })
            },

            validateForm() {
                if (!this.form.userToken) {
                    this.errors.userToken = "User Token field is required!"
                }

                if (!this.form.password) {
                    this.errors.password = "Password field is required!"
                }

                if(this.form.userToken && this.form.password) {
                    return true
                } else {
                    return false;
                }
            },

            updateUserTokenErrorStatus () {
                if(this.form.userToken.toString().length > 0){
                    this.errors.userToken = ""
                    this.errors.message = ""
                }
            },

            updatePasswordErrorStatus() {
                if(this.form.password.toString().length > 0){
                    this.errors.password = ""
                    this.errors.message = ""
                }
            }
        },

        created() {
            this.web3 = window.web3
        },

        async mounted() {
            this.$store.dispatch("UPDATE_LOGGED_USER_DASHBOARD", 'patient_dashboard')

            const accounts = await this.web3.eth.getAccounts()
            this.form.userToken = accounts[0]
            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                gas: 450000,
                gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            })
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");


    .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .login-view {
        min-height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        justify-items: center;
    }

    .login-form {
        width: 100%;
        max-width: 500px;
    }

    @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
    }

    @media (max-width: 500px) {
        form {
           margin: 0;
           padding: 0;
        }

        .login-view {
            width:100%;
            padding: 0 10px !important;
            display: flex;
            justify-content: center;
            justify-items: center;
        }
    
    }
</style>
