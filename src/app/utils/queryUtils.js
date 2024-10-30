

import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";
import User from "@/app/model/user";
import {checkIfExist, getSecuredItem, removeItem, setSecuredItem} from "@/app/utils/cookiesUtils";
import {deleteUserData, saveUserData} from "@/app/controller/userController";
import Movie from "@/app/model/movie";

/**
 * Delete the token and the user data from the cookies
 * @returns {Promise<void>}
 */
export const logout = async () => {
    await removeItem('token');
    await deleteUserData();
}

/**
 * Send a request to the server to authenticate the user with the email and password
 * @returns {Promise<ServerResponse>}
 */
export const login = async (key) => {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({key}),
    });

    if (res.status === 200) {
        const data = await res.json();
        let user = new User(data.data.name, data.data.surname);
        await saveUserData(user);
        await setSecuredItem('token', data.token);
        return new ServerResponse(true, null, user);
    } else if (res.status === 404 || res.status === 401) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

/**
 * Utilise le token stocké dans les cookies pour vérifier si l'utilisateur est authentifié
 * si l'utilisateur est authentifié, les données de l'utilisateur sont récupérées et stockées dans les cookies
 * sinon, les cookies sont supprimés
 * @returns {Promise<ServerResponse>}
 */
export const loginToken = async () => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch('/api/loginToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });
    console.log(res.status);
    if (res.status === 200) {

        const data = await res.json();
        let user = new User(data.data.name, data.data.surname);
        await saveUserData(user);
        return new ServerResponse(true, null, user);
    } else if (res.status === 404) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    } else if (res.status === 401) {
        await logout();
        return new ServerResponse(false, ErrorTypes.WRONGTOKEN, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

/**
 * Send a request to the server to insert an entity into the database
 * @param tableName the name of the table in the database
 * @param entity the entity to insert
 * @returns {Promise<ServerResponse>}
 */
export const insertEntity = async (tableName, entity) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/${tableName}/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({entity, token}),
    });

    if (res.status === 200) {
        return new ServerResponse(true, null, null);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

/**
 * Send a request to the server to get all the entities in database the user has access to
 * @param tableName the name of the table in the database
 * @returns {Promise<ServerResponse>}
 */
export const getAllEntity = async (tableName) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/${tableName}/getAll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
    });

    if (res.status === 200) {
        return new ServerResponse(true, null, null);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

/**
 * Send a request to the server to update an entity in the database
 * @param tableName the name of the table in the database
 * @param entity the entity to update
 * @returns {Promise<ServerResponse>}
 */
export const updateEntity = async (tableName, entity) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/${tableName}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({entity, token}),
    });

    if (res.status === 200) {
        return new ServerResponse(true, null, null);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

/**
 * Send a request to the server to delete an entity in the database
 * @param tableName the name of the table in the database
 * @param entity the entity to delete
 * @returns {Promise<ServerResponse>}
 */
export const deleteEntity = async (tableName, entity) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/${tableName}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({entity, token}),
    });

    if (res.status === 200) {
        return new ServerResponse(true, null, null);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getPopularMovies = async () => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/scrape/popular/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        const movies = data.data.itemListElement.map(item => new Movie(item.item.image, item.item.name, item.item.url));
        return new ServerResponse(true, null, movies);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const searchMovie = async (searchValue) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/scrape/search/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({searchValue, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        const movies = data.data.itemListElement.map(item => new Movie(item.item.image, item.item.name, item.item.url));
        return new ServerResponse(true, null, movies);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getMovieDetails = async (movieUrl) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/scrape/details/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({movieId: movieUrl, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.data);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const streamMovie = async (torrentUrl) => {

    let token;
    if (await checkIfExist('token')) {
        token = await getSecuredItem('token');
    } else {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/scrape/stream/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({torrentUrl, token}),
    });

    if (res.ok) {
        const { streamId } = await res.json();
        const streamUrl = `/api/scrape/stream/${streamId}`;
        return new ServerResponse(true, null, streamUrl);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}