<template>
    <div class="hospital-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 h3 d-flex justify-content-center">{{`${loggedUser.name}'s Activities`}}</h4>
                    <div class="row pr-3 pl-3 d-flex justify-content-left">
                        <!-- <div class="row"> -->
                            <!-- <div class="col-md-6 col-sm-6 col-lg-6 col-xl-3"> -->
                                <!-- <div class="dash-widget"> -->
                                    <!-- <span class="dash-widget-bg1"><i class="fa fa-stethoscope" aria-hidden="true"></i></span> -->
                                    <!-- <div class="dash-widget-info text-right"> -->
                                        <!-- <h3>98</h3> -->
                                        <!-- <span class="widget-title1">Doctors <i class="fa fa-check" aria-hidden="true"></i></span> -->
                                    <!-- </div> -->
                                <!-- </div> -->
                            <!-- </div> -->
                            <div class="col-md-6 col-sm-6 col-lg-4 col-xl-4">
                                <div class="dash-widget"  style="background: #d4edda;">
                                    <span class="dash-widget-bg2"><i class="fa fa-users"></i></span>
                                    <div class="dash-widget-info text-right">
                                        <h3>{{attendedPatientCount}}</h3>
                                        <span class="widget-title2">Patients Attended <i class="fa fa-check" aria-hidden="true"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-6 col-lg-4 col-xl-4">
                                <div class="dash-widget"  style="background: #e2e3e5;">
                                    <span class="dash-widget-bg3"><i class="fa fa-user-md" aria-hidden="true"></i></span>
                                    <div class="dash-widget-info text-right">
                                        <h3>{{scheduledAppointment}}</h3>
                                        <span class="widget-title3">Scheduled Appointments <i class="fa fa-check" aria-hidden="true"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-6 col-lg-4 col-xl-4">
                                <div class="dash-widget" style="background: #fff3cd;">
                                    <span class="dash-widget-bg4"><i class="fa fa-tasks" aria-hidden="true"></i></span>
                                    <div class="dash-widget-info text-right">
                                        <h3>{{todaysAppointment}}</h3>
                                        <span class="widget-title4">Today's Appoinment <i class="fa fa-check" aria-hidden="true"></i></span>
                                    </div>
                                </div>
                            </div>
                        <!-- </div> -->
                        <div v-if="approvedPMRRequest.length > 0" class="col-12 pt-3">
                            <h3 class="h4 d-flex justify-content-center">Approved Patient Record Access Request</h3>
                            <hr class="mb-2">
                            <div class="col-md-8 offset-md-2">
                                <ul class="list-group list-group-flush mt-3 mb-5">
                                    <li 
                                        class="list-group-item d-flex justify-content-center mb-2"
                                        v-for="(approvedPMRAR, index) in approvedPMRRequest"
                                        :key="getIntFromBN(approvedPMRAR.id)"
                                        :class="{
                                            'list-group-item-success': index%2 === 0,
                                            'list-group-item-info': index%2 !== 0
                                        }"
                                    >
                                        <strong class="pr-2">{{getPatient(approvedPMRAR.patient) ? getPatient(approvedPMRAR.patient).name + "  " : ""}}</strong> has approved access to {{getPatient(approvedPMRAR.patient) ? getPatient(approvedPMRAR.patient).gender === 'male' ? 'his' : 'her' : ''}} medical record.
                                    </li>
                                </ul>
                            </div>
                            <hr class="mb-3">
                        </div>

                        <div class="col-md-10 offset-md-1 pt-3 mb-5">
                            <h3 class="h4 d-flex justify-content-l">Appointments</h3>
                            <hr class="mb-2">
                            <div class="col-md-12">
                                <div v-if="todaysAppointment <= 0" class="jumbotron d-flex justify-content-center">
                                    Appointment list for today is empty
                                </div>
                                <table v-else class="table table-striped">
                                  <thead>
                                    <tr>
                                      <th scope="col">#</th>
                                      <th scope="col">Name</th>
                                      <th scope="col">Gender</th>
                                      <th scope="col">Age</th>
                                      <th scope="col">Purpose</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr
                                        v-for="(appointment, index) in appointments"
                                        :key="index"
                                    >
                                      <th scope="row">{{ index+1 }}</th>
                                      <td style="text-transform: capitalize; display: flex; align-items: center; justify-content: center;">
                                          <img src="../../assets/user.jpg" class="rounded-circle m-r-5 mr-2" alt="" width="28" height="28">
                                          {{ getApptmtPatient(appointment.patient) ? getApptmtPatient(appointment.patient).name : '' }}
                                      </td>
                                      <td style="text-transform: capitalize;">{{ getApptmtPatient(appointment.patient) ? getApptmtPatient(appointment.patient).gender : '' }}</td>
                                      <td style="text-transform: capitalize;">{{ getApptmtPatient(appointment.patient) ? computePatientAge(getApptmtPatient(appointment.patient).dateOfBirth) : ''}}</td>
                                      <td style="text-transform: capitalize;">{{ appointment.purpose }}</td>
                                    </tr>
                                  </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="col-md-10 offset-md-1 pt-3 mb-5">
                            <h3 class="h4 d-flex justify-content-l">Patients</h3>
                            <hr class="mb-2">
                            <div class="col-md-12">
                                <div v-if="attendedPatientCount <= 0" class="jumbotron d-flex justify-content-center">
                                    No patient has been attended to today.
                                </div>
                                <table v-else class="table table-striped">
                                  <thead>
                                    <tr>
                                      <th scope="col">#</th>
                                      <th scope="col">Name</th>
                                      <th scope="col">Gender</th>
                                      <th scope="col">Age</th>
                                      <th scope="col">Phone</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr
                                        v-for="(patient, index) in attendedPatients"
                                        :key="index"
                                    >
                                      <th scope="row">{{ index+1 }}</th>
                                      <td style="text-transform: capitalize; display: flex; align-items: center; justify-content: left;">
                                          <img src="../../assets/user.jpg" class="rounded-circle m-r-5 mr-2" alt="" width="28" height="28">
                                          {{ patient.name }}
                                      </td>
                                      <td style="text-transform: capitalize;">{{ patient.gender}}</td>
                                      <td style="text-transform: capitalize;">{{ computePatientAge(patient.dateOfBirth)}}</td>
                                      <td style="text-transform: capitalize;">{{ patient.mobile }}</td>
                                    </tr>
                                  </tbody>
                                </table>
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
    import HospitalMenu from './HospitalMenu'

    import { getIntFromBN } from '../../helpers/getIntFromBN'
    import { getTodayDate } from '../../helpers/getTodayDate'     

    export default {
        name: 'Dashboard',
        components: {
            'app-menu': HospitalMenu
        },

        data() {
            return {
                hospital: 0,
                attendedPatientCount: 0,
                scheduledAppointment: 0,
                todaysAppointment: 0,
                approvedPMRRequest: [],
                patients: [],
                appointments: [],
                appointmentPatients: [],
                attendedPatients: []
            }
        },

        computed: {
            loggedUser() {
                return this.$store.getters.loggedUser
            }
        },

        methods: {
            getIntFromBN(numBN) {
                return getIntFromBN(numBN)
            },

            getTodayDate() {
                return getTodayDate()
            },

            getApptmtPatient(patientID) {
                let selectedPatient = null
                this.appointmentPatients.map((patient) => {
                    if (this.getIntFromBN(patientID) === this.getIntFromBN(patient.id)) {
                        selectedPatient = patient
                    }
                })
                return selectedPatient
            },

            getPatient(patientID) {
                let selectedPatient = null
                this.patients.map((patient) => {
                    if (this.getIntFromBN(patientID) === this.getIntFromBN(patient.id)) {
                        selectedPatient = patient
                    }
                })
                return selectedPatient
            },

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
        },

        async created() {
            this.hospital = parseInt(this.$route.params.hospitalId)

            this.web3 = window.web3
            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                gas: 450000,
                gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            })

            const todaysDate = this.getTodayDate()
            const patientMedicalRecordCount = await this.blockchainHealthRecord.methods.patientMedicalRecordCount().call()
            for (let i=patientMedicalRecordCount; i>0; i--) {
                const patientMedicalRecord = await this.blockchainHealthRecord.methods.patientMedicalRecords(i).call()
                if (
                        this.getIntFromBN(patientMedicalRecord.hospital) === this.hospital &&
                        this.getIntFromBN(patientMedicalRecord.doctor) === this.getIntFromBN(this.loggedUser.id) &&
                        patientMedicalRecord.date === todaysDate
                    ) {
                    this.attendedPatientCount++
                    const targetPatient = await this.blockchainHealthRecord.methods.patients(this.getIntFromBN(patientMedicalRecord.patient)).call()
                    this.attendedPatients.push(targetPatient)
                }
            }

            const appointmentCount = await this.blockchainHealthRecord.methods.appointmentCount().call()
            for (let i=appointmentCount; i>0; i--) {
                const appointment = await this.blockchainHealthRecord.methods.appointments(i).call()
                if (
                        this.getIntFromBN(appointment.hospital) === this.hospital &&
                        appointment.date === todaysDate
                    ) {
                    this.scheduledAppointment++
                }

                if (
                        this.getIntFromBN(appointment.hospital) === this.hospital &&
                        appointment.dueDate === todaysDate
                    ) {
                    this.appointments.push(appointment)
                    this.todaysAppointment++
                    const targetPatient = await this.blockchainHealthRecord.methods.patients(this.getIntFromBN(appointment.patient)).call()
                    this.appointmentPatients.push(targetPatient)
                }
            }

            const PMRAccessRequestCount = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequestCount().call()
            for (let i=1; i<=PMRAccessRequestCount; i++) {
                const targetPMRAccessRequest = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequests(i).call()
                if (
                    this.getIntFromBN(targetPMRAccessRequest.hospital) === this.hospital &&
                    targetPMRAccessRequest.date === todaysDate &&
                    targetPMRAccessRequest.approved
                ) {
                    this.approvedPMRRequest.push(targetPMRAccessRequest)
                }
            }

            const patientCount = await this.blockchainHealthRecord.methods.patientCount().call()
            for (let i=1; i<=patientCount; i++) {
            const targetPatient = await this.blockchainHealthRecord.methods.patients(i).call()
            this.patients.push(targetPatient)
            }
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

    .hospital-dashboard {
        width: 100% !important;
    }

    .dash-widget {
        background-color: #fff; border-radius: 4px; margin-bottom: 30px; padding: 20px; position: relative; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    }

    .dash-widget-bg1 {
        width: 65px; float: left; color: #fff; display: block; font-size: 50px; text-align: center; line-height: 65px; background: #009efb; border-radius: 50%; font-size: 40px; height: 65px;
    }

    .dash-widget-bg2 {
        width: 65px; float: left; color: #fff; display: block; font-size: 50px; text-align: center; line-height: 65px; background: #155724; border-radius: 50%; font-size: 40px; height: 65px;
    }

    .dash-widget-bg3 {
        width: 65px; float: left; color: #fff; display: block; font-size: 50px; text-align: center; line-height: 65px; background: #383d41; border-radius: 50%; font-size: 40px; height: 65px;
    }

    .dash-widget-bg4 {
        width: 65px; float: left; color: #fff; display: block; font-size: 50px; text-align: center; line-height: 65px; background: #856404; border-radius: 50%; font-size: 40px; height: 65px;
    }

    .dash-widget-info > h3 {
        font-size: 24px; font-weight: 500; margin-bottom: 0.5rem;
    }
    .dash-widget-info span i {
        width: 16px; background: #fff; border-radius: 50%; color: #666666; font-size: 9px; height: 16px; line-height: 16px; text-align: center; margin-left: 5px;
    }
    .dash-widget-info > span.widget-title1 {
        background: #009efb; color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 13px;
    }
    .dash-widget-info > span.widget-title2 {
        background: #155724; color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 13px;
    }
    .dash-widget-info > span.widget-title3 {
        background: #383d41; color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 13px;
    }
    .dash-widget-info > span.widget-title4 {
        background: #856404; color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 13px;
    }
</style>