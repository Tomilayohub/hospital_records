<template>
    <div class="patient-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 d-flex justify-content-center">Logged in Patient Medical History</h4>
                    <div class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div class="col-12">
                                <h4 class="mb-3 h3 mt-3 d-flex justify-content-center">Medical Record Logs</h4>
                            </div>
                            <div class="col-12">
                                <div v-if="patientMedicalRecordDetails.length <= 0" class="jumbotron d-flex justify-content-center">
                                    <strong class="h4">Patient medical log is empty.</strong>
                                </div>
                                <ul v-else class="row" style="list-style: none;">
                                    <li 
                                        class="col-12"
                                        v-for="(record, index) in patientMedicalRecordDetails"
                                        :key="index"
                                    >
                                        <div class="jumbotron d-flex justify-content-center">
                                            <div class="card col-12 bg-transparent border-0">
                                              <div class="card-body">
                                                <h5 class="card-title h3 d-flex justify-content-center">{{formatDate(record.date)}}</h5>
                                                <ul class="list-group list-group-flush">
                                                  <li class="list-group-item bg-transparent h5 border-0"><strong>Hospital :</strong> {{getHospitalName(getIntFromBN(record.hospital))}}</li>
                                                  <li class="list-group-item bg-transparent h5 border-0"><strong>Reporting Doctor :</strong> {{getDoctorName(getIntFromBN(record.doctor, record.hospital))}}</li>
                                                </ul>
                                              </div>
                                              <ul class="list-group list-group-flush">
                                                <li class="list-group-item">
                                                    <div class="h5 pt-3 pb-2"><strong>Vitals</strong></div>
                                                    <table class="table table-striped">
                                                      <tbody>
                                                        <tr v-if="parseJsonObject(record.vitals).temperature">
                                                          <th class="pl-5" scope="row"><span v-html="formatString('Temprature')"></span></th>
                                                          <td class="pr-5" style="text-align: right;">{{parseJsonObject(record.vitals).temperature}}</td>
                                                        </tr>
                                                        <tr v-if="parseJsonObject(record.vitals).bloodPressure">
                                                          <th class="pl-5" scope="row"><span v-html="formatString('Blood Pressure')"></span></th>
                                                          <td class="pr-5" style="text-align: right;">{{parseJsonObject(record.vitals).bloodPressure}}</td>
                                                        </tr>
                                                        <tr v-if="parseJsonObject(record.vitals).weight">
                                                          <th class="pl-5" scope="row"><span v-html="formatString('Body Weight')"></span></th>
                                                          <td class="pr-5" style="text-align: right;">{{parseJsonObject(record.vitals).weight}}</td>
                                                        </tr>
                                                        <tr v-if="parseJsonObject(record.vitals).pulse">
                                                          <th class="pl-5" scope="row"><span v-html="formatString('Pulse (Heart Rate)')"></span></th>
                                                          <td class="pr-5" style="text-align: right;">{{parseJsonObject(record.vitals).pulse}}</td>
                                                        </tr>
                                                        <tr v-if="parseJsonObject(record.vitals).respiration">
                                                          <th class="pl-5" scope="row"><span v-html="formatString('Respiration')"></span></th>
                                                          <td class="pr-5" style="text-align: right;">{{parseJsonObject(record.vitals).respiration}}</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>                                                                                        
                                                </li>
                                                <li v-if="!isEmptyObject(parseJsonObject(record.diagnosis))" class="list-group-item bg-secondary">
                                                </li>
                                                <li v-if="!isEmptyObject(parseJsonObject(record.diagnosis))" class="list-group-item">
                                                    <div class="h5 pt-3 pb-2"><strong>Diagnosis</strong></div>
                                                    <div v-if="!isEmptyObject(parseJsonObject(record.diagnosis))" class="jumbotron">
                                                        <ul class="list-group list-group-flush">
                                                          <li 
                                                            v-for="(value, index) in parseJsonObject(record.diagnosis)" :key="index"
                                                            class="list-group-item bg-transparent border-0"
                                                          >
                                                            <div class="card border-0">
                                                              <div class="card-body">
                                                                <h5 class="card-title h6"><strong>{{index}}</strong></h5>
                                                                <p class="card-text">{{value}}</p>
                                                              </div>
                                                            </div>
                                                          </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                                <li v-if="!isEmptyObject(parseJsonObject(record.treatments))" class="list-group-item bg-secondary">
                                                </li>
                                                <li v-if="!isEmptyObject(parseJsonObject(record.treatments))" class="list-group-item">
                                                    <div class="h5 pt-3 pb-2"><strong>Treatments</strong></div>
                                                    <div v-if="!isEmptyObject(parseJsonObject(record.treatments))" class="jumbotron">
                                                        <ul class="list-group list-group-flush">
                                                          <li 
                                                            v-for="(value, index) in parseJsonObject(record.treatments)" :key="index"
                                                            class="list-group-item bg-transparent border-0"
                                                          >
                                                            <div class="card border-0">
                                                              <div class="card-body">
                                                                <h5 class="card-title h6"><strong>{{index}}</strong></h5>
                                                                <p class="card-text">{{value}}</p>
                                                              </div>
                                                            </div>
                                                          </li>
                                                        </ul>                                                       
                                                    </div>
                                                </li>
                                                <li v-if="!isEmptyObject(parseJsonObject(record.doctorNote))" class="list-group-item bg-secondary">
                                                </li>
                                                <li v-if="!isEmptyObject(parseJsonObject(record.doctorNote))" class="list-group-item">
                                                    <div class="h5 pt-3 pb-2"><strong>Doctor's Note</strong></div>
                                                    <div v-if="!isEmptyObject(parseJsonObject(record.doctorNote))" class="jumbotron">
                                                        <ul class="list-group list-group-flush">
                                                          <li 
                                                            v-for="(value, index) in parseJsonObject(record.doctorNote)" :key="index"
                                                            class="list-group-item bg-transparent border-0"
                                                          >
                                                            <div class="card border-0">
                                                              <div class="card-body">
                                                                <h5 class="card-title h6"><strong>{{index}}</strong></h5>
                                                                <p class="card-text">{{value}}</p>
                                                              </div>
                                                            </div>
                                                          </li>
                                                        </ul>                                                       
                                                    </div>
                                                </li>
                                              </ul>
                                              <div class="card-body">
                                                <!-- <a href="#" class="card-link">Card link</a> -->
                                                <!-- <a href="#" class="card-link">Another link</a> -->
                                              </div>
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
</template>

<script>

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 

    import PatientMenu from './PatientMenu'

    import { getIntFromBN } from '../../helpers/getIntFromBN'
    import { getTodayDate } from '../../helpers/getTodayDate'
    import { isEmptyObject } from '../../helpers/isEmptyObject'
    import { formatDate } from '../../helpers/formatDate'

    export default {
        name: 'PatientMedicalHistory',
        components: {
            'app-menu': PatientMenu
        },

        data() {
            return {
                patient: {},
                patientMedicalRecordDetails: [],
                hospitals: [],
                doctors: [],
            }
        },

        methods: {
            getIntFromBN(numBN) {
                return getIntFromBN(numBN)
            },

            isEmptyObject(obj) {
                return isEmptyObject(obj)
            },

            formatDate(date) {
                return formatDate(date)
            },

            formatString(aString) {
                const labelLength = 15;
                let outputString = aString;
                for (let i=(aString.length-1); i<labelLength; i++) {
                    outputString+=" "
                }
                return outputString+=":"
            },

            parseJsonObject(obj) {
                return JSON.parse(obj)
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

            getTodayDate() {
                return getTodayDate()
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

            getDoctorName(doctorId) {
                let targetDoctor = null

                this.doctors.map((doctor) => {
                    if (Number(doctor.id) === Number(doctorId)) {
                        targetDoctor = doctor
                    }
                })

                if (!targetDoctor) {
                    return "Unknown Doctor"
                }
                return targetDoctor.name
            }
        },

        async created() {
            const patientId = parseInt(this.$route.params.patientId, 10)

            this.web3 = window.web3
            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                gas: 450000,
                gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            })

            const hospitalCount = await this.blockchainHealthRecord.methods.hospitalCount().call()
            for (let i=1; i<=hospitalCount; i++) {
                const hospital = await this.blockchainHealthRecord.methods.hospitals(i).call()
                this.hospitals.push(hospital)
            }

            const hospitalStaffCount = await this.blockchainHealthRecord.methods.hospitalStaffCount().call()
            for (let i=1; i<=hospitalStaffCount; i++) {
                const hospitalStaff = await this.blockchainHealthRecord.methods.hospitalStaffs(i).call()
                this.doctors.push(hospitalStaff)
            }

            const patientMedicalRecordCount = await this.blockchainHealthRecord.methods.patientMedicalRecordCount().call()
            for (let i=patientMedicalRecordCount; i>0; i--) {
                const patientMedicalRecord = await this.blockchainHealthRecord.methods.patientMedicalRecords(i).call()
                if (this.getIntFromBN(patientMedicalRecord.patient) === patientId) {
                  this.patientMedicalRecordDetails.push(patientMedicalRecord)
                }
            }
        },
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

    .patient-dashboard {
        width: 100% !important;
    }
</style>