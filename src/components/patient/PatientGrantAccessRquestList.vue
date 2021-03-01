<template>
    <div class="patient-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 d-flex justify-content-center">Logged in Patient Medical Records Access Request List</h4>
                    <div class="row pr-3 pl-3 d-flex justify-content-left">
                        <div class="col-md-10 offset-md-1">
                            <div v-if="pmrAccessRequest.length <= 0" class="jumbotron d-flex justify-content-center">
                                No request to access your medical record was found.
                            </div>
                            <table v-else class="table table-striped">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Hospital</th>
                                  <th scope="col">Date</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-for="(request, index) in pmrAccessRequest"
                                    :key="index"
                                >
                                  <th scope="row">{{index+1}}</th>
                                  <td style="text-transform: capitalize;">{{getHospitalName(request.hospital)}}</td>
                                  <td style="text-transform: capitalize;">{{request.date}}</td>
                                  <td style="text-transform: capitalize;"><span v-html="getRequestStatus(request)"></span></td>
                                  <td style="text-transform: capitalize;">
                                        <button @click="approvePMRAccessRequest(request.id)" :disabled="request.rejected" type="button" class="btn btn-success mr-3">Approve</button>
                                        <button @click="rejectPMRAccessRequest(request.id)" :disabled="request.rejected" type="button" class="btn btn-danger ml-3">Reject</button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PatientMenu from './PatientMenu'

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json' 
    import { isEmptyObject } from '../../helpers/isEmptyObject'
    import { getIntFromBN } from '../../helpers/getIntFromBN'

    // import { mailgun } from '../../mailgun'

    export default {
        name: 'Dashboard',
        components: {
            'app-menu': PatientMenu
        },

        data() {
            return {
                pmrAccessRequest: [],
                hospitals: [],
                blockchainHealthRecord: null,
                web3: null,
            }
        },

        methods: {
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

            getRequestStatus(requestInstance) {
                if (requestInstance.rejected) {
                    return `<h5><span class="badge badge-danger pt-2 pb-2 pr-2 pl-2 mt-1">Rejected</span></h5>`
                }

                if (requestInstance.approved) {
                    return `<h5><span class="badge badge-success pt-2 pb-2 pr-2 pl-2 mt-1">Approved</span></h5>`
                }

                return `<h5><span class="badge badge-secondary pt-2 pb-2 pr-2 pl-2 mt-1">Pending</span></h5>`
            },

            getIntFromBN(numBN) {
                return getIntFromBN(numBN)
            },

            approvePMRAccessRequest(requestId) {
                this.blockchainHealthRecord.methods.approvePMRAccessRequest(requestId).send({ from: this.loggedUser.userId })
                    .then((receipt) => {
                        const pmrAccessRecord = receipt.events.PatientMedicalRecordAccessRequested.returnValues
                        this.pmrAccessRequest.map((pmr)=>{
                            if ( this.getIntFromBN(pmr.id) === this.getIntFromBN(requestId) && !isEmptyObject(pmrAccessRecord)) {
                                pmr = pmrAccessRecord
                            }
                            location.reload()
                        })
                    }).catch((err)=>{
                        console.log("APPROVE PMR ACCESS REQUEST ERROR: ", err) 
                    })
            },

            rejectPMRAccessRequest(requestId) {
                this.blockchainHealthRecord.methods.rejectPMRAccessRequest(requestId).send({ from: this.loggedUser.userId })
                    .then((receipt) => {
                        const pmrAccessRecord = receipt.events.PatientMedicalRecordAccessRequested.returnValues
                        this.pmrAccessRequest.map((pmr)=>{
                            if ( this.getIntFromBN(pmr.id) === this.getIntFromBN(requestId) && !isEmptyObject(pmrAccessRecord)) {
                                pmr = pmrAccessRecord
                            }
                            location.reload()
                        })
                    }).catch((err)=>{
                        console.log("REJECT PMR ACCESS REQUEST API ERROR: ", err) 
                    })
            }
        },

        computed: {
            loggedUser() {
                return this.$store.getters.loggedUser
            }
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


            const PMRAccessRequestCount = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequestCount().call()
            for (let i=1; i<=PMRAccessRequestCount; i++) {
                const targetPMRAccessRequest = await this.blockchainHealthRecord.methods.patientMedicalRecordAccessRequests(i).call()
                if (this.getIntFromBN(targetPMRAccessRequest.patient) == this.getIntFromBN(this.loggedUser.id) && !targetPMRAccessRequest.rejected) {
                    this.pmrAccessRequest.push(targetPMRAccessRequest)
                }
            }

            const hospitalCount = await this.blockchainHealthRecord.methods.hospitalCount().call()
            for (let i=1; i<=hospitalCount; i++) {
                const hospital = await this.blockchainHealthRecord.methods.hospitals(i).call()
                this.hospitals.push(hospital)
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