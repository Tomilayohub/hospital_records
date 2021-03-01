pragma solidity ^0.5.0;

contract BlockchainHealthRecord {
    string public name;
    uint public hospitalCount = 0;
    uint public hospitalStaffCount = 0;
    uint public patientCount = 0;
    uint public administratorCount = 0;
    uint public patientMedicalRecordCount = 0;
    uint public patientMedicalRecordAccessRequestCount = 0;
    uint public appointmentCount = 0;

    mapping(uint => Administrator) public administrators;
    mapping(uint => Hospital) public hospitals;
    mapping(uint => HospitalStaff) public hospitalStaffs;
    mapping(uint => Patient) public patients;
    mapping(uint => PatientMedicalRecord) public patientMedicalRecords;
    mapping(uint => PatientMedicalRecordAccessRequest) public patientMedicalRecordAccessRequests;
    mapping(uint => ScheduledAppointment) public appointments;

    struct Administrator {
        uint id;
        address userId;
        string name;
        string password;
        string accountType;
    }

    struct Hospital {
        uint id;
        address userId;
        string accountType;
        string name;
        string contactAddress;
        string registrationNumber;
        string mobile;
        string email;
        bool status;
    }

    struct HospitalStaff {
        uint id;
        string name;
        address userId;
        string password;
        string mobile;
        string email;
        string accountType;
        string gender;
        uint hospitalId;
    }

    struct Patient {
        uint id;
        address userId;
        string name;
        string dateOfBirth;
        string password;
        string email;
        string accountType;
        string gender;
    }

    struct PatientMedicalRecord {
        uint id;
        uint patient;
        uint hospital;
        uint doctor;
        string date;
        string vitals;
        string diagnosis;
        string treatments;
        string doctorNote;
    }

    struct PatientMedicalRecordAccessRequest {
        uint id;
        uint hospital;
        uint patient;
        string date;
        bool approved;
        bool rejected;
    }

    struct ScheduledAppointment {
        uint id;
        uint hospital;
        uint patient;
        string date;
        string dueDate;
        string purpose;
        string doctorNote;
    }

    event AdministratorAccount(
        uint id,
        address userId,
        string name,
        string accountType
    );

    event HospitalAccount(
        uint id,
        address userId,
        string accountType,
        string name,
        string contactAddress,
        string registrationNumber,
        string mobile,
        string email,
        bool status
    );

    event HospitalStaffAccount(
        uint id,
        string name,
        address userId,
        string mobile,
        string email,
        string accountType,
        string gender,
        uint hospitalId
    );

    event PatientAccount(
        uint id,
        address userId,
        string name,
        string dateOfBirth,
        string email,
        string accountType,
        string gender
    );

    event PatientMedicalRecordDetails(
        uint id,
        uint patient,
        uint hospital,
        uint doctor,
        string date,
        string vitals,
        string diagnosis,
        string treatments,
        string doctorNote
    );

    event PatientMedicalRecordAccessRequested(
        uint id,
        uint hospital,
        uint patient,
        string date,
        bool approved,
        bool rejected
    );

    event AppointmentScheduled(
        uint id,
        uint hospital,
        uint patient,
        string date,
        string dueDate,
        string purpose,
        string doctorNote
    );

    event LoginAttemptFailed(
        string errorMessage,
        uint statusCode,
        address sender
    );

    event AccountCreationFailed(
        string errorMessage,
        string accountType,
        uint statusCode
    );

    constructor() public {
        name = "Consortium Blockchain Health Records";

        createAdministratorAccount(msg.sender, "System Administrator", "P@$$w0rd", "administrator");
    }

    function createAdministratorAccount(address _userId, string memory _name, string memory _password, string memory _accountType) public {
        require(bytes(_name).length > 0);
        require(bytes(_password).length > 0);
        require(bytes(_accountType).length > 0);
        
        administratorCount++;
        administrators[administratorCount] = Administrator(administratorCount, _userId, _name, _password, _accountType);

        emit AdministratorAccount(administratorCount, _userId, _name, _accountType);  
    }

    function createHospitalAccount(address _userId, string memory _accountType, string memory _name, string memory _contactAddress, string memory _registrationNumber, string memory _mobile, string memory _email) public {
        
        require(bytes(_accountType).length > 0);
        require(bytes(_name).length > 0);
        require(bytes(_contactAddress).length > 0);
        require(bytes(_registrationNumber).length > 0);
        require(bytes(_mobile).length > 0);
        require(bytes(_email).length > 0);

        if (bytes(_accountType).length > 0 && bytes(_name).length > 0 && bytes(_contactAddress).length > 0 && bytes(_registrationNumber).length > 0 && bytes(_mobile).length > 0 && bytes(_email).length > 0) {
            hospitalCount++;
            hospitals[hospitalCount] = Hospital(hospitalCount, _userId, _accountType, _name, _contactAddress, _registrationNumber, _mobile, _email, true);
            emit HospitalAccount(hospitalCount, _userId, _accountType, _name, _contactAddress, _registrationNumber, _mobile, _email, true);
        } else {
            emit AccountCreationFailed( "account creation attempt failed", _accountType, 400);
        }                                                   
    }

    function updateHospitalAccount(uint _id, address _userId, string memory _accountType, string memory _name, string memory _contactAddress, string memory _registrationNumber, string memory _mobile, string memory _email) public {
        
        require(bytes(_accountType).length > 0);
        require(bytes(_name).length > 0);
        require(bytes(_contactAddress).length > 0);
        require(bytes(_registrationNumber).length > 0);
        require(bytes(_mobile).length > 0);
        require(bytes(_email).length > 0);

        Hospital memory _hospital = hospitals[_id];

        if (bytes(_accountType).length > 0 && bytes(_name).length > 0 && bytes(_contactAddress).length > 0 && bytes(_registrationNumber).length > 0 && bytes(_mobile).length > 0 && bytes(_email).length > 0) {
            
            _hospital.userId = _userId;
            _hospital.accountType = _accountType;
            _hospital.name = _name;
            _hospital.contactAddress = _contactAddress;
            _hospital.registrationNumber = _registrationNumber;
            _hospital.mobile = _mobile;
            _hospital.email = _email; 

            hospitals[_id] = _hospital;
            emit HospitalAccount(_hospital.id, _hospital.userId, _hospital.accountType, _hospital.name, _hospital.contactAddress, _hospital.registrationNumber, _hospital.mobile, _hospital.email, _hospital.status);
        } else {
            emit AccountCreationFailed( "account creation attempt failed", _accountType, 400);
        }                                                   
    }

    function createHospitalStaffAccount(string memory _name, address _userId, string memory _password, string memory _mobile, string memory _email, string memory _accountType, string memory _gender, uint _hospitalId) public {
     
        require(bytes(_name).length > 0);
        require(bytes(_password).length > 0);
        require(bytes(_mobile).length > 0);
        require(bytes(_email).length > 0);
        require(bytes(_accountType).length > 0);
        require(bytes(_gender).length > 0);

        if (bytes(_accountType).length > 0 && bytes(_name).length > 0 && bytes(_password).length > 0 && bytes(_mobile).length > 0 && bytes(_mobile).length > 0 && bytes(_accountType).length > 0 && bytes(_gender).length > 0 ) {
            hospitalStaffCount++;
            hospitalStaffs[hospitalStaffCount] = HospitalStaff(hospitalStaffCount, _name, _userId, _password, _mobile, _email, _accountType, _gender, _hospitalId);
            emit HospitalStaffAccount(hospitalStaffCount, _name, _userId, _mobile, _email, _accountType, _gender, _hospitalId);
        } else {
            emit AccountCreationFailed( "account creation attempt failed", _accountType, 400);
        }                                                   
    }

    function createPatientAccount(address _userId, string memory _name, string memory _dateOfBirth, string memory _password, string memory _email, string memory _accountType, string memory _gender) public {
        
        require(bytes(_name).length > 0);
        require(bytes(_dateOfBirth).length > 0);
        require(bytes(_password).length > 0);
        require(bytes(_email).length > 0);
        require(bytes(_accountType).length > 0);
        require(bytes(_gender).length > 0);
        

        if (bytes(_accountType).length > 0 && bytes(_name).length > 0 && bytes(_password).length > 0 && bytes(_email).length > 0 && bytes(_email).length > 0 && bytes(_accountType).length > 0 && bytes(_gender).length > 0 ) {
            patientCount++;
            patients[patientCount] = Patient(patientCount, _userId, _name, _dateOfBirth, _password, _email, _accountType, _gender);
            emit PatientAccount(patientCount, _userId, _name, _dateOfBirth, _email, _accountType, _gender);
        } else {
            emit AccountCreationFailed( "account creation attempt failed", _accountType, 400);
        }                                                   
    }

    function createPatientMedicalRecord(uint _patient, uint _hospital, uint _doctor, string memory _date, string memory _vitals, string memory _diagnosis, string memory _treatments, string memory _doctorNote) public {
        require(_patient > 0 && _patient <= patientCount);
        require(_hospital > 0 && _hospital <= hospitalCount);
        require(_doctor > 0 && _doctor <= hospitalStaffCount);
        require(bytes(_date).length > 0);
        require(bytes(_vitals).length > 0);
        require(bytes(_diagnosis).length > 0);
        require(bytes(_treatments).length > 0);
        require(bytes(_doctorNote).length > 0);

        if ( (_patient > 0 && _patient <= patientCount) && (_hospital > 0 && _hospital <= hospitalCount) && (_doctor > 0 && _doctor <= hospitalStaffCount) && bytes(_date).length > 0 && bytes(_vitals).length > 0 && bytes(_diagnosis).length > 0 && bytes(_treatments).length > 0 && bytes(_doctorNote).length > 0 ) {
            patientMedicalRecordCount++;
            patientMedicalRecords[patientMedicalRecordCount] = PatientMedicalRecord(patientMedicalRecordCount, _patient, _hospital, _doctor, _date, _vitals, _diagnosis, _treatments, _doctorNote);
            emit PatientMedicalRecordDetails(patientMedicalRecordCount, _patient, _hospital, _doctor, _date, _vitals, _diagnosis, _treatments, _doctorNote);
        } else {
            emit AccountCreationFailed( "account creation attempt failed", _date, 400);
        }                                                   
    }

    function createPatientMedicalRecordAccessRequest(uint _hospital, uint _patient, string memory _date) public {
        
        require(bytes(_date).length > 0);

        if (bytes(_date).length > 0 ) {
            patientMedicalRecordAccessRequestCount++;
            patientMedicalRecordAccessRequests[patientMedicalRecordAccessRequestCount] = PatientMedicalRecordAccessRequest(patientMedicalRecordAccessRequestCount, _hospital, _patient, _date, false, false);
            emit PatientMedicalRecordAccessRequested(patientMedicalRecordAccessRequestCount, _hospital, _patient, _date, false, false);
        } else {
            emit AccountCreationFailed( "PMRAccessRequest Creation Failed", _date, 400);
        }                                                       
    
    }

    function createScheduledAppointment(uint _hospital, uint _patient, string memory _date, string memory _dueDate, string memory _purpose, string memory _doctorNote) public {
        require(_patient > 0 && _patient <= patientCount);
        require(_hospital > 0 && _hospital <= hospitalCount);        
        require(bytes(_date).length > 0);
        require(bytes(_dueDate).length > 0);
        require(bytes(_purpose).length > 0);
        require(bytes(_doctorNote).length > 0);

        if ( (_patient > 0 && _patient <= patientCount) && (_hospital > 0 && _hospital <= hospitalCount) && bytes(_date).length > 0 && bytes(_dueDate).length > 0 && bytes(_purpose).length > 0 && bytes(_doctorNote).length > 0 ) {
            appointmentCount++;
            appointments[appointmentCount] = ScheduledAppointment(appointmentCount, _hospital, _patient, _date, _dueDate, _purpose, _doctorNote);
            emit AppointmentScheduled(appointmentCount, _hospital, _patient, _date, _dueDate, _purpose, _doctorNote);
        } else {
            emit AccountCreationFailed( "account creation attempt failed", _date, 400);
        }
    }

    function administratorLogin(string memory _password) public {
        Administrator memory _admin;
        
        require(bytes(_password).length > 0);
    
        for (uint i=1; i<=administratorCount; i++) {
            if (administrators[i].userId == msg.sender) {
                _admin = administrators[i];
            }
        }

        if (bytes(_admin.password).length > 0 && bytes(_admin.accountType).length > 0 && bytes(_admin.name).length > 0) {
            if (compareStrings( _admin.password, _password)) {
                emit AdministratorAccount( _admin.id, _admin.userId, _admin.name, _admin.accountType );
            } else {
                emit LoginAttemptFailed("Invalid User ID or Password, Please try again.", 400, msg.sender);
            }
        } else {
             emit LoginAttemptFailed("Invalid User ID or Password, Please try again.", 400, msg.sender);
        }
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function hospitalLogin(string memory _password) public {
        HospitalStaff memory _hospitalStaff;
        
        require(bytes(_password).length > 0);
    
        for (uint i=1; i<=hospitalStaffCount; i++) {
            if (hospitalStaffs[i].userId == msg.sender) {
                _hospitalStaff = hospitalStaffs[i];
            }
        }

        if (bytes(_hospitalStaff.password).length > 0 && bytes(_hospitalStaff.accountType).length > 0 && bytes(_hospitalStaff.name).length > 0) {
            if (compareStrings( _hospitalStaff.password, _password)) {
                emit HospitalStaffAccount( _hospitalStaff.id, _hospitalStaff.name, _hospitalStaff.userId, _hospitalStaff.mobile, _hospitalStaff.email, _hospitalStaff.accountType, _hospitalStaff.gender, _hospitalStaff.hospitalId);

            } else {
                emit LoginAttemptFailed("Invalid User ID or Password, Please try again.", 400, msg.sender);
            }
        } else {
             emit LoginAttemptFailed("Invalid User ID or Password, Please try again.", 400, msg.sender);
        }
    }

    function patientLogin(string memory _password) public {
        Patient memory _patient;
        
        require(bytes(_password).length > 0);
    
        for (uint i=1; i<=patientCount; i++) {
            if (patients[i].userId == msg.sender) {
                _patient = patients[i];
            }
        }

        if (bytes(_patient.password).length > 0 && bytes(_patient.accountType).length > 0 && bytes(_patient.name).length > 0) {
            if (compareStrings( _patient.password, _password)) {
                emit PatientAccount( _patient.id, _patient.userId, _patient.name, _patient.dateOfBirth,  _patient.email,  _patient.accountType, _patient.gender );
            } else {
                emit LoginAttemptFailed("Invalid User ID or Password, Please try again.", 400, msg.sender);
            }
        } else {
             emit LoginAttemptFailed("Invalid User ID or Password, Please try again.", 400, msg.sender);
        }
    }

    function rejectPMRAccessRequest(uint _id) public {
        require(_id > 0 && _id <= patientMedicalRecordAccessRequestCount);

        PatientMedicalRecordAccessRequest memory _pmrAccessRequest = patientMedicalRecordAccessRequests[_id];
        _pmrAccessRequest.rejected = true;
        _pmrAccessRequest.approved = false;
        patientMedicalRecordAccessRequests[_id] = _pmrAccessRequest;

        emit PatientMedicalRecordAccessRequested(_pmrAccessRequest.id, _pmrAccessRequest.hospital, _pmrAccessRequest.patient, _pmrAccessRequest.date, _pmrAccessRequest.approved, _pmrAccessRequest.rejected);
    }

    function approvePMRAccessRequest(uint _id) public {
        require(_id > 0 && _id <= patientMedicalRecordAccessRequestCount);

        PatientMedicalRecordAccessRequest memory _pmrAccessRequest = patientMedicalRecordAccessRequests[_id];
        _pmrAccessRequest.approved = true;
        patientMedicalRecordAccessRequests[_id] = _pmrAccessRequest;

        emit PatientMedicalRecordAccessRequested(_pmrAccessRequest.id, _pmrAccessRequest.hospital, _pmrAccessRequest.patient, _pmrAccessRequest.date, _pmrAccessRequest.approved, _pmrAccessRequest.rejected);
    }
}