export default function notFound(req, res) {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
// req.method shows GET/POST/PATCH/DELETE
//req.orginalUrl shows the path they tried