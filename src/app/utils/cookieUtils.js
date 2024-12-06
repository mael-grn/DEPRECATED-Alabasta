'use server'

import {cookies} from "next/headers";

export const setItem = async (key, value, options = {}) => {
    const { expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), path = '/', secure = true, httpOnly = true, sameSite = 'None' } = options;

    await cookies().set(key, value, {
        expires, // Date d'expiration
        path, // Portée du cookie
        secure, // HTTPS obligatoire
        httpOnly, // Accès uniquement via HTTP
        sameSite, // Politique SameSite
    });
}

export const getItem = async (key) => {
    return cookies().get(key)?.value;
}

export const checkItem = async (key) => {
    return cookies().has(key);
}

export const deleteItem = async (key) => {
    await cookies().delete(key);
}