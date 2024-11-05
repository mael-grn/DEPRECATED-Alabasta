
import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";
import {getItem, setItem} from "@/app/utils/cookieUtils";

export const localSaveMedia = async (media) => {
    await setItem(media.id, JSON.stringify(media));
}

export const localRecoverMedia = async (mediaId) => {
    const data = await getItem(mediaId);
    return data? JSON.parse(data) : null;
}

export const getPopularMovies = async () => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/popular/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.movies);
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

    const res = await fetch(`/api/media/search/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({searchValue, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.movies);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const getMediaDetails = async (media) => {

    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/getDetails/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({media, token}),
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.media);
    } else if (res.status === 401) {
        return new ServerResponse(false, ErrorTypes.UNAUTHORIZED, null);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const initStreamMedia = async (torrentUrl) => {
    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    const res = await fetch(`/api/media/initStream/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({torrentUrl, token}),
    });

    if (res.ok) {
        const { streamId } = await res.json();
        const streamUrl = `/api/media/stream/${streamId}`;
        return new ServerResponse(true, null, streamUrl);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}

export const searchSubtitles = async (media) => {

    const res = await fetch(`/api/media/subs/search/${media.imdbID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.status === 200) {
        const data = await res.json();
        return new ServerResponse(true, null, data.subsId);
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

    const res = await fetch(`/api/media/subs/download`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({subsId, token}),
    });

    if (res.ok) {
        const data = await res.json();
        return new ServerResponse(true, null, data.subs);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}