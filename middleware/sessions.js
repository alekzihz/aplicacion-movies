import express from 'express';
import session from 'express-session';


export const sessionMiddleware = () =>{
    return session({
        secret: 'mi-secreto',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Ajusta según tu entorno

    })
    
}
