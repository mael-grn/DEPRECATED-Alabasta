const activeStreams = new Map(); // Pour gérer les sessions actives

export const addStream = (streamId, torrentUrl) => {
    activeStreams.set(streamId, torrentUrl);
};

export const getStream = (streamId) => {
    return activeStreams.get(streamId);
};

export const removeStream = (streamId) => {
    activeStreams.delete(streamId);
};
