<template>
    <div class="col-md-3 order-md-2 mb-4">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted">App Menu</span>
            <!-- <span class="badge badge-secondary badge-pill">3</span> -->
        </h4>

        <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link 
                    :to="{ 
                        name: 'patient_dashboard',
                        param: { patientId: patientId }
                    }"
                >Dashboard</router-link>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link
                    :to="{ 
                        name: 'patient_medical_history',
                        param: { patientId: patientId }
                    }"
                >Medical History</router-link>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link 
                    :to="{ 
                        name: 'grant_access_to_medical_record',
                        param: { patientId: patientId }
                    }"                    
                >View Medical Records Access Requests</router-link>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link
                    :to="{ 
                        name: 'view_appointment_logs',
                        param: { patientId: patientId }
                    }"               
                >View Appointment Logs</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'PatientMenu',
        
        data() {
            return {
                patientId: 0
            }
        },

        created() {
            this.patientId = this.$route.params.patientId
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
