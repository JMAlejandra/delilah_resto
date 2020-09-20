const checkNewProductFields = (req, res, next) => {
    const { description, price, image_url, is_favorite, is_enabled } = req.body
    if (!description || !price || !image_url || !is_favorite || !is_enabled) {
        res.status(400).send("Product information missing")
    } else {
        next()
    }
}

module.exports = checkNewProductFields