const UPDATE_HOSPITAL_RECORD = (state, payload) => {
    const stringifiedHospitalDetails = JSON.stringify(payload)

    localStorage.setItem('HOSPITAL_DETAILS', stringifiedHospitalDetails);
    state.hospital = stringifiedHospitalDetails;
}

export default UPDATE_HOSPITAL_RECORD;