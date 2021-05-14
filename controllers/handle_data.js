// format date
function formatDate(dateobj) {
    if(dateobj === undefined) return ""
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let month = dateobj.getMonth()
    let date = dateobj.getDate()
    let year = dateobj.getFullYear()
    return `${months[month]} ${date}th, ${year}`
}

function toLetterCase(string) {
    return string.split(" ").map(word => {return word[0].toUpperCase() + word.slice(1)}).join(" ")
  }

module.exports = {
    formatDate,
}