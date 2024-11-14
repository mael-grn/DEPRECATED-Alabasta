import {getItem} from "@/app/utils/cookieUtils";
import ServerResponse, {ErrorTypes} from "@/app/model/serverResponse";

export const fetchProxy = async (link) => {
    let token = await getItem('token');
    if (!token) {
        return new ServerResponse(false, ErrorTypes.NOUSER, null);
    }

    if (!link.startsWith("https://")) {
        link = "https://" + link;
    }

    let result = await fetch(`/api/proxy/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({link, token}),
    });

    if (result.ok) {
        const data = await result.json();
        return new ServerResponse(true, null, data.res);
    } else {
        return new ServerResponse(false, ErrorTypes.SERVER, null);
    }
}