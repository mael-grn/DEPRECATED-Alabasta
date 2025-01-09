import {getItem, setItem} from "@/app/utils/cookieUtils";

// Every possible apis and their endpoint that can be integrated in iframes
export const possibleSources = [{name: "TurboVid", endpoint: "https://turbovid.eu/api/req/"}, {name: "111movies", endpoint: "https://111movies.com/"}];

// Return just the names contained into possibleSourceName
export const possibleSourceName = possibleSources.map((item) => item.name)

/**
 * Save in local the user's choice of source.
 * @param source the name or the object of the source
 * @returns {Promise<void>}
 */
export const setUsersPreferredSource = async (source) => {
    let sourceName = source.name ? source.name : source;
    if (possibleSourceName.includes(sourceName)) {
        await setItem("source", sourceName);
    } else {
        throw new Error("Invalid source");
    }
}

/**
 * Return the user's choice of source that may have been saved in the browser. If nothing have been saved before, returns the first source of the list.
 * @returns {Promise<{name: string, endpoint: string}>}
 */
export const getUserPreferredSource = async () => {
    const item = await getItem("source");
    if (!item) {
        return possibleSources[0];
    }
    return possibleSources.find((source) => source.name === item);
}