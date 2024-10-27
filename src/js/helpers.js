import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(() => {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    })
}

export const AJAX = async function (url, uploadData = undefined, method = 'GET') {
    try {
        const fetchOptions = uploadData ? {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        } : { method: method };

        const fetchUrl = fetch(url, fetchOptions);
        const res = await Promise.race([fetchUrl, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (error) {
        throw error;
    }
};
