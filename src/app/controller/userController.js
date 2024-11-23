
import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";
import User from "@/app/model/user";
import {checkItem, deleteItem, getItem, setItem} from "@/app/utils/cookieUtils";

export const shouldBeConnected = () => {
    return checkItem('token');
}

export const localSaveUser = async (user) => {
    await setItem('user', JSON.stringify(user));
}

export const localRecoverUser = async () => {
    const text = await getItem('user');
    if (!text) {
        return null;
    }
    return JSON.parse(text);
}

/**
 * Delete the token and the user data from the cookies
 * @returns {Promise<void>}
 */
export const logout = async () => {
    localStorage.removeItem("token");
    await deleteItem('user');
    await deleteItem('token');
}

/**
 * Send a request to the server to authenticate the user with the email and password
 */
export const login = async (key) => {

    const res = await fetch(`/api/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({key}),
    });

    if (res.status === 200) {
        const data = await res.json();
        let user = new User(data.res.user.id, data.res.user.name, data.res.user.surname);
        await localSaveUser(user);
        await setItem('token', data.res.token);
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

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch('/api/user/loginToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });
    if (res.status === 200) {

        const data = await res.json();
        let user = new User(data.res.user.id, data.res.user.name, data.res.user.surname);
        await localSaveUser(user);
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

