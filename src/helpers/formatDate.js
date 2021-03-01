export const formatDate = (date_info) => {
    try {
        const eventStartDate = new Date(date_info.toDate());
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(eventStartDate ) 
        return `${parseInt(day, 10)}  ${month},  ${year }`;
    } catch(ex) {
        const parts = date_info.split('-');
        const eventStartDate = new Date(parts[0], parts[1] - 1, parts[2]);
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(eventStartDate ) 
        return `${parseInt(day, 10)}${getDaylabel(day)}  ${month},  ${year }`;
    }
}


function getDaylabel(day) {
    switch(parseInt(day, 10)) {
        case 11:
        case 12:
        case 13:
            return 'th'

        case 1:
        case 21:
        case 31:
            return 'st'

        case 2:
        case 22:
            return 'nd'

        case 3:
        case 23:
            return 'rd'

        default:
            return 'th'
    }
}