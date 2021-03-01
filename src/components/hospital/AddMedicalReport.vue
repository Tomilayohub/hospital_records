<template>
    <div class="col-md-12">
        <form class="needs-validation col-md-8 offset-md-2 " novalidate @submit.prevent="createPatientMedicalReport">
            <h4 class="h3 mb-3 d-flex justify-content-center">Create Medical Report</h4>
            <div v-if="errors.message" class="alert alert-danger mt-4 mb-5 d-flex justify-content-center" role="alert">
                {{errors.message}}
            </div>
            <div class="row">
                <h4 class="h5 col-12 mb-0 d-flex"><strong>Vitals</strong></h4>
            </div>
            <hr class="mb-4">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="mb-0">Temperature ( <strong>&deg;C</strong> )</label>
                    <input @input="updateErrorStatusOnInput('temperature')" type="text" class="form-control" v-model="form.temperature" required>
                    <small v-if="errors.temperature" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.temperature}}</small>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="mb-0">Blood Pressure ( <strong>mmHg</strong> )</label>
                    <input @input="updateErrorStatusOnInput('bloodPressure')" type="text" class="form-control" v-model="form.bloodPressure"  required>
                    <small v-if="errors.bloodPressure" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.bloodPressure}}</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="mb-0">Body Weight ( <strong>Kg</strong> )</label>
                    <input @input="updateErrorStatusOnInput('pulse')" type="text" class="form-control" v-model="form.weight" required>
                    <small v-if="errors.weight" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.weight}}</small>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="mb-0">Pulse ( <strong>beat/min</strong> )</label>
                    <input @input="updateErrorStatusOnInput('temperature')" type="text" class="form-control" v-model="form.pulse"  required>
                    <small v-if="errors.pulse" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.pulse}}</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="mb-0">Respiration ( <strong>count/min</strong> )</label>
                    <input @input="updateErrorStatusOnInput('respiration')" type="text" class="form-control" v-model="form.respiration" required>
                    <small v-if="errors.respiration" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.respiration}}</small>
                </div>
            </div>
            <hr>
            <div class="row mt-5">
                <h4 class="h5 col-12 mb-0 d-flex"><strong>Diagnosis</strong></h4>
            </div>
            <hr class="mb-4">
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="mb-0">Patient's Complaint</label>
                    <textarea class="form-control" v-model="form.patientsComplaint" required></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="mb-0">Presenting Symptoms</label>
                    <textarea class="form-control" v-model="form.presentingSymptoms" required></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="mb-0">Test/Other Diagnostic</label>
                    <textarea class="form-control" v-model="form.testOtherDiagnostic" required></textarea>
                </div>
            </div>
            <hr>
           <div class="row mt-5">
               <h4 class="h5 col-12 mb-0 d-flex"><strong>Treatment</strong></h4>
           </div>
           <hr class="mb-4">
            <div class="row">
               <div class="col-md-12 mb-3">
                   <label class="mb-0">Prescription</label>
                   <textarea class="form-control" v-model="form.prescription" required></textarea>
               </div>
           </div>           
            <hr>
           <div class="row mt-5">
               <h4 class="h5 col-12 mb-0 d-flex"><strong>Doctor's Note</strong></h4>
           </div>
           <hr class="mb-4">
            <div class="row">
               <div class="col-md-12 mb-3">
                   <label class="mb-0">Summary</label>
                   <textarea class="form-control" v-model="form.doctorsNote" required></textarea>
               </div>
           </div>           
            <hr class="mb-4">
            <button v-if="!isLoading" class="btn btn-success btn-lg btn-block" type="submit">Create Report</button>
            <button v-else class="btn btn-success btn-block" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </form>
        <div class="row mb-5 pb-5">
            <div class="col-md-12 mt-4 d-flex justify-content-center">
                <button @click="hideAddMedicalView" class="btn btn-secondary btn-lg">Close</button>
            </div>
        </div>
        <hr class="mb-4">
    </div>
</template>

<script>

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 
    import { getTodayDate } from '../../helpers/getTodayDate'

    export default {
       name: 'AddMedicalReport',

       data() {
           return {
               isLoading: false,
               form: {
                   temperature: '',
                   bloodPressure: '',
                   weight: '',
                   pulse: '',
                   respiration: '',
                   patientsComplaint: '',
                   presentingSymptoms: '',
                   testOtherDiagnostic: '',
                   prescription: '',
                   doctorsNote: ''
               },
               errors: {
                    message: '',
                    temperature: '',
                    bloodPressure: '',
                    weight: '',
                    pulse: '',
                    respiration: '',
               },
               vitals: {},
               diagnosis: {},
               treatments: {},
               doctorsNote: {},
               hospital: null,
               patient: null,
               doctor: null,
               blockchainHealthRecord: null,
               web3: null
           }
       },

       methods: {
           hideAddMedicalView() {
                this.$emit('hideAddMedicalReportView', false)
           },

           generatePatientMedicalRecordData() {
                if (this.form.temperature) {
                    this.vitals.temperature = `${this.form.temperature} deg. C`
                }

                if (this.form.bloodPressure) {
                    this.vitals.bloodPressure = `${this.form.bloodPressure} mmHg`
                }

                if (this.form.weight) {
                    this.vitals.weight = `${this.form.weight} mmHg`
                }

                if (this.form.pulse) {
                    this.vitals.pulse = `${this.form.pulse} mmHg`
                }

                if (this.form.respiration) {
                    this.vitals.respiration = `${this.form.respiration} mmHg`
                }

                if (this.form.patientsComplaint) {
                    this.diagnosis["Patient's Complaint"] = this.form.patientsComplaint
                }

                if (this.form.presentingSymptoms) {
                    this.diagnosis['Presenting Symptoms'] = this.form.presentingSymptoms
                }

                if (this.form.testOtherDiagnostic) {
                    this.diagnosis['Test/Other Diagnostic'] = this.form.testOtherDiagnostic
                }

                if (this.form.prescription) {
                    this.treatments['Prescription'] = this.form.prescription
                }

                if (this.form.doctorsNote) {
                    this.doctorsNote['Summary'] = this.form.doctorsNote
                }

                console.log("vitals ==>> ", JSON.stringify(this.vitals))
                console.log("diagnosis ==>> ", JSON.stringify(this.diagnosis))
                console.log("treatments ==>> ", JSON.stringify(this.treatments))
                console.log("doctorsNote ==>> ", JSON.stringify(this.doctorsNote))

           },

           createPatientMedicalReport() {
                this.isLoading = true;
                if (! this.validateForm()) {
                    this.isLoading = false; 
                    return;
                } 

                this.generatePatientMedicalRecordData();
                const dateInstance = getTodayDate()
                
                this.blockchainHealthRecord.methods.createPatientMedicalRecord(
                    parseInt(this.patient),
                    parseInt(this.hospital),
                    parseInt(this.doctor),
                    dateInstance,
                    JSON.stringify(this.vitals),
                    JSON.stringify(this.diagnosis),
                    JSON.stringify(this.treatments),
                    JSON.stringify(this.doctorsNote)
                ).send({from: this.form.userToken })
                    .then((receipt) => {
                        const response = receipt.events.AccountCreationFailed || receipt.events.PatientMedicalRecordDetails
                        if (response.returnValues.errorMessage) {
                            this.errors.message = response.returnValues.errorMessage
                            this.isLoading = false
                        } else {
                            this.isLoading = false
                            this.hideAddMedicalView()
                            location.reload()
                        }
                    }).catch((err)=>{
                        this.isLoading = false
                        console.log("CREATE PATIENT MEDICAL RECORDS API ERROR: ", err) 
                     })
           },

             validateForm() {
                 if (!this.form.temperature) {
                     this.errors.temperature = "This field is required!"
                 }

                 if (!this.form.bloodPressure) {
                     this.errors.bloodPressure = "This field is required!"
                 }

                 if (!this.form.weight) {
                     this.errors.weight = "This field is required!"
                 }

                 if (!this.form.pulse) {
                     this.errors.pulse = "This field is required!"
                 }

                 if (!this.form.respiration) {
                     this.errors.respiration = "This field is required!"
                 }

                if( this.form.temperature && this.form.bloodPressure && this.form.weight && 
                    this.form.pulse && this.form.respiration ) {
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
            }
       },

        created() {
            this.web3 = window.web3

            this.hospital = parseInt(this.$route.params.hospitalId)
            this.patient = parseInt(this.$route.params.patientId)
            this.doctor = parseInt(this.$route.params.doctorId)
        },

        async mounted() {
            const accounts = await this.web3.eth.getAccounts()
            this.form.userToken = accounts[0]
            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                // gas: 450000,
                // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
                gas: 10000000,
                gasLimit: 10000000
            })
        }
    }
</script>

<style scoped>

</style>