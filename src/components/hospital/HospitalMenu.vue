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
                        name: 'hospital_dashboard',
                        params: { 
                            hospitalId: hospitalId,
                            doctorId: doctorId
                        }
                    }"
                >Dashboard</router-link>
            </li>
            <li v-if="!showPMR" class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link 
                    :to="{ 
                        name: 'attempt_accessing_patient_record',
                        params: { 
                            hospitalId: hospitalId,
                            doctorId: doctorId
                        }
                    }"
                >Request Access to Patient's Medical Record</router-link>
            </li>
            <li v-if="showPMR" class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link 
                    :to="{ 
                        name: 'hospital_patient_medical_records',
                        params: { 
                            hospitalId: hospitalId,
                            doctorId: doctorId,
                            patientId: patientId
                        }
                    }"
                >Patient's Medical Record</router-link>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link 
                    :to="{ 
                        name: 'hospital_staff_appointment',
                        params: { 
                            hospitalId: hospitalId,
                            doctorId: doctorId
                        }
                    }"
                >Doctor's Appointment</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'HospitalMenu',

        computed: {
            hospitalId() {
                return this.$route.params.hospitalId
            },

            doctorId() {
                return this.$route.params.doctorId
            },

            patientId() {
                return this.$route.params.patientId
            },

            showPMR() {
                return this.hospitalId && this.doctorId && this.patientId;
            }
        }
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
