import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from '../components/Home'
import PatientLogin from '../components/PatientLogin'
import AdministratorLogin from '../components/AdministratorLogin'
import HospitalLogin from '../components/HospitalLogin'

import PatientComponent from '../components/patient/PatientComponent'
import HospitalComponent from '../components/hospital/HospitalComponent'
import AdministratorComponent from '../components/administrator/AdministratorComponent'

import PatientDashboard from '../components/patient/Dashboard'
import PatientMedicalHistory from '../components/patient/PatientMedicalHistory'
import PatientGrantAccessRquestList from '../components/patient/PatientGrantAccessRquestList'
import PatientAppointmentLogs from '../components/patient/PatientAppointmentLogs'


import HospitalDashboard from '../components/hospital/Dashboard'
import AccessRequestToPatientMedicalRecord from '../components/hospital/AccessRequestToPatientMedicalRecord'
import PatientMedicalRecord from '../components/hospital/PatientMedicalRecord'
import HospitalStaffAppointment from '../components/hospital/HospitalStaffAppointment'


import AdministratorDashboard from '../components/administrator/Dashboard'
import CreateHospitalRecord from '../components/administrator/CreateHospitalRecord'
import HospitalRecordDetails from '../components/administrator/HospitalRecordDetails'
import EditHospitalRecord from '../components/administrator/EditHospitalRecord'
import CreateHospitalStaffRecord from '../components/administrator/CreateHospitalStaffRecord'


const patientRoutes = [
    { path: '', name: 'patient_dashboard', component: PatientDashboard },
    { path: '/patients/:patientId/medical-history', name: 'patient_medical_history', component: PatientMedicalHistory },
    { path: '/patients/:patientId/medical-records-access-request-list', name: 'grant_access_to_medical_record', component: PatientGrantAccessRquestList },
    { path: '/patients/:patientId/appointment-logs', name: 'view_appointment_logs', component: PatientAppointmentLogs },
];

const hosiptalRoutes = [
    { path: '', name: 'hospital_dashboard', component: HospitalDashboard },
    { path: '/hospitals/:hospitalId/:doctorId/attempt-accessing-medical-record', name: 'attempt_accessing_patient_record', component: AccessRequestToPatientMedicalRecord },
    { path: '/hospitals/:hospitalId/:doctorId/patient-medical-record/:patientId', name: 'hospital_patient_medical_records', component: PatientMedicalRecord },
    { path: '/hospitals/:hospitalId/:doctorId/appointments', name: 'hospital_staff_appointment', component: HospitalStaffAppointment },
];

const administratorRoutes = [
    { path: '', name: 'administrator_dashboard', component: AdministratorDashboard },
    { path: '/administrator/hospitals/:hospitalId/create-hospital-staff', name: 'create_hospital_staff_account', component: CreateHospitalStaffRecord },
    { path: '/administrator/hospitals/:hospitalId', name: 'view_hospital_record', component: HospitalRecordDetails },
    { path: '/administrator/hospitals/create-hospital', name: 'create_hospital_record', component: CreateHospitalRecord },
    { path: '/administrator/hospitals/:hospitalId/edit', name: 'edit_hospital_record', component: EditHospitalRecord },
];

const routes = [
    {
        path: '/',
        name: 'homepage',
        component: Home,
        meta: {
            requiresVisitor: true,
        }
    },
    {
        path: '/administrator/login',
        name: 'administrator_login',
        component: AdministratorLogin,
        meta: {
            requiresVisitor: true,
        }
    },
    {
        path: '/hospital/login',
        name: 'hospital_login',
        component: HospitalLogin,
        meta: {
            requiresVisitor: true,
        }
    },
    {
        path: '/patient/login',
        name: 'patient_login',
        component: PatientLogin,
        meta: {
            requiresVisitor: true,
        }
    },
    {
        path: '/patients/:patientId',
        component: PatientComponent,
        children: patientRoutes,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/hospitals/:hospitalId/:doctorId',
        component: HospitalComponent,
        children: hosiptalRoutes,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/administrator/hospitals',
        component: AdministratorComponent,
        children: administratorRoutes,
        meta: {
            requiresAuth: true,
        }
    }
]

export default new Router({
    mode: 'history',
    routes
});
