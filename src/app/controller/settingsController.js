import {getItem, setItem} from "@/app/utils/cookieUtils";

const possibleSources = ["TheyAllSayFlix", "VidLinks", "111movies"];
export const setSource = async (source) => {
    if (possibleSources.find((x) => x === source)) {
        await setItem("source", source);
    } else {
        throw new Error("Invalid source");
    }
}

export const getSource = async () => {
    const source = await getItem("source");
    if (possibleSources.find((x) => x === source)) {
        return source;
    } else {
        return "TheyAllSayFlix";
    }
}