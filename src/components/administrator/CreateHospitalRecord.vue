<template>
    <div class="administrator-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 h3 d-flex justify-content-center">Hospital Registration</h4>
                    <form class="needs-validation mb-5 pb-5 col-md-8 offset-md-2" novalidate @submit.prevent="handleRegisterHospitalRquest">
                        <div v-if="errors.message" class="d-flex justify-content-center alert alert-danger" role="alert">
                            {{errors.message}}
                        </div>
                        
                        <div class="mb-3">
                            <label class="d-flex justify-content-left mb-0">Hospital ID</label>
                            <input type="text" @input="updateErrorStatusOnInput('userId')" class="form-control" v-model="form.userId" required style="text-align: center;">
                            <small v-if="errors.userId" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.userId}}</small>
                        </div>

                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label class="d-flex justify-content-left mb-0">Name</label>
                                <input type="text" @input="updateErrorStatusOnInput('name')" class="form-control" v-model="form.name" required>
                                <small v-if="errors.name" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.name}}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Registration Number</label>
                                <input type="text" @input="updateErrorStatusOnInput('registrationNumber')" v-model="form.registrationNumber" class="form-control" required>
                                <small v-if="errors.registrationNumber" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.registrationNumber}}</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Account Type</label>
                                <input type="text" @input="updateErrorStatusOnInput('accountType')" v-model="form.accountType" readonly class="form-control" required>
                                <small v-if="errors.accountType" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.accountType}}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Email</label>
                                <input type="email" @input="updateErrorStatusOnInput('email')" class="form-control"  v-model="form.email" required>
                                <small v-if="errors.email" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.email}}</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Phone</label>
                                <input type="text" @input="updateErrorStatusOnInput('mobile')" class="form-control"  v-model="form.mobile" required>
                                <small v-if="errors.mobile" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.mobile}}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label class="d-flex justify-content-left mb-0">Address</label>
                                <textarea v-model="form.contactAddress" @input="updateErrorStatusOnInput('contactAddress')" class="form-control" required></textarea>
                                <small v-if="errors.contactAddress" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.contactAddress}}</small>
                            </div>
                        </div>
        
                        <hr class="mb-4">
                        <button v-if="!isLoading" class="btn btn-success btn-block  pt-3 pb-2" type="submit">Register</button>
                        <button v-else class="btn btn-success btn-block  pt-3 pb-2" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>

                            <div class="form-group d-flex justify-content-center">
                            <router-link 
                                :to="{
                                    name: 'administrator_dashboard'
                                }" 
                                class="btn btn-secondary btn-sm  pt-2 pb-2 pr-5 pl-5 mt-4"
                            >
                                Cancel
                            </router-link>
                        </div>
                    </form>
                    <form @submit.prevent="sendEmail">
                        <input type="hidden" id="message" name="message">
                        <button type="submit" ref="submitButton" ></button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import AdminMenu from './AdminMenu'
    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 

    // import { mailgun } from '../../mailgun'
    import { getHospitalAccountCreatedEmail } from '../../helpers/emailManager'
    import emailjs from 'emailjs-com';
    import { emailjsconfig } from '../../emailjsconfig'

    export default {
        name: 'CreateHospitalRecord',
        components: {
            'app-menu': AdminMenu
        },

        data() {
            return {
                form: {
                    userId: '',
                    name: '',
                    registrationNumber: '',
                    accountType: 'hospital',
                    email: '',
                    mobile: '',
                    contactAddress: ''
                },
                errors: {
                    userId: '',
                    name: '',
                    registrationNumber: '',
                    accountType: '',
                    email: '',
                    mobile: '',
                    contactAddress: '',
                    message: ''
                },
                isLoading: false,
                blockchainHealthRecord: null,
                web3: null,
                message: ""
            }
        },

        methods: {
            handleRegisterHospitalRquest() {
                this.isLoading = true;
                if (! this.validateForm()) {
                    this.isLoading = false; 
                    return;
                }

                if (!this.web3.utils.isAddress(this.form.userId)) {
                    this.errors.message = "Invalid hospital ID, ensure you use a valid hospital ID"
                    this.errors.userId = "The ID supplied is invalid"
                    this.isLoading = false; 
                    return;
                }

                this.blockchainHealthRecord.methods.createHospitalAccount(
                    this.form.userId, 
                    this.form.accountType, 
                    this.form.name, 
                    this.form.contactAddress,
                    this.form.registrationNumber, 
                    this.form.mobile,
                    this.form.email
                ).send({from: this.form.userToken })
                    .then((receipt) => {
                        const response = receipt.events.AccountCreationFailed || receipt.events.HospitalAccount
                        if (response.returnValues.errorMessage) {
                            this.errors.message = response.returnValues.errorMessage
                            this.isLoading = false
                        } else {
                            document.querySelector("#message").value = getHospitalAccountCreatedEmail(this.form.name, this.form.email, this.form.userId)                    
                            this.$refs.submitButton.click();
                            alert("Hospital record was created successfully")
                            this.isLoading = false
                            this.$router.push({ name: "administrator_dashboard"}) 
                        }
                    }).catch((err)=>{
                        this.isLoading = false
                        console.log("CREATE HOSPITAL STAFF ACCOUNT API ERROR: ", err) 
                     })
            },

             validateForm() {
                 if (!this.form.userId) {
                     this.errors.userId = "Hospital ID is required!"
                 }

                 if (!this.form.registrationNumber) {
                     this.errors.registrationNumber = "Registration number is required!"
                 }

                 if (!this.form.accountType) {
                     this.errors.accountType = "Account type is required!"
                 }

                 if (!this.form.email) {
                     this.errors.email = "Email is required!"
                 }

                 if (!this.form.name) {
                     this.errors.name = "Name is required!"
                 }

                 if (!this.form.mobile) {
                     this.errors.mobile = "Phone number is required!"
                 }

                 if (!this.form.contactAddress) {
                     this.errors.contactAddress = "Address is required!"
                 }

                if(
                    this.form.userId && this.form.name && this.form.registrationNumber && 
                    this.form.accountType && this.form.email && this.form.mobile && this.form.contactAddress 
                ) {
                     return true
                 } else {
                     return false;
                 }
             },

            updateErrorStatusOnInput(fieldName) {
                if(this.form[fieldName].toString().length > 0){
                    this.errors[fieldName] = ""
                    this.errors.message = ""
                }
            },


            sendEmail: (e) => {
                 emailjs.sendForm(emailjsconfig.service_id, emailjsconfig.template_id, e.target, emailjsconfig.user_id)
                   .then((result) => {
                       console.log('SUCCESS!', result.status, result.text);
                   }, (error) => {
                       console.log('FAILED...', error);
                   });
            }

        },

        created() {
            this.web3 = window.web3
        },

        async mounted() {
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

    .administrator-dashboard {
        width: 100% !important;
    }
</style>
