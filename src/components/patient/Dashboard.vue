<template>
    <div class="patient-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 ml-5 pl-5 d-flex justify-content-left">{{loggedUser.name}}'s Dashboard</h4>
                    <div class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div v-if="notifications.length > 0" class="col-12 pt-3">
                                <h3 class="h4 d-flex justify-content-center">Today's Activities ({{todaysDate}})</h3>
                                <hr class="mb-2">
                                <div class="col-md-8 offset-md-2">
                                    <ul class="list-group list-group-flush mt-3 mb-5">
                                        <li 
                                            class="list-group-item d-flex justify-content-center mb-2"
                                            v-for="(notifs, index) in notifications"
                                            :key="index"
                                            :class="{
                                                'list-group-item-success': index%2 === 0,
                                                'list-group-item-warning': index%2 !== 0
                                            }"
                                        >
                                            {{notifs.setMessage(notifs.actor)}}
                                        </li>
                                    </ul>
                                </div>
                                <hr class="mb-3">
                            </div>
                        </div>
                    </div>


                    <div class="col-md-6 offset-md-3 mb-3">
    
                        <h4 class="h3 mb-3 mt-3 d-flex justify-content-center">{{loggedUser.name}}'s Profile</h4>
                        <table class="table table-striped">
                          <tbody>
                            <tr>
                              <th scope="row">Gender</th>
                              <td style="text-transform: capitalize; text-align: right;">{{ loggedUser.gender }}</td>
                            </tr>
                            <tr>
                              <th scope="row">Age</th>
                              <td style="text-transform: capitalize; text-align: right;">{{ computePatientAge(loggedUser.dateOfBirth) }}</td>
                            </tr>
                            <tr>
                              <th scope="row">Email</th>
                              <td style="text-transform: capitalize; text-align: right;">{{ loggedUser.email }}</td>
                            </tr>
                            <tr>
                              <th scope="row">Account Token</th>
                              <td style="text-transform: capitalize; text-align: right;">{{ loggedUser.userId }}</td>
                            </tr>
                          </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json'
    import PatientMenu from './PatientMenu'
    import { getTodayDate } from '../../helpers/getTodayDate'
    import { formatDate } from '../../helpers/formatDate'
    import { getIntFromBN } from '../../helpers/getIntFromBN'
    export default {
        name: 'Dashboard',
        components: {
            'app-menu': PatientMenu
        },

        computed: {
            loggedUser() {
                return this.$store.getters.loggedUser
            }, 

            todaysDate() {
                return formatDate(getTodayDate())
            }
        },

        data() {
            return {
                notifications: [],
                hospitals: []
            }
        },

        methods: {
            computePatientAge(dateOfBirth) {
                const today = new Date()
                const yyyy = today.getFullYear()
                let stringArray = []
                if (dateOfBirth) {
                    stringArray = dateOfBirth.split("-")
                }
                const dobYear = parseInt(stringArray[0], 10)
                return yyyy - dobYear
            },

            getTodayDate() {
                return getTodayDate()
            },

            getIntFromBN(numBN) {
                return getIntFromBN(numBN)
            },

            getHospitalName(hospitalId) {
                let targetHospital = null

                this.hospitals.map((hospital) => {
                    if (Number(hospital.id) === Number(hospitalId)) {
                        targetHospital = hospital
                    }
                })

                if (!targetHospital) {
                    return "Unknown Hospital"
                }
                return targetHospital.name
            },
        },

        async created() {
            this.web3 = window.web3            
            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                gas: 450000,
                gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            })

            const dateInstance = this.getTodayDate()

            const hospitalCount = await this.blockchainHealthRecord.methods.hospitalCount().call()
            for (let i=1; i<=hospitalCount; i++) {
                const hospital = await this.blockchainHealthRecord.methods.hospitals(i).call()
                this.hospitals.push(hospital)
            }

            const PMRAccessRequestCount = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequestCount().call()
            for (let i=1; i<=PMRAccessRequestCount; i++) {
                const targetPMRAccessRequest = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequests(i).call()
                if (
                        this.getIntFromBN(targetPMRAccessRequest.patient) == this.getIntFromBN(this.loggedUser.id) && 
                        targetPMRAccessRequest.date === dateInstance &&
                        !targetPMRAccessRequest.approved && !targetPMRAccessRequest.rejected
                    ) {
                    this.notifications.push({
                        id: this.notifications.length +1,
                        type: 'medical record access request',
                        actor: this.getHospitalName(targetPMRAccessRequest.hospital),
                        setMessage: (subject) => {
                            return `${subject} have requested access to your medical record. Please respond to the request if it is a valid operation.`
                        }
                    })
                }
            }

            const appointmentCount = await this.blockchainHealthRecord.methods.appointmentCount().call()
            for (let i=appointmentCount; i>0; i--) {
                const appointment = await this.blockchainHealthRecord.methods.appointments(i).call()
                if (
                    this.getIntFromBN(appointment.patient) === this.getIntFromBN(this.loggedUser.id) &&
                    appointment.dueDate == dateInstance
                ) {
                    this.notifications.push({
                        id: this.notifications.length +1,
                        type: 'appointment',
                        actor: this.getHospitalName(appointment.hospital),
                        setMessage: (subject) => {
                            return `You have an appointment at ${subject}.`
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

    .patient-dashboard {
        width: 100% !important;
    }
</style>