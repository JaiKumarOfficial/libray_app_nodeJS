// format date
function formatDate(dateobj) {
    if(dateobj === undefined || dateobj === null) return ""
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let month = dateobj.getMonth()
    let date = dateobj.getDate()
    let year = dateobj.getFullYear()
    return `${months[month]} ${date}th, ${year}`
}

function formatDate_mmddyyyy(dateobj) {
    if(dateobj === undefined || dateobj === null) return ""

    let month = dateobj.getMonth()<10 ? '0'+String(dateobj.getMonth()+1) : dateobj.getMonth()+1
    let date = dateobj.getDate()<10 ? '0'+dateobj.getDate() : dateobj.getDate()
    let year = dateobj.getFullYear()
    return `${month}/${date}/${year}`
}

// validate date
function validDate(str_date, err_msg) {
    if(isNaN(Date.parse(str_date))) {
        throw new Error(err_msg)
    }
    return true;
}
function toLetterCase(string) {
    return string.split(" ").map(word => {return word[0].toUpperCase() + word.slice(1)}).join(" ")
  }


module.exports = {
    formatDate,
    validDate,
    formatDate_mmddyyyy,
}