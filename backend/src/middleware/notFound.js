/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Middleware to handle 404 Not Found errors for undefined routes.
 * 
 */

/*------------------------------------------------------------------------------
                                MIDDLEWARE
------------------------------------------------------------------------------*/

/**
 * @brief 404 Not Found handler.
 * 
 * @param req Express request object.
 * @param res Express response object.
 */
export default function notFound(req, res) {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
}
// req.method shows GET/POST/PATCH/DELETE
//req.orginalUrl shows the path they tried