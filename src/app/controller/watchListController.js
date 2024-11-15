import {getItem} from "@/app/utils/cookieUtils";
import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";
import {localRecoverUser} from "@/app/controller/userController";

export const checkIfInWatchList = async (id) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/watchList/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, token}),
    });

    if (res.ok) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const removeFromWatchList = async (id) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/watchList/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, token}),
    });

    if (res.ok) {
        return new ServerResponse(true, null, true);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const addToWatchList = async (id) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/watchList/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, token}),
    });

    if (res.ok) {
        return new ServerResponse(true, null, true);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getAll = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }
    let user = await localRecoverUser();
    if (!user) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/watchList/get/`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });

    if (res.ok) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}