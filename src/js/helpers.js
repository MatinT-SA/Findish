const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(() => {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    })
}

export const AJAX = async function (url, uploadData = undefined, method = 'GET') {
    try {
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (uploadData) fetchOptions.body = JSON.stringify(uploadData);

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch from server: ${response.status} - ${errorMessage}`);
        }

        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error('AJAX error:', error);
        throw error;
    }
};