<template>
    <div class="administrator-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu 
                    :hospitalId="parseInt(hospitalId, 10)"
                    :showCreateHospitalStaff="false"
                ></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 h3 d-flex justify-content-center">Create Hospital Staff Record</h4>
                    <form class="needs-validation mb-5 pb-5 col-md-8 offset-md-2" novalidate @submit.prevent="createHospitalStaffRecord">
                        <div v-if="errors.message" class="d-flex justify-content-center alert alert-danger" role="alert">
                            {{errors.message}}
                        </div>
                        
                        <div class="mb-3">
                            <label class="d-flex justify-content-left mb-0">Hospital Staff ID</label>
                            <input type="text" @input="updateErrorStatusOnInput('userId')" class="form-control" v-model="form.userId" required style="text-align: center;">
                            <small v-if="errors.userId" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.userId}}</small>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Name</label>
                                <input type="text" @input="updateErrorStatusOnInput('name')" class="form-control" v-model="form.name" required>
                                <small v-if="errors.name" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.name}}</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Gender</label>
                                <select @change="updateErrorStatusOnInput('gender')" class="form-control" v-model="form.gender" required>
                                    <option value="">Select Category</option>
                                    <option 
                                        v-for="(item,index) in genderCollection" 
                                        :key="index"
                                        :value="item"
                                    >{{item}}</option>
                                </select>
                                <small v-if="errors.gender" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.gender}}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Email</label>
                                <input type="email" v-model="form.email" @input="updateErrorStatusOnInput('email')" class="form-control" required />
                                <small v-if="errors.email" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.email}}</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Password</label>
                                <input type="text" @input="updateErrorStatusOnInput('registrationNumber')" v-model="form.password" class="form-control" required>
                                <small v-if="errors.password" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.password}}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Phone</label>
                                <input type="text" @input="updateErrorStatusOnInput('mobile')" class="form-control"  v-model="form.mobile" required>
                                <small v-if="errors.mobile" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.mobile}}</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="d-flex justify-content-left mb-0">Account Type</label>
                                <input type="text" @input="updateErrorStatusOnInput('accountType')" v-model="form.accountType" readonly class="form-control" required>
                                <small v-if="errors.accountType" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.accountType}}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label class="d-flex justify-content-left mb-0">Hospital ID</label>
                                <input type="text" @input="updateErrorStatusOnInput('hospitalId')" class="form-control" readonly v-model="hospitalId" required>
                                <small v-if="errors.hospitalId" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.hospitalId}}</small>
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
                                    name: 'view_hospital_record',
                                    params: {
                                        hospitalId: hospitalId
                                    }
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
    import AdminMenu from './AdminHospitalMenu'

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 

    import { getHospitalStaffAccountCreatedEmail } from '../../helpers/emailManager'
    import emailjs from 'emailjs-com';
    import { emailjsconfig } from '../../emailjsconfig'

    export default {
        name: 'EditHospitalRecord',
        components: {
            'app-menu': AdminMenu
        },

        data() {
            return {
                hospitalId: null,
                form: {
                    name: '',
                    userId: '',
                    password: 'P@$$w0rd',
                    mobile: '',
                    email: '',
                    accountType: 'hospital staff',
                    gender: ''
                },
                errors: {
                    name: '',
                    userId: '',
                    password: '',
                    mobile: '',
                    email: '',
                    accountType: '',
                    gender: '',
                    hospitalId: '',
                    message: ''
                },
                isLoading: false,
                blockchainHealthRecord: null,
                web3: null,
                genderCollection: ["male", "female"]
            }
        },

        methods: {
            createHospitalStaffRecord() {
                this.isLoading = true;
                if (!this.validateForm()) {
                    this.isLoading = false; 
                    return;
                }

                if (!this.web3.utils.isAddress(this.form.userId)) {
                    this.errors.message = "Invalid hospital ID, ensure you use a valid hospital ID"
                    this.errors.userId = "The ID supplied is invalid"
                    this.isLoading = false; 
                    return;
                }

                this.blockchainHealthRecord.methods.createHospitalStaffAccount(
                    this.form.name,
                    this.form.userId,
                    this.form.password,
                    this.form.mobile,
                    this.form.email,
                    this.form.accountType,
                    this.form.gender,
                    this.hospitalId
                ).send({from: this.form.userToken })
                    .then((receipt) => {
                        const response = receipt.events.AccountCreationFailed || receipt.events.HospitalStaffAccount
                        if (response.returnValues.errorMessage) {
                            this.errors.message = response.returnValues.errorMessage
                            this.isLoading = false
                        } else {
                            document.querySelector("#message").value = getHospitalStaffAccountCreatedEmail(this.form.name, this.form.email, this.form.userId, this.form.password, this.hospitalId)
                            this.$refs.submitButton.click();
                            this.isLoading = false
                            this.$router.push({ 
                                name: "view_hospital_record",
                                params: {
                                    hospitalId: this.hospitalId
                                }
                            })
                        }
                    }).catch((err)=>{
                        this.isLoading = false
                        console.log("CREATE HOSPITAL ACCOUNT API ERROR: ", err) 
                    })
            },

            validateForm() {
                 if (!this.form.userId) {
                     this.errors.userId = "Hospital staff ID is required!"
                 }

                 if (!this.form.name) {
                     this.errors.name = "Name is required!"
                 }

                 if (!this.form.gender) {
                     this.errors.gender = "Gender is required!"
                 }

                 if (!this.form.password) {
                     this.errors.password = "Password is required!"
                 }

                 if (!this.form.accountType) {
                     this.errors.accountType = "Account type is required!"
                 }

                 if (!this.hospitalId) {
                    this.errors.hospitalId = "Hospital ID type is required!"
                }

                 if (!this.form.mobile) {
                     this.errors.mobile = "Phone number is required!"
                 }

                 if (!this.form.email) {
                     this.errors.email = "Email is required!"
                 }

                if(
                    this.form.name && this.form.userId && this.form.password && this.form.mobile && this.form.email && this.form.accountType && this.form.gender && this.hospitalId   
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
            this.hospitalId = this.$route.params.hospitalId
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
