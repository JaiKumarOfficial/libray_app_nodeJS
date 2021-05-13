// format date
function formatDate(dateobj) {
    if(dateobj === undefined) return ""
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let month = dateobj.getMonth()
    let date = dateobj.getDate()
    let year = dateobj.getFullYear()
    return `${months[month]} ${date}th, ${year}`
}

module.exports = {
    formatDate,
}