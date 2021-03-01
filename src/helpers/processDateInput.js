export const processDateInput = (dateString) => {
    const targetDate = new Date(dateString);
    const dd = targetDate.getDate();
    const mm = targetDate.getMonth()+1; 
    const yyyy = targetDate.getFullYear();
    return `${yyyy}-${mm}-${dd }`;
}