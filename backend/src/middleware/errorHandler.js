/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Centralized error handling middleware. Captures internal errors 
 *      and returns normalized JSON responses.
 * 
 */

/*------------------------------------------------------------------------------
                                MIDDLEWARE
------------------------------------------------------------------------------*/

/**
 * @brief Global error handler.
 * 
 * @param err Error object.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next function.
 */
export default function errorHandler(err, req, res, next) {
    console.error(err);

    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || "Server error",
    });
}
