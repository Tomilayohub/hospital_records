<template>
    <div class="patient-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 d-flex justify-content-center">Logged in Patient Appointment Logs</h4>
                    <div class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div class="col-12">
                                <div v-if="appointments.length <= 0" class="jumbotron d-flex justify-content-center">
                                    <strong class="h4">Appointment log is empty.</strong>
                                </div>
                                <div v-else class="row" style="list-style: none;">
                                    <div class="col-12">
                                        <h5 class="card-title h3 d-flex justify-content-center">Today's Appointments ({{formatDate(today)}})</h5>
                                    </div>
                                    <div v-if="todaysAppointments.length <= 0" class="col-12  mt-4 mb-5 jumbotron d-flex justify-content-center">
                                        <strong class="h4">Appointment log is empty.</strong>
                                    </div>
                                    <ul v-else class="list-group list-group-flush mt-4 mb-5 col-12">
                                        <li 
                                            class="list-group-item border-0"
                                            v-for="(appointment, index) in todaysAppointments"
                                            :key="index"
                                        >
                                            <div class="card border-0" :class="{'list-group-item-secondary': index%2 === 0}">
                                                <div class="card-body">
                                                    <h5 class="card-title h4">{{appointment.purpose}}</h5>
                                                    <h6 class="card-subtitle mb-2 text-primary">Date: {{formatDate(appointment.dueDate)}}</h6>
                                                    <h6 class="card-subtitle mb-2 text-muted">Last Visit: {{formatDate(appointment.date)}}</h6>
                                                    <h5 v-if="appointment.doctorNote"><strong>Doctor's Note</strong></h5>
                                                    <p class="card-text">
                                                        {{appointment.doctorNote}}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="col-12">
                                        <h4 class="mb-3 h3 d-flex justify-content-center">Appointment Logs</h4>
                                    </div>
                                    <div v-if="otherDaysAppointments.length <= 0" class="col-12  mt-4 mb-5 jumbotron d-flex justify-content-center">
                                        <strong class="h4">Appointment log is empty.</strong>
                                    </div>
                                    <ul v-else class="list-group list-group-flush mt-4 mb-5 col-12" style="margin: 0; padding: 0;">
                                        <li 
                                            class="list-group-item border-0"
                                            v-for="(appointment, index) in otherDaysAppointments"
                                            :key="index"
                                        >
                                            <div class="card border-0" :class="{'list-group-item-secondary': index%2 === 0}">
                                                <div class="card-body">
                                                    <h5 class="card-title h4">{{appointment.purpose}}</h5>
                                                    <h6 class="card-subtitle mb-2 text-primary">Date: {{formatDate(appointment.dueDate)}}</h6>
                                                    <h6 class="card-subtitle mb-2 text-muted">Last Visit: {{formatDate(appointment.date)}}</h6>
                                                    <h5 v-if="appointment.doctorNote"><strong>Doctor's Note</strong></h5>
                                                    <p class="card-text">
                                                        {{appointment.doctorNote}}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
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

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 

    import PatientMenu from './PatientMenu'

    import { getIntFromBN } from '../../helpers/getIntFromBN'
    import { getTodayDate } from '../../helpers/getTodayDate'
    import { formatDate } from '../../helpers/formatDate'

    export default {
        name: 'Dashboard',
        components: {
            'app-menu': PatientMenu
        },

        data() {
            return {
                appointments: [],
                todaysAppointments: [],
                otherDaysAppointments: [],
                patient: null,
                today: ''
            }
        },

        methods: {
            getIntFromBN(numBN) {
                return getIntFromBN(numBN)
            },

            formatDate(date) {
                return formatDate(date)
            },
        },

        async created() {
            this.web3 = window.web3

            this.patient = parseInt(this.$route.params.patientId)
            this.today = getTodayDate()

            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                // gas: 450000,
                // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
                gas: 10000000,
                gasLimit: 10000000
            })

            const appointmentCount = await this.blockchainHealthRecord.methods.appointmentCount().call()
            for (let i=appointmentCount; i>0; i--) {
                const appointment = await this.blockchainHealthRecord.methods.appointments(i).call()
                if (this.getIntFromBN(appointment.patient) === this.patient) {
                    this.appointments.push(appointment)
                }
            }

            this.appointments.map((app)=>{
                if (app.dueDate === this.today) {
                    this.todaysAppointments.push(app)
                } else {
                    this.otherDaysAppointments.push(app)
                }
            })
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

    .patient-dashboard {
        width: 100% !important;
    }
</style>