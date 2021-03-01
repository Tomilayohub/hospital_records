<template>
    <div class="administrator-dashboard">
        <div class="container-fluid mt-5 mb-5">
            <div class="row">
                <app-menu 
                    :hospitalId="parseInt(id, 10)"
                    :showCreateHospitalStaff="true"
                ></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-0 h3 mb-4 d-flex justify-content-center">{{name}}</h4>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-md-6 offset-md-3">
                                    <table class="table table-striped">
                                      <tbody>
                                        <tr>
                                          <th scope="row">ID :</th>
                                          <td class="col-8">{{ userId }}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Registration Number :</th>
                                          <td>{{ registrationNumber }}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Email :</th>
                                          <td>{{ email }}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Phone :</th>
                                          <td>{{ mobile }}</td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Account Status :</th>
                                          <td>
                                                <span :class="status ? 'text-success' : 'text-danger'">
                                                    {{ status ? 'Active' : 'Suspended' }}
                                                </span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row">Contact Address :</th>
                                          <td>{{ contactAddress }}</td>
                                        </tr>
                                      </tbody>
                                    </table>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6 offset-md-3">
                            <hr class="mb-5">
                            <div class="row">
                                <div class="col-md-4">
                                    <router-link :to="{ name: 'administrator_dashboard'}" class="btn btn-sm btn-secondary pl-3 pr-3">Back</router-link>
                                </div>
                                <div class="col-md-4  d-flex justify-content-center">
                                    
                                </div>
                                <div class="col-md-4  d-flex justify-content-end">
                                    <button @click="loadEditHospitalPage" class="btn btn-sm btn-warning pl-3 pr-3">Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 offset-md-3 mb-3">
                        <hr class="mb-4 mt-5">
                        <h4 class="h3 mb-3 mt-3 d-flex justify-content-center">Hospital Staffs</h4>
                        <div v-if="hospitalStaffs.length <= 0" class="jumbotron d-flex justify-content-center">
                            No staff record found ...
                        </div>
                        <table v-else class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Gender</th>
                              <th scope="col">Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                                v-for="(staff, index) in hospitalStaffs"
                                :key="index"
                            >
                              <th scope="row">{{ index+1 }}</th>
                              <td :title="staff.userId" style="text-transform: capitalize;">{{ staff.name }}</td>
                              <td :title="staff.userId" style="text-transform: capitalize;">{{ staff.gender}}</td>
                              <td :title="staff.password" style="text-transform: capitalize;">{{ staff.mobile }}</td>
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
    import AdminMenu from './AdminHospitalMenu'

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json'

    export default {
        name: 'HospitalRecordDetails',
        components: {
            'app-menu': AdminMenu
        },

        data() {
            return {
                accountType: '',
                contactAddress: '',
                email: '',
                id: '',
                mobile: '',
                name: '',
                registrationNumber: '',
                status: null,
                userId: "",

                hospitalStaffs: []
            }
        },

        methods: {
            loadEditHospitalPage() {
              this.$router.push({
                name: 'edit_hospital_record',
                params: {
                  hospitalId: this.id
                }
              })
            }
        },

        async created() {
            this.web3 = window.web3
            const accounts = await this.web3.eth.getAccounts()
            this.userToken = accounts[0]
            const networkId = await this.web3.eth.net.getId()
            const networkData = BlockchainHealthRecord.networks[networkId]
            this.blockchainHealthRecord = this.web3.eth.Contract(BlockchainHealthRecord.abi, networkData.address, {
                transactionConfirmationBlocks: 1,
                gas: 450000,
                gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
            })

            const hospital = await this.blockchainHealthRecord.methods.hospitals(this.$route.params.hospitalId).call()
            
            this.accountType = hospital.accountType
            this.contactAddress = hospital.contactAddress
            this.email = hospital.email
            this.id = hospital.id
            this.mobile = hospital.mobile
            this.name = hospital.name
            this.registrationNumber = hospital.registrationNumber
            this.status = hospital.status
            this.userId = hospital.userId

            const hospitalStaffCount = await this.blockchainHealthRecord.methods.hospitalStaffCount().call()
            
            for (let i=1; i<=hospitalStaffCount; i++) {
                const hospitalStaff = await this.blockchainHealthRecord.methods.hospitalStaffs(i).call()
                if (parseInt(hospitalStaff.hospitalId, 10) == parseInt(this.id, 10)) {
                    this.hospitalStaffs.push(hospitalStaff)
                }
            }
            console.log(this.hospitalStaffs)
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

    .administrator-dashboard {
        width: 100% !important;
    }
</style>
