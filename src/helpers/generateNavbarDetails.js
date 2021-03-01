import Identicon from 'identicon.js'
import { isEmptyObject } from './isEmptyObject'

export const generateNavbarDetails = (userDetails={}, hospital={}) => {
    const pageTitle = getPageTitle(userDetails, hospital)
    const pageIcon = getPageIcon(userDetails, hospital)
    const userName = getUsername(userDetails)
    const userIcon = getUserIcon(userDetails)

    return {
        pageTitle: pageTitle,
        pageIcon: pageIcon,
        userName: userName,
        userIcon: userIcon
    }
}

function getPageTitle(userDetails, hospital) {
    let pageTitle = ""
    switch(userDetails.accountType) {
        case 'administrator':
            pageTitle = "Administrator Management Console"
            break;
        
        case 'hospital staff':
            pageTitle = hospital.name
            break;

        case 'patient':
            pageTitle = "CBHR Application User"
            break;

        default:
            pageTitle = "CBHR"
    }

    return pageTitle
}

function getPageIcon(userDetails, hospital) {
    let pageIcon = ""
    switch(userDetails.accountType) {
        case 'administrator':
            pageIcon = `<a class="nav-link text-secondary" href="#"><i class="fas fa-users-cog fa-2x mr-3"></i></a>`
            break;
        
        case 'hospital staff':
            pageIcon = `<img width='30' height='30' src="${getAccountImage(hospital)}" alt="" class="mr-3" />`
            break;

        case 'patient':
            pageIcon = `<a class="nav-link text-secondary" href="#"><i class="fas fa-hospital-user fa-2x mr-3"></i></a>`
            break;

        default:
            pageIcon = `<img alt="Vue logo" src="../assets/cbhr.png" width="40px" height="40px" style="margin-right: 10px;">`
    }

    return pageIcon   
}

function getUsername(userDetails) {
    if (isEmptyObject(userDetails)) {
        return ""
    }
    return userDetails.name
}

function getUserIcon(userDetails) {
    if (isEmptyObject(userDetails)) {
        return ""
    }
    return `<img width='30' height='30' src="${getAccountImage(userDetails)}" alt="" class="mr-3" />`
}

function getAccountImage(targetUser) {
    return `data:image/png;base64, ${new Identicon(targetUser.userId + targetUser.name, 30).toString()}`
}