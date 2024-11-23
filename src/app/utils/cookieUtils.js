'use server'

import {cookies} from "next/headers";

export const setItem = async (key, value) => {
    await cookies().set(key, value);
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