
import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";
import {getItem, setItem} from "@/app/utils/cookieUtils";

export const localSaveMedia = async (media) => {
    await setItem(media.imdbID, JSON.stringify(media));
}

export const localRecoverMedia = async (imdbId) => {
    const data = await getItem(imdbId);
    return data? JSON.parse(data) : null;
}

export const getPopularMovies = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/popular/`, {
        method: 'GET',
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

export const getMovieDetails = async (mediaId) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/details/movie/${mediaId}`, {
        method: 'GET',
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

export const getTvDetails = async (mediaId) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/details/tv/${mediaId}`, {
        method: 'GET',
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

export const getSeasonDetails = async (mediaId, seasonNum) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/details/tv/${mediaId}/season/${seasonNum}`, {
        method: 'GET',
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

export const searchStreamingLinks = async (mediaId, type, season = null, episode = null) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    let url = `/api/media/searchLink`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({mediaId, season, episode, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        if (data.res === null || data.res.length === 0) {
            return new ServerResponse(false, ErrorTypes.NOLINKS, null);
        }
        return new ServerResponse(true, null, data.res);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const searchSubtitles = async (imdbId) => {
    const res = await fetch(`/api/subs/search/${imdbId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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

export const getSubtitles = async (subsId) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/subs/download`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({subsId, token}),
    });

    if (res.ok) {
        const data = await res.json();
        return new ServerResponse(true, null, data.res);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}
