const notFound = (req, res, next) => {
    const error = new Error(`Resorces not found for ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    const statusCode = req.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
}

module.exports = {notFound, errorHandler}