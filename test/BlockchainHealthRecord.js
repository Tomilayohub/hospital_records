const { assert } = require("chai")
const { default: Web3 } = require("web3")

const BlockchainHealthRecord = artifacts.require("./BlockchainHealthRecord.sol")

require("chai")
    .use(require("chai-as-promised"))
    .should()


contract("BlockchainHealthRecord", ([admin, acct2, acct3, acct4, acct5, acct6, acct7, acct8, acct9, acct10]) => {
    let blockchainHealthRecord = null
    let administratorCount, administrator, result, patientCount, hospitalCount, hospitalStaffCount

    before(async () => {
        blockchainHealthRecord = await BlockchainHealthRecord.deployed()
    })

    describe("deployment", async () => {
        it("deployed successfully", async () => {
            const address = await blockchainHealthRecord.address

            assert.notEqual(address, 0x0)
            assert.notEqual(address, "")
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it("has a name property", async () => {
            const name = await blockchainHealthRecord.name()
            const expectedName = "Consortium Blockchain Health Records"

            assert.equal(name, expectedName)
        })
    })

    describe("administrator", async () => {
        const administratorName = "System Administrator"
        const administratorAccountType = "administrator"
        const administrator2Name = "System Administrator 2"
        const errorMessage = "Invalid User ID or Password, Please try again."
        const statusCode = 400

        it("list administrator account", async () => {
            administratorCount = await blockchainHealthRecord.administratorCount()
            administrator = await blockchainHealthRecord.administrators(administratorCount)

            assert.equal(administrator.id.toNumber(), administratorCount.toNumber(), "id is correct")
            assert.equal(administrator.name, administratorName, "administrator name is correct")
            assert.equal(administrator.accountType, administratorAccountType, "administrator account type is correct")
            assert.equal(administrator.userId, admin, "administrator account token is correct")
            assert.equal(administratorCount.toNumber(), 1, "administrators list length count is correct")
        })

        it("creates administrator account", async () => {
            result = await blockchainHealthRecord.createAdministratorAccount(acct2, administrator2Name, "Password", administratorAccountType)
            administratorCount = await blockchainHealthRecord.administratorCount()
            const createdAdministratorAccount = result.logs[0].args

            assert.equal(createdAdministratorAccount.id.toNumber(), administratorCount.toNumber(), "id is correct")
            assert.equal(createdAdministratorAccount.name, administrator2Name, "administrator name is correct")
            assert.equal(createdAdministratorAccount.accountType, administratorAccountType, "administrator account type is correct")
            assert.equal(createdAdministratorAccount.userId, acct2, "administrator account token is correct")
            assert.equal(administratorCount.toNumber(), 2, "administrators list length count is correct")
        })

        it("administrator login", async () => {
            result = await blockchainHealthRecord.administratorLogin("P@$$w0rd", { from: admin })
            const administratorAccount = result.logs[0].args

            assert.equal(administratorAccount.id.toNumber(), 1, "id is correct")
            assert.equal(administratorAccount.name, administratorName, "administrator name is correct")
            assert.equal(administratorAccount.accountType, administratorAccountType, "administrator account type is correct")
            assert.equal(administratorAccount.userId, admin, "administrator account token is correct")
        })

        it("administrator login failed", async () => {
            result = await blockchainHealthRecord.administratorLogin("Password", { from: admin })
            const failedAdministratorLogin = result.logs[0].args

            assert.equal(failedAdministratorLogin.errorMessage, errorMessage, "error message is correct")
            assert.equal(failedAdministratorLogin.statusCode, statusCode, "status code is correct")
        })
    })

    describe("hospital", async () => {
        const accountType = "hospital"
        const name = "Olusegun Obasanjo General Hospital" 
        const contactAddress = "123 Albert Maculey way igamu akoka, Lagos state, Nigeria." 
        const registrationNumber = "RN1234567890"
        const mobile = "+2348036300685, +2348077983432"
        const email = "info@oogh.com"

        before(async () => {
            result = await blockchainHealthRecord.createHospitalAccount(acct3, accountType, name, contactAddress, registrationNumber, mobile, email)
            hospitalCount = await blockchainHealthRecord.hospitalCount()
        })

        it("creates hospital account", async () => {
            const createdHospitalAccount = result.logs[0].args

            // Success
            assert.equal(hospitalCount.toNumber(), 1)
            assert.equal(createdHospitalAccount.id.toNumber(), hospitalCount.toNumber(), "id is correct")
            assert.equal(createdHospitalAccount.accountType, accountType, "account type is correct")
            assert.equal(createdHospitalAccount.name, name, "name is correct")
            assert.equal(createdHospitalAccount.contactAddress, contactAddress, "address is correct")
            assert.equal(createdHospitalAccount.registrationNumber, registrationNumber, "registration number is correct")
            assert.equal(createdHospitalAccount.email, email, "email is correct")
            assert.equal(createdHospitalAccount.status, true, "status is correct")

            // Failure
            await blockchainHealthRecord.createHospitalAccount(acct3, "", name, contactAddress, registrationNumber, mobile, email).should.be.rejected
            await blockchainHealthRecord.createHospitalAccount(acct3, accountType, "", contactAddress, registrationNumber, mobile, email).should.be.rejected
            await blockchainHealthRecord.createHospitalAccount(acct3, accountType, name, "", registrationNumber, mobile, email).should.be.rejected
            await blockchainHealthRecord.createHospitalAccount(acct3, accountType, name, contactAddress, "", mobile, email).should.be.rejected
            await blockchainHealthRecord.createHospitalAccount(acct3, accountType, name, contactAddress, registrationNumber, "", email).should.be.rejected
            await blockchainHealthRecord.createHospitalAccount(acct3, accountType, name, contactAddress, registrationNumber, mobile, "").should.be.rejected
        })

        it("list hospitals", async () => {
            const retrievedHospitals = await blockchainHealthRecord.hospitals(hospitalCount)

            // Success
            assert.equal(hospitalCount.toNumber(), 1)
            assert.equal(retrievedHospitals.id.toNumber(), hospitalCount.toNumber(), "id is correct")
            assert.equal(retrievedHospitals.accountType, accountType, "account type is correct")
            assert.equal(retrievedHospitals.name, name, "name is correct")
            assert.equal(retrievedHospitals.contactAddress, contactAddress, "address is correct")
            assert.equal(retrievedHospitals.registrationNumber, registrationNumber, "registration number is correct")
            assert.equal(retrievedHospitals.email, email, "email is correct")
        })

        it("suspend/unsuspend hospital account", async () => {
        
        })
    })

    describe("hospital staff", async () => {
        const accountType = "hospital staff"
        const name = "Ivie Adesuwa Ode" 
        const password = "P@$$w0rd"
        const email = "iadesuwa@hospital,com" 
        const gender = "female"
        const mobile = "+2348077983432"
        const errorMessage = "Invalid User ID or Password, Please try again."
        const statusCode = 400

        before(async () => {
            hospitalCount = await blockchainHealthRecord.hospitalCount()
            result = await blockchainHealthRecord.createHospitalStaffAccount(name, acct4, password, mobile, email, accountType, gender, hospitalCount)
            hospitalStaffCount = await blockchainHealthRecord.hospitalStaffCount()
        })

        it("creates hospital staff account", async () => {
            const createdHospitalStaffAccount = result.logs[0].args
            // Success
            assert.equal(hospitalStaffCount.toNumber(), 1)
            assert.equal(createdHospitalStaffAccount.id.toNumber(), hospitalStaffCount.toNumber(), "id is correct")
            assert.equal(createdHospitalStaffAccount.accountType, accountType, "account type is correct")
            assert.equal(createdHospitalStaffAccount.name, name, "name is correct")
            assert.equal(createdHospitalStaffAccount.email, email, "email is correct")
            assert.equal(createdHospitalStaffAccount.gender, gender, "gender is correct")
            assert.equal(createdHospitalStaffAccount.mobile, mobile, "mobile is correct")
            // Failure
            await blockchainHealthRecord.createHospitalStaffAccount("", acct4, password, mobile, email, accountType, gender, hospitalCount).should.be.rejected
            await blockchainHealthRecord.createHospitalStaffAccount(name, acct4, "", mobile, email, accountType, gender, hospitalCount).should.be.rejected
            await blockchainHealthRecord.createHospitalStaffAccount(name, acct4, password, "", email, accountType, gender, hospitalCount).should.be.rejected
            await blockchainHealthRecord.createHospitalStaffAccount(name, acct4, password, mobile, "", accountType, gender, hospitalCount).should.be.rejected
            await blockchainHealthRecord.createHospitalStaffAccount(name, acct4, password, mobile, email, "", gender, hospitalCount).should.be.rejected
            await blockchainHealthRecord.createHospitalStaffAccount(name, acct4, password, mobile, email, accountType, "", hospitalCount).should.be.rejected
        })

        it("list hospital staffs", async () => {
            const retrievedHospitalStaff = await blockchainHealthRecord.hospitalStaffs(hospitalStaffCount)
            // Success
            assert.equal(hospitalStaffCount.toNumber(), 1)
            assert.equal(retrievedHospitalStaff.id.toNumber(), hospitalStaffCount.toNumber(), "id is correct")
            assert.equal(retrievedHospitalStaff.accountType, accountType, "account type is correct")
            assert.equal(retrievedHospitalStaff.name, name, "name is correct")
            assert.equal(retrievedHospitalStaff.email, email, "email is correct")
            assert.equal(retrievedHospitalStaff.gender, gender, "gender is correct")
            assert.equal(retrievedHospitalStaff.mobile, mobile, "mobile is correct")
        })

        it("hospital login", async () => {
            result = await blockchainHealthRecord.hospitalLogin(password, { from: acct4 })
            const hospitalStaffAccount = result.logs[0].args
 
            assert.equal(hospitalStaffCount.toNumber(), 1)
            assert.equal(hospitalStaffAccount.id.toNumber(), hospitalStaffCount.toNumber(), "id is correct")
            assert.equal(hospitalStaffAccount.accountType, accountType, "account type is correct")
            assert.equal(hospitalStaffAccount.name, name, "name is correct")
            assert.equal(hospitalStaffAccount.email, email, "email is correct")
            assert.equal(hospitalStaffAccount.gender, gender, "gender is correct")
            assert.equal(hospitalStaffAccount.mobile, mobile, "mobile is correct")
        })

        it("hospital login failed", async () => {
            result = await blockchainHealthRecord.hospitalLogin("Password", { from: acct4 })
            const failedhospitalStaffLogin = result.logs[0].args

            assert.equal(failedhospitalStaffLogin.errorMessage, errorMessage, "error message is correct")
            assert.equal(failedhospitalStaffLogin.statusCode, statusCode, "status code is correct")
        })

        it("hospital staff should request access to patient medical records", async () => {

        })

        it("hospital staff should patient report record", async () => {

        })

        it("hospital staff should schedule appointmet", async () => {
        })

        it("create patient record should fail if patient vatals are missing", async () => {

        })

        it("create appointment record should fail if appointment details are missing", async () => {

        })
    })

    describe("patient", async () => {
        const accountType = "patient"
        const name = "Zuriel Oghogho Ode" 
        const dateOfBirth = "2011/10/9"
        const password = "P@$$w0rd"
        const gender = "male"
        const email = "ozuriel@smartman.com"
        const errorMessage = "Invalid User ID or Password, Please try again."
        const statusCode = 400

        before(async () => {
            result = await blockchainHealthRecord.createPatientAccount(acct5, name, dateOfBirth, password, email, accountType, gender)
            patientCount = await blockchainHealthRecord.patientCount()
        })

        it("creates patient account", async () => {
            const createdPatientAccount = result.logs[0].args
            // Success
            assert.equal(patientCount.toNumber(), 1)
            assert.equal(createdPatientAccount.id.toNumber(), patientCount.toNumber(), "id is correct")
            assert.equal(createdPatientAccount.accountType, accountType, "account type is correct")
            assert.equal(createdPatientAccount.name, name, "name is correct")
            assert.equal(createdPatientAccount.dateOfBirth, dateOfBirth, "date of birth is correct")
            assert.equal(createdPatientAccount.gender, gender, "gender is correct")
            assert.equal(createdPatientAccount.email, email, "email is correct")
            // Failure
            result = await blockchainHealthRecord.createPatientAccount(acct5, "", dateOfBirth, password, email, accountType, gender).should.be.rejected
            result = await blockchainHealthRecord.createPatientAccount(acct5, name, "", password, email, accountType, gender).should.be.rejected
            result = await blockchainHealthRecord.createPatientAccount(acct5, name, dateOfBirth, "", email, accountType, gender).should.be.rejected
            result = await blockchainHealthRecord.createPatientAccount(acct5, name, dateOfBirth, password, "", accountType, gender).should.be.rejected
            result = await blockchainHealthRecord.createPatientAccount(acct5, name, dateOfBirth, password, email, "", gender).should.be.rejected
            result = await blockchainHealthRecord.createPatientAccount(acct5, name, dateOfBirth, password, email, accountType, "").should.be.rejected
        })

        it("list patients", async () => {
            const retrievedPatientAccount = await blockchainHealthRecord.patients(patientCount)
            // Success
            assert.equal(patientCount.toNumber(), 1)
            assert.equal(retrievedPatientAccount.id.toNumber(), patientCount.toNumber(), "id is correct")
            assert.equal(retrievedPatientAccount.accountType, accountType, "account type is correct")
            assert.equal(retrievedPatientAccount.name, name, "name is correct")
            assert.equal(retrievedPatientAccount.dateOfBirth, dateOfBirth, "date of birth is correct")
            assert.equal(retrievedPatientAccount.gender, gender, "gender is correct")
            assert.equal(retrievedPatientAccount.email, email, "email is correct")
        })

        it("patient login", async () => {
            result = await blockchainHealthRecord.patientLogin(password, { from: acct5 })
            const patientAccount = result.logs[0].args
 
            assert.equal(patientCount.toNumber(), 1)
            assert.equal(patientAccount.id.toNumber(), patientCount.toNumber(), "id is correct")
            assert.equal(patientAccount.accountType, accountType, "account type is correct")
            assert.equal(patientAccount.name, name, "name is correct")
            assert.equal(patientAccount.dateOfBirth, dateOfBirth, "date of birth is correct")
            assert.equal(patientAccount.gender, gender, "gender is correct")
            assert.equal(patientAccount.email, email, "email is correct")
        })

        it("patient login failed", async () => {
            result = await blockchainHealthRecord.patientLogin("Password", { from: acct5 })
            const failedPatientLogin = result.logs[0].args

            assert.equal(failedPatientLogin.errorMessage, errorMessage, "error message is correct")
            assert.equal(failedPatientLogin.statusCode, statusCode, "status code is correct")
        })

       it("patient should approve access request by hospital", async () => {

       })

        
       it("patient should reject access request by hospital", async () => {
        
        })
    })

    describe("patient medical records", async () => {
        let patientMedicalRecordCount = null
        const doctorNote = "Doctor's note ..." 
        const date = "2011/10/9"
        const vitals = "temperature: 37'C, bloodPressure: 100mm/mg"
        const diagnosis = "Diagnosis activities"
        const treatments = "Doctor treatment prescription"

        before(async () => {
            result = await blockchainHealthRecord.createPatientMedicalRecord(patientCount.toNumber(), hospitalCount.toNumber(), hospitalStaffCount.toNumber(), date, vitals, diagnosis, treatments, doctorNote)
            patientMedicalRecordCount = await blockchainHealthRecord.patientMedicalRecordCount()
        })

        it("creates patient medical record", async () => {
            const createdPatientMedicalRecord = result.logs[0].args

            // Success
            assert.equal(patientMedicalRecordCount.toNumber(), 1)
            assert.equal(createdPatientMedicalRecord.id.toNumber(), patientMedicalRecordCount.toNumber(), "id is correct")
            assert.equal(createdPatientMedicalRecord.doctorNote, doctorNote, "doctor note is correct")
            assert.equal(createdPatientMedicalRecord.date, date, "date is correct")
            assert.equal(createdPatientMedicalRecord.vitals, vitals, "vitals is correct")
            assert.equal(createdPatientMedicalRecord.diagnosis, diagnosis, "diagnosis is correct")
            assert.equal(createdPatientMedicalRecord.treatments, treatments, "treatment is correct")

            // Failure
            result = await blockchainHealthRecord.createPatientMedicalRecord(patientCount.toNumber(), hospitalCount.toNumber(), hospitalStaffCount.toNumber(), "", vitals, diagnosis, treatments, doctorNote).should.be.rejected
            result = await blockchainHealthRecord.createPatientMedicalRecord(patientCount.toNumber(), hospitalCount.toNumber(), hospitalStaffCount.toNumber(), date, "", diagnosis, treatments, doctorNote).should.be.rejected
            result = await blockchainHealthRecord.createPatientMedicalRecord(patientCount.toNumber(), hospitalCount.toNumber(), hospitalStaffCount.toNumber(), date, vitals, "", treatments, doctorNote).should.be.rejected
            result = await blockchainHealthRecord.createPatientMedicalRecord(patientCount.toNumber(), hospitalCount.toNumber(), hospitalStaffCount.toNumber(), date, vitals, diagnosis, "", doctorNote).should.be.rejected
            result = await blockchainHealthRecord.createPatientMedicalRecord(patientCount.toNumber(), hospitalCount.toNumber(), hospitalStaffCount.toNumber(), date, vitals, diagnosis, treatments, "").should.be.rejected
        })

        it("list patient medical record", async () => {
            const retrievedPatientMedicalRecord = await blockchainHealthRecord.patientMedicalRecords(patientMedicalRecordCount)
            // Success
            assert.equal(patientMedicalRecordCount.toNumber(), 1)
            assert.equal(retrievedPatientMedicalRecord.id.toNumber(), patientMedicalRecordCount.toNumber(), "id is correct")
            assert.equal(retrievedPatientMedicalRecord.doctorNote, doctorNote, "doctor note is correct")
            assert.equal(retrievedPatientMedicalRecord.date, date, "date is correct")
            assert.equal(retrievedPatientMedicalRecord.vitals, vitals, "vitals is correct")
            assert.equal(retrievedPatientMedicalRecord.diagnosis, diagnosis, "diagnosis is correct")
            assert.equal(retrievedPatientMedicalRecord.treatments, treatments, "treatment is correct")
        })      
    })

    describe("access patient medical records request", async () => {
        let patientMedicalRecordAccessRequestCount = null
        const date = "2011/10/9"
        const approved = false
        const rejected = false

        before(async () => {
            result = await blockchainHealthRecord.createPatientMedicalRecordAccessRequest(acct3, acct5, date)
            patientMedicalRecordAccessRequestCount = await blockchainHealthRecord.patientMedicalRecordAccessRequestCount()
        })

        it("creates patient medical record access request", async () => {
            const createdPatientMedicalRecordAccessRequest = result.logs[0].args

            // Success
            assert.equal(patientMedicalRecordAccessRequestCount.toNumber(), 1)
            assert.equal(createdPatientMedicalRecordAccessRequest.id.toNumber(), patientMedicalRecordAccessRequestCount.toNumber(), "id is correct")
            assert.equal(createdPatientMedicalRecordAccessRequest.date, date, "date is correct")
            assert.equal(createdPatientMedicalRecordAccessRequest.approved, approved, "approved is correct")
            assert.equal(createdPatientMedicalRecordAccessRequest.rejected, rejected, "rejected is correct")

            // Failure
            await blockchainHealthRecord.createPatientMedicalRecordAccessRequest(acct3, acct5, "").should.be.rejected
        })

        it("list created patient medical record access request", async () => {
            const retrievedPatientMedicalRecordAccessRequest = await blockchainHealthRecord.patientMedicalRecordAccessRequests(patientMedicalRecordAccessRequestCount)
            // Success

            assert.equal(patientMedicalRecordAccessRequestCount.toNumber(), 1)
            assert.equal(retrievedPatientMedicalRecordAccessRequest.id.toNumber(), patientMedicalRecordAccessRequestCount.toNumber(), "id is correct")
            assert.equal(retrievedPatientMedicalRecordAccessRequest.date, date, "date is correct")
            assert.equal(retrievedPatientMedicalRecordAccessRequest.approved, approved, "approved is correct")
            assert.equal(retrievedPatientMedicalRecordAccessRequest.rejected, rejected, "rejected is correct")
        })             
    })

    describe("scheduled appointments", async () => {
        let appointmentCount = null
        const date = "2011/10/9"
        const dueDate = "2011/10/9"
        const purpose = "Appointment purpose"
        const doctorNote = "Doctor's notes"

        before(async () => {
            result = await blockchainHealthRecord.createScheduledAppointment(patientCount.toNumber(), hospitalCount.toNumber(), date, dueDate, purpose, doctorNote)
            appointmentCount = await blockchainHealthRecord.appointmentCount()
        })

        it("creates scheduled appointment with patient", async () => {
            const createdScheduledAppointment = result.logs[0].args

            // Success
            assert.equal(appointmentCount.toNumber(), 1)
            assert.equal(createdScheduledAppointment.id.toNumber(), appointmentCount.toNumber(), "id is correct")
            assert.equal(createdScheduledAppointment.date, date, "date is correct")
            assert.equal(createdScheduledAppointment.dueDate, dueDate, "due date is correct")
            assert.equal(createdScheduledAppointment.purpose, purpose, "purpose is correct")
            assert.equal(createdScheduledAppointment.doctorNote, doctorNote, "doctor's note is correct")

            // Failure
            await blockchainHealthRecord.createScheduledAppointment(patientCount.toNumber(), hospitalCount.toNumber(), "", dueDate, purpose, doctorNote).should.be.rejected
            await blockchainHealthRecord.createScheduledAppointment(patientCount.toNumber(), hospitalCount.toNumber(), date, "", purpose, doctorNote).should.be.rejected
            await blockchainHealthRecord.createScheduledAppointment(patientCount.toNumber(), hospitalCount.toNumber(), date, dueDate, "", doctorNote).should.be.rejected
            await blockchainHealthRecord.createScheduledAppointment(patientCount.toNumber(), hospitalCount.toNumber(), date, dueDate, purpose, "").should.be.rejected
        })

        it("list created scheduled appointments", async () => {
            const retrievedScheduledAppointment = await blockchainHealthRecord.appointments(appointmentCount)
            // Success
            assert.equal(appointmentCount.toNumber(), 1)
            assert.equal(retrievedScheduledAppointment.id.toNumber(), appointmentCount.toNumber(), "id is correct")
            assert.equal(retrievedScheduledAppointment.date, date, "date is correct")
            assert.equal(retrievedScheduledAppointment.dueDate, dueDate, "due date is correct")
            assert.equal(retrievedScheduledAppointment.purpose, purpose, "purpose is correct")
            assert.equal(retrievedScheduledAppointment.doctorNote, doctorNote, "doctor's note is correct")
        })             
    })
})