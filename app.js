import express from "express";
import bodyParser from "body-parser";
import session from "express-session"; // Import express-session
import { handleLogin } from './modules/login.js';
import { handleRegister } from "./modules/register.js";
import { getVersion } from "./modules/game.js";
import { authMiddleware } from "./middlewares/auth.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON data in the request body
app.use(session({ // Add session middleware
    secret: process.env.SECRET_KEY, // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true in production if using HTTPS
        maxAge: 3600000 // Set session expiration time
    }
}));


// Define static directory for serving public files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/gamefiles/:filename', authMiddleware, (req, res) => {
    // Construct the file path
    const filePath = path.join(__dirname, 'public', 'gamefiles', req.params.filename);

    // Send the file
    res.sendFile(filePath);
});

// Define routes
app.get('/home', (req, res) => {
    // Send the home page HTML file
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login', (req, res) => {
    // Send the login page HTML file
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    // Send the register page HTML file
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/game', (req, res) => {
    // Send the game page HTML file
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// API endpoints (corrected middleware order)
app.post('/api/login', handleLogin);
app.post('/api/register', handleRegister);
app.get('/api/version', authMiddleware, getVersion); // Apply auth middleware to getVersion endpoint


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
