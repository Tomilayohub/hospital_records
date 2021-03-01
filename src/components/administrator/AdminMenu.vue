<template>
    <div class="col-md-3 order-md-2 mb-4">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted">App Menu</span>
            <!-- <span class="badge badge-secondary badge-pill">3</span> -->
        </h4>

        <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link :to="{ name: 'create_hospital_record' }">Create Hospital Record</router-link>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-condensed">
                <router-link :to="{ name: 'administrator_dashboard' }">View Hospitals</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'AdminMenu',
    }
</script>

<style scoped>
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
