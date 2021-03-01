<template>
    <div class="administrator-dashboard">
        <div class="container-fluid mt-5">
            <div class="row">
                <app-menu></app-menu>
                <div class="col-md-9 order-md-1">
                    <h4 class="mb-3 h3 d-flex justify-content-center">Registered Hospitals</h4>
                    <div v-if="hospitals<=0" class="mt-5 mb-5 pb-5 col-md-10 offset-md-1">                      
                        <div class="jumbotron col-8 offset-2" style="text-align: center;">
                            <span class="h4">No hospital record found.</span> <br />
                            <router-link :to="{ name: 'create_hospital_record' }">Create Hospital Record</router-link>
                        </div>
                    </div>
                    <div v-else class="mb-5 pb-5 col-md-10 offset-md-1">
                        <ul class="row" style="list-style: none;">
                            <li 
                                v-for="(hospital, index) in hospitals"
                                :key="index"
                                class="col-md-4 mb-5"
                            >
                                <div class="card">
                                    <div class="card-header">
                                        <img
                                            width='30' 
                                            height='30'
                                            :src="getAccountImage(hospital)"
                                            alt=""
                                        />
                                        <span class="ml-2 text-truncate">{{ hospital.name }}</span>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title h6"><strong>Reg. Number</strong>: {{hospital.registrationNumber}}</h5>
                                        <p class="card-text">
                                            <strong>Status</strong>: 
                                            <span :class="hospital.status ? 'text-success' : 'text-danger'">
                                                {{ hospital.status ? 'Active' : 'Suspended' }}
                                            </span>
                                        </p>
                                        <router-link 
                                            :to="{
                                                name: 'view_hospital_record',
                                                params: {
                                                    hospitalId: hospital.id
                                                }
                                            }" 
                                            class="btn btn-secondary"
                                        >
                                            <i class="fas fa-cogs"></i> &nbsp;&nbsp; Explore
                                        </router-link>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AdminMenu from './AdminMenu'
    import Identicon from 'identicon.js'

    import BlockchainHealthRecord from '../../abis/BlockchainHealthRecord.json'

    export default {
        name: 'Dashboard',
        components: {
            'app-menu': AdminMenu
        },

        data() {
            return {
                hospitals: [],
                userToken: "",
                web3: null,
                blockchainHealthRecord: null
            }
        },

        methods: {
            getAccountImage(hospital) {
                return `data:image/png;base64, ${new Identicon(hospital.userId + hospital.name, 30).toString()}`
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

    .administrator-dashboard {
        width: 100% !important;
    }

    .card-fitter {
        width: 100%;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
    }
</style>
