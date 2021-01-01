// pass a values object and url link e.g values.email or values.isPublic
export async function putOrPostToApi (values, url, method) {
    return new Promise(async (resolve, reject) => {
        try {
            const fields = Object.keys(values);
            const formData = new FormData();
            fields.forEach(field => {
                formData.append(field, values[field]);
            })
            const params = new URLSearchParams(formData.entries());
            const response = await fetch(`/api/${url}`, {method: method.toUpperCase(), body: params});
            const apiResponse = await response.json();
            if (!apiResponse.success) {
                if (apiResponse.err === 'no-user') return window.location.reload();
                reject(apiResponse.err);
            }
            resolve(apiResponse.result);
        } catch (err) {
            reject(err);
        }
    })
}

export function fetchOrDeleteFromApi (link, method) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`/api/${link}`, {method: method.toUpperCase()});
            const apiResponse = await response.json();
            if (!apiResponse.success) {
                if (apiResponse.err === 'no-user') return window.location.reload();
                reject(apiResponse.err);
            }
            resolve(apiResponse.result);
        } catch (err) {
            reject(err);
        }
    })
}

export function checkForUser (setUser, setUserCheckDone) {
    return fetch('/api/getUserDetails')
        .then(response => response.json())
        .then(apiResponse => {
            if (apiResponse.success) setUser(apiResponse.result.username);
            setUserCheckDone(true);
        })
        .catch(err => console.log(err))
}

export function getCategories () {
    const categories = [
        {name: 'towatch', text: 'Movies'},
        {name: 'towatchtv', text: 'TV Shows'}
        // {name: 'ranked', text: 'Ranked'},
        // {name: 'other', text: 'Other'},
    ]
    // categories.ranked = 'Ranked';
    categories.towatch = 'Movies';
    categories.towatchtv = 'Tv Shows'
    // categories.other = 'Other';
    return categories
}
export function getPageFromPath (pathname) {
    // e.g. pathname /some/thing/here. return 'here'
    return pathname.split('/').slice(-1)[0];
}