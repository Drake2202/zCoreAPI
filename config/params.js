import mysql from 'mysql2/promise';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import express from "express";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const sessionSecret = process.env.SECRET_KEY;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60 * 60 * 1000}
}));

function generateToken(userId) {
    const payload = { userId};
    return jwt.sign(payload, sessionSecret, { expiresIn: '1h'})
}
export {pool, app, generateToken };