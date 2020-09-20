const isObjectEmpty = (object) => {
    return Object.keys(object).length === 0 && object.constructor === Object ? true : false
}

module.exports = isObjectEmpty