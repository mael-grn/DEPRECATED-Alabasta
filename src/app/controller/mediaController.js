
import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";
import {getItem} from "@/app/utils/cookieUtils";

export const getPopularMovies = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/popular/`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        }
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getNowPlayingMovies = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/nowPlaying/`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        },
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getTopRatedMovies = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/topRated/`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        },
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getUpcomingMovies = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/upcoming/`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        },
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const searchMedia = async (searchValue) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/search/${searchValue}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        },
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getMovieDetails = async (movieId) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/details/movie/`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({movieId, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getTvDetails = async (tvId) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/details/tv/`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({tvId, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getSeasonDetails = async (tvId, season) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/details/tv/season`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({tvId, season, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}








