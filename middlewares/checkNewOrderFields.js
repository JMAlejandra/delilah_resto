const checkIfIsObject = (object) => {
    return typeof object === 'object' && object !== null ? true : false
}

const checkProductFields = (product) => {
    let flag = true
    const { id_product, quantity } = product
    if (!id_product || !quantity) return flag = false
    return flag
}

const checkProductsArray = (products) => {
    let flag = true
    products.forEach(product => {
        if (!checkIfIsObject(product)) return flag = false // checks if its an object
        if (Array.isArray(product)) return flag = false    // checks if its an array
        if (!checkProductFields(product)) return flag = false       // checks that product has an id and a quantity
    })
    return flag
}

const checkNewOrderFields = (req, res, next) => {
    const { id_payment_option, products } = req.body
    if (!id_payment_option || !products || !products.length || !Array.isArray(products) || !checkProductsArray(products))
        return res.status(400).send("Order information missing")
    next()
}

module.exports = checkNewOrderFields