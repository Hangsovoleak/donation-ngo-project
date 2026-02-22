//errorHandler.js
export default function errorHandler(err, req, res, next) {
    //prints the error in terminal easy for debug
    console.error(err);

    //if set custom with error status shold use it
    const status = err.statusCode || 500;
    //send response with error message
    res.status(status).json({
        message: err.message || "Server error",
    });
}
