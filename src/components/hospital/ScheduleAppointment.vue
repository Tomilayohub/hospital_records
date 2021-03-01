<template>
    <div class="col-md-12">
        <form class="needs-validation col-md-8 offset-md-2 mb-5 pb-5" novalidate @submit.prevent="createScheduledAppointment">
            <h4 class="h3 mb-3  d-flex justify-content-center">Next Appointment</h4>
            <div v-if="errors.message" class="d-flex justify-content-center alert alert-danger mt-4" role="alert">
                {{errors.message}}
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="mb-0">Purpose</label>
                    <input @input="updateErrorStatusOnInput('purpose')" type="text" class="form-control" v-model="form.purpose" required>
                    <small v-if="errors.purpose" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.purpose}}</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="mb-0">Scheduled Date</label>
                    <input @change="updateErrorStatusOnInput('scheduledDate')" type="date" class="form-control" v-model="form.scheduledDate" required>
                    <small v-if="errors.scheduledDate" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.scheduledDate}}</small>
                </div>
            </div>
            <div class="row">
               <div class="col-md-12 mb-3">
                   <label class="mb-0">Doctor's Note</label>
                   <textarea @input="updateErrorStatusOnInput('doctorsNote')" class="form-control" v-model="form.doctorsNote" required></textarea>
                   <small v-if="errors.doctorsNote" class="form-text text-danger d-flex justify-content-left mb-0">{{errors.doctorsNote}}</small>
               </div>
           </div>           
            <hr class="mb-4">
            <button v-if="!isLoading" class="btn btn-success btn-lg btn-block" type="submit">Schedule Appointment</button>
            <button v-else class="btn btn-success btn-block" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>

            <div class="row">
                <div class="col-md-12 mt-4 d-flex justify-content-center">
                    <button @click="hideScheduleAppointment" class="btn btn-secondary btn-lg">Close</button>
                </div>
            </div>
        </form>
        <hr class="mb-4">
    </div>
</template>

<script>

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json'
    import { getTodayDate } from '../../helpers/getTodayDate'
    import { processDateInput } from '../../helpers/processDateInput'

    export default {
       name: 'ScheduleAppointment',

       data() {
           return {
               isLoading: false,
               form: {
                   purpose: '',
                   doctorsNote: '',
                   scheduledDate: ''
               },
               errors: {
                   purpose: '',
                   doctorsNote: '',
                   scheduledDate: '',
                   message: ''
               },
               hospital: null,
               patient: null,
               blockchainHealthRecord: null,
               web3: null
           }
       },

       methods:{
           hideScheduleAppointment() {
               this.$emit('hideCreateAppointmentView', false)
           },

           createScheduledAppointment() {
                this.isLoading = true;
                if (! this.validateForm()) {
                    this.isLoading = false; 
                    return;
                }

                const dateInstance = getTodayDate()
                const dueDateInstance = processDateInput(this.form.scheduledDate)

                this.blockchainHealthRecord.methods.createScheduledAppointment(
                    parseInt(this.hospital),
                    parseInt(this.patient),
                    dateInstance,
                    dueDateInstance,
                    this.form.purpose,
                    this.form.doctorsNote,
                ).send({from: this.form.userToken })
                    .then((receipt) => {
                        const response = receipt.events.AccountCreationFailed || receipt.events.AppointmentScheduled
                        if (response.returnValues.errorMessage) {
                            this.errors.message = response.returnValues.errorMessage
                            this.isLoading = false
                        } else {
                            this.isLoading = false
                            this.hideScheduleAppointment()
                        }
                    }).catch((err)=>{
                        this.isLoading = false
                        console.log("CREATE APPOINTMENT SCHEDULE API ERROR: ", err) 
                     })
           },

             validateForm() {
                if (!this.form.purpose) {
                     this.errors.purpose = "This field is required!"
                 }

                if (!this.form.scheduledDate) {
                     this.errors.scheduledDate = "This field is required!"
                 }

                if (!this.form.doctorsNote) {
                    this.errors.doctorsNote = "This field is required!"
                }

                if( this.form.purpose && this.form.scheduledDate && this.form.doctorsNote ) {
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
                gas: 450000,
                gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            })
        }

    }
</script>

<style scoped>

</style>