<template>
    <div class="hospital-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 h3 d-flex justify-content-center">{{requestCreatePatientAccount ? 'Patient Registration' : 'Patient Medical Record Manager'}}</h4>
                    <div v-if="!hasBeenSearched" class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div class="jumbotron">
                                <form class="needs-validation mb-5" novalidate @submit.prevent="searchForPatientRecord">
                                    <h4 class="h4 mb-3 d-flex justify-content-center">Search for Patient Record</h4>

                                    <div class="col-md-8 offset-md-2">
                                        <label for="username">Patient ID</label>
                                        <input type="text" @input="updateErrorStatusOnInput('searchParams')" class="form-control" v-model="form.searchParams" required style="text-align: center;">
                                        <small v-if="errors.searchParams" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.searchParams}}</small>
                                    </div>

                                    <div class="form-group d-flex justify-content-center mt-5">
                                        <button v-if="!isLoading" class="btn btn-success btn-lg" type="submit">Search</button>
                                        <button v-else class="btn btn-success btn-lg" type="button" disabled>
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div v-if="hasBeenSearched && !isEmptyObject(patient)" class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div class="jumbotron">
                                <div class="row">
                                    <div class="col-md-6 offset-md-3 flex-align-content">
                                        <img class="mr-3" width='50' height='50' :src="getAccountImage(patient)" alt="" />
                                        <span style="font-weight: bold; font-size: 25px;">{{patient.name}}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 offset-md-3 d-flex justify-content-center pt-5 pb-5">
                                        <span v-if="!patientMedicalRecordAccessRequested.approved"><i class="fas fa-lock fa-7x text-secondary"></i></span>
                                        <span v-if="patientMedicalRecordAccessRequested.approved"><i class="fas fa-lock-open fa-7x text-success"></i></span>
                                    </div>                                    
                                </div>
                                <div class="row">
                                    <div class="col-md-6 offset-md-3 d-flex justify-content-center">
                                        <div v-if="!patientMedicalRecordAccessRequested.approved && !requestedApprovalFromPatient" class="form-group d-flex justify-content-center mt-5">
                                            <button v-if="!isProcessingRequest" @click="handleRequestAccessToPMR(getIntFromBN(hospital.id), getIntFromBN(patient.id))" class="btn btn-warning btn-lg">Request access to Patient Medical Records</button>
                                            <button v-else class="btn btn-warning btn-lg" type="button" disabled>
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Initiating Request...
                                            </button>
                                        </div>
                                        <div v-if="!patientMedicalRecordAccessRequested.approved && requestedApprovalFromPatient" class="form-group d-flex justify-content-center mt-5">
                                            <button disabled class="btn btn-secondary btn-lg">Pending Request</button>
                                        </div>
                                        <div v-if="patientMedicalRecordAccessRequested.approved" class="form-group d-flex justify-content-center mt-5">
                                            <router-link 
                                                :to="{
                                                    name: 'hospital_patient_medical_records',
                                                    params: {
                                                        hospitalId: getIntFromBN(hospital.id),
                                                        doctorId: getIntFromBN(loggedUser.id),
                                                        patientId: getIntFromBN(patient.id)
                                                    }
                                                }"  
                                                class="btn btn-success btn-lg" 
                                            >
                                                View Patient Medical Records
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="hasBeenSearched && isEmptyObject(patient)" class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div class="jumbotron">     
                                <div v-if="!requestCreatePatientAccount" class="row" style="text-align: center;">
                                    <div class="col-8 offset-2 d-flex justify-content-center">No result for &nbsp; <span style="font-style: italic; padding-left: 5px;">&quot;{{form.searchParams}}&quot;</span></div>

                                    <div class="col-6 offset-3 d-flex justify-content-center mt-4">
                                            <button @click="searchAgain" class="btn btn-secondary mr-5">Search Again</button>
                                            <button @click="showPatientRegistrationForm" class="btn btn-success ml-5">Register Patient</button>
                                    </div>
                                </div>
                                <div v-if="requestCreatePatientAccount" class="row">
                                    <form class="needs-validation mb-2 pb-3 col-md-8 offset-md-2" novalidate @submit.prevent="createPatientRecord">
                                        <div v-if="errors.message" class="d-flex justify-content-center alert alert-danger" role="alert">
                                            {{errors.message}}
                                        </div>

                                        <div class="mb-3">
                                            <label class="d-flex justify-content-left mb-0">Patient ID</label>
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
                                                <label class="d-flex justify-content-left mb-0">Password</label>
                                                <input type="text" @input="updateErrorStatusOnInput('registrationNumber')" v-model="form.password" class="form-control" required>
                                                <small v-if="errors.password" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.password}}</small>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="d-flex justify-content-left mb-0">Account Type</label>
                                                <input type="text" @input="updateErrorStatusOnInput('accountType')" v-model="form.accountType" readonly class="form-control" required>
                                                <small v-if="errors.accountType" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.accountType}}</small>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="d-flex justify-content-left mb-0">Date of Birth</label>
                                                <input type="date" @change="updateErrorStatusOnInput('dateOfBirth')" class="form-control" v-model="form.dateOfBirth" required>
                                                <small v-if="errors.dateOfBirth" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.dateOfBirth}}</small>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="d-flex justify-content-left mb-0">Email</label>
                                                <input type="email" @input="updateErrorStatusOnInput('email')" class="form-control"  v-model="form.email" required>
                                                <small v-if="errors.email" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.email}}</small>
                                            </div>
                                        </div>
                                        <hr class="mb-4">
                                        <button v-if="!isLoading" class="btn btn-success btn-block  pt-3 pb-2" type="submit">Register</button>
                                        <button v-else class="btn btn-success btn-block  pt-3 pb-2" type="button" disabled>
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                        <div class="form-group d-flex justify-content-center">
                                            <button
                                                class="btn btn-secondary btn-sm  pt-2 pb-2 pr-5 pl-5 mt-4"
                                                @click="cancelPatientRegistration"
                                            >
                                                Cancel
                                            </button>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import Identicon from 'identicon.js'

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 
    import HospitalMenu from './HospitalMenu'
    import { isEmptyObject } from '../../helpers/isEmptyObject'
    import { getTodayDate } from '../../helpers/getTodayDate'
    import { getIntFromBN } from '../../helpers/getIntFromBN'

    import { getPatientMessageBody } from '../../helpers/emailManager'
    import emailjs from 'emailjs-com';
    import { emailjsconfig } from '../../emailjsconfig'

    // import { mailgun } from '../../mailgun'

    export default {
        name: 'AccessRequestToPatientMedicalRecord',
        components: {
            'app-menu': HospitalMenu
        },

        data() {
            return {
                form: {
                    searchParams: '',

    
                    userId: '',
                    name: '',
                    dateOfBirth: '',
                    password: 'P@$$w0rd',
                    email: '',
                    accountType: 'patient',
                    gender: ''
                },
                errors: {
                    searchParams: '',
                    message: '',
                    userId: '',
                    name: '',
                    dateOfBirth: '',
                    password: '',
                    email: '',
                    accountType: '',
                    gender: ''
                },

                patient: {},
                patientMedicalRecordAccessRequested: {},

                hasBeenSearched: false,
                requestCreatePatientAccount: false,
                requestedApprovalFromPatient: false,

                isLoading: false,
                isProcessingRequest: false,
                blockchainHealthRecord: null,
                web3: null,
                genderCollection: ["male", "female"]
            }
        },

        methods: {
            sendEmail: (e) => {
                 emailjs.sendForm(emailjsconfig.service_id, emailjsconfig.template_id, e.target, emailjsconfig.user_id)
                   .then((result) => {
                       console.log('SUCCESS!', result.status, result.text);
                   }, (error) => {
                       console.log('FAILED...', error);
                   });
            },

            createPatientRecord() {
                this.isLoading = true;
                if (!this.validateForm()) {
                    this.isLoading = false; 
                    return;
                }

                if (!this.web3.utils.isAddress(this.form.userId)) {
                    this.errors.message = "Invalid patient ID, ensure you use a valid patient ID"
                    this.errors.userId = "Invalid patient ID"
                    this.isLoading = false; 
                    return;
                }

                this.blockchainHealthRecord.methods.createPatientAccount(
                    this.form.userId,
                    this.form.name,
                    this.form.dateOfBirth,
                    this.form.password,
                    this.form.email,
                    this.form.accountType,
                    this.form.gender
                ).send({from: this.form.userToken })
                    .then((receipt) => {
                        const response = receipt.events.AccountCreationFailed || receipt.events.PatientAccount
                        if (response.returnValues.errorMessage) {
                            this.errors.message = response.returnValues.errorMessage
                            this.isLoading = false
                        } else {
                            document.querySelector("#message").value = getPatientMessageBody(this.form.name, this.form.userId, this.form.password, this.hospital,  this.loggedUser.name, this.form.email)
                            this.$refs.submitButton.click();
                            this.isLoading = false
                            this.patient = response.returnValues
                            this.hasBeenSearched = true
                            this.requestCreatePatientAccount = false
                        }
                    }).catch((err)=>{
                        this.isLoading = false
                        console.log("CREATE PATIENT ACCOUNT API ERROR: ", err) 
                    })

            },

            validateForm() {
                 if (!this.form.userId) {
                     this.errors.userId = "Patient ID is required!"
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
                 if (!this.form.email) {
                     this.errors.email = "Email is required!"
                 }
                 if (!this.form.dateOfBirth) {
                     this.errors.dateOfBirth = "Date of Birth is required!"
                 }
                if(
                    this.form.name && this.form.userId && this.form.password && this.form.email && this.form.dateOfBirth && this.form.accountType && this.form.gender   
                ) {
                    return true
                } else {
                    return false;
                }
            },

            async searchForPatientRecord() {
                this.isLoading = true; 
                if (!this.form.searchParams) {
                    this.errors.searchParams = "Patient ID is required to retrieve patient details"
                    this.isLoading = false; 
                    return
                }

                if (!this.web3.utils.isAddress(this.form.searchParams)) {
                   this.errors.message = "Invalid patient ID, ensure you use a valid patient ID"
                   this.errors.searchParams = "Invalid patient ID"
                   this.isLoading = false; 
                   return;
                }

                const patientCount = await this.blockchainHealthRecord.methods.patientCount().call()
                for (let i=1; i<=patientCount; i++) {
                    const targetPatient = await this.blockchainHealthRecord.methods.patients(i).call()
                    if (targetPatient.userId === this.form.searchParams) {
                        this.patient = targetPatient
                    }
                }

                this.hasBeenSearched = true
                this.isLoading = false; 
            },

            updateErrorStatusOnInput(fieldName) {
                if(this.form[fieldName].toString().length > 0){
                    this.errors[fieldName] = ""
                    this.errors.message = ""
                }
            },

            isEmptyObject(patient) {
                return isEmptyObject(patient)
            },

            getAccountImage(userInstance) {
                return `data:image/png;base64, ${new Identicon(userInstance.userId + userInstance.name, 30).toString()}`
            },

            getIntFromBN(numBN) {
                return getIntFromBN(numBN)
            },

            async handleRequestAccessToPMR(hospitalId, patientId) {
                this.isProcessingRequest = true
                const dateInstance = this.getTodayDate()

                const PMRAccessRequestCount = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequestCount().call()
                for (let i=1; i<=PMRAccessRequestCount; i++) {
                    const targetPMRAccessRequest = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequests(i).call()
                    
                    if (
                        this.getIntFromBN(targetPMRAccessRequest.hospital) === hospitalId &&
                        this.getIntFromBN(targetPMRAccessRequest.patient) === patientId &&
                        targetPMRAccessRequest.date === dateInstance &&
                        ! targetPMRAccessRequest.rejected
                    ) {
                        this.patientMedicalRecordAccessRequested = targetPMRAccessRequest
                        this.requestedApprovalFromPatient = true
                    }
                }

                if (!this.isEmptyObject(this.patientMedicalRecordAccessRequested)) {
                    this.isProcessingRequest = false
                } else {
                    this.blockchainHealthRecord.methods.createPatientMedicalRecordAccessRequest(
                        this.hospital.id,
                        this.patient.id,
                        dateInstance
                    ).send({from: this.form.userToken })
                        .then((receipt) => {
                            const response = receipt.events.AccountCreationFailed || receipt.events.PatientMedicalRecordAccessRequested
                            if (response.returnValues.errorMessage) {
                                this.errors.message = response.returnValues.errorMessage
                                this.isProcessingRequest = false
                            } else {
                                this.isProcessingRequest = false
                                this.patientMedicalRecordAccessRequested = response.returnValues
                                this.requestedApprovalFromPatient = true
                            }
                        }).catch((err)=>{
                            this.isProcessingRequest = false
                            console.log("CREATE PMR ACCESS REQUEST API ERROR: ", err) 
                        })
                }
            },

            getTodayDate() {
                return getTodayDate()
            },

            searchAgain() {
                this.form.searchParams = ""
                this.hasBeenSearched = false
            },

            showPatientRegistrationForm() {
                this.form.userId = this.form.searchParams
                this.requestCreatePatientAccount = true
            },

            cancelPatientRegistration() {
                this.hasBeenSearched = false
                this.requestCreatePatientAccount = false
            }
        },

        computed: {
            loggedUser() {
                return this.$store.getters.loggedUser
            },

            hospital() {
                return this.$store.getters.hospital
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

    .hospital-dashboard {
        width: 100% !important;
    }

    .flex-align-content{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>