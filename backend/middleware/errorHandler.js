// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
    console.error(`[Unhandled Error] ${req.method} ${req.url}:`, err.stack || err.message);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: err.message || "An unexpected error occurred"
    });
}

module.exports = errorHandler;
