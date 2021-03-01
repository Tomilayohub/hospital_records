
function buildFromAdministrator() {
    return 'System Administrator <no-reply@support-cbhr.com>'
}

function buildContact(sender, email) {
    return `${sender} <${email}>`
}

function getHospitalMessageBody(recipientName, recipientEmail, accountToken) {
    return `Hi ${recipientName},

    Hospital Account Registration Notification

    We wish to inform you a hospital your hospital record
    has been created and the details listed below

    Account Details
    ===============

    Name: ${recipientName}
    Email: ${recipientEmail}
    Account IDs: ${accountToken}

    Best Regards,
    System Administrator.

    `
}

function getHospitalStaffMessageBody(recipientName, accountToken, password, hospitalName, recipientEmail) {
    return `
    Hi ${recipientName},
    
    Hospital Staff Account Registration Notification

    We wish to inform you a been registered to ${hospitalName} hospital as a  your hospital staff personel.
    Your details are listed below

    Account Details
    ===============
    Name: ${recipientName}
    Email: ${recipientEmail}
    Account IDs: ${accountToken}
    Password: ${password}

    Best Regards,
    System Administrator.
    `
}

export const getPatientMessageBody = (recipientName, accountToken, password, hospitalName, doctorName, recipientEmail) => {
    return `
    Hi ${recipientName},
    
    Patient Account Registration Notification

    We wish to inform you that ${doctorName} of ${hospitalName} hospital created your patient medical.
    Your details are listed below

    Account Details
    ===============
    Name: ${recipientName}
    Email: ${recipientEmail}
    Account IDs: ${accountToken}
    Password: ${password}

    Best Regards,
    ${hospitalName}.
    `
}

function getAccessRequestPMRBody(recipientName, hospitalName, doctorName) {
    return `
    Hi ${recipientName},

    Access Request to PMR
    We wish to inform you that ${doctorName} of ${hospitalName} hospital has requested access to your medical record.
    If you are aware of the hospital need to to access your record, please approve the request or reject if you're unsure.

    Best Regards,
    ${hospitalName}.
`
}

function getApprovalRequestPMRBody(patientName, hospitalName) {
    return `
        Hi ${hospitalName},

        Approved Access Request to PMR

        We wish to inform your that ${patientName} has Approved the quest made to access PMR

        Best Regards,
        System Administrator.
    `
}

function getRejectedRequestPMRBody(patientName, hospitalName) {
    return `
    Hi ${hospitalName},

    Rejected Access Request to PMR
    We wish to inform you that ${patientName} has rejected the quest made to access PMR

    Best Regards,
    System Administrator.
`
}

export const getHospitalAccountCreatedEmail = (recipientName, recipientEmail, accountToken) => {
    return getHospitalMessageBody(recipientName, accountToken)
}

// export const getHospitalAccountCreatedEmail = (recipientName, recipientEmail, accountToken) => {
    // return { 
        // from: buildFromAdministrator(),
        // to: buildContact(recipientName, recipientEmail),
        // subject: 'Account Registration notification',
        // text: getHospitalMessageBody(recipientName, accountToken)
    // }
// }

export const getHospitalStaffAccountCreatedEmail = (recipientName, recipientEmail, accountToken, password, hospitalName) => {
    return getHospitalStaffMessageBody(recipientName, accountToken, password, hospitalName, recipientEmail)
}

// export const getHospitalStaffAccountCreatedEmail = (recipientName, recipientEmail, accountToken, password, hospitalName) => {
    // return { 
        // from: buildFromAdministrator(),
        // to: buildContact(recipientName, recipientEmail),
        // subject: 'Account Registration notification',
        // text: getHospitalStaffMessageBody(recipientName, accountToken, password, hospitalName, recipientEmail)
    // }
// }

export const getPatientAccountCreatedEmail = (recipientName, recipientEmail, accountToken, password, hospitalName, hospitalEmail, doctorName) => {
    return { 
        from: buildContact(hospitalName, `noreply-${hospitalEmail}`),
        to: buildContact(recipientName, recipientEmail),
        subject: 'Account Registration notification',
        text: getPatientMessageBody(recipientName, accountToken, password, hospitalName, doctorName, recipientEmail)
    }
}

export const getRequestAccessToPatientMedicalRecordEmail = (recipientName, recipientEmail, hospitalName, hospitalEmail, doctorName) => {
    return { 
        from: buildContact(hospitalName, `noreply-${hospitalEmail}`),
        to: buildContact(recipientName, recipientEmail),
        subject: 'Request Access to PMS',
        text: getAccessRequestPMRBody(recipientName, hospitalName, doctorName)
    }
}

export const getApprovedAccessToPMSEmail = (patientName, hospitalName, hospitalEmail) => {
    return { 
        from: buildFromAdministrator(),
        to: buildContact(hospitalName, hospitalEmail),
        subject: 'Approved Access to PMS',
        text: getApprovalRequestPMRBody(patientName, hospitalName)
    }
}

export const getRejectedAccessToPMSEmail = (patientName, hospitalName, hospitalEmail) => {
    return { 
        from: buildFromAdministrator(),
        to: buildContact(hospitalName, hospitalEmail),
        subject: 'Rejected Access to PMS',
        text: getRejectedRequestPMRBody(patientName, hospitalName)
    }
}