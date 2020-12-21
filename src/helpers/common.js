// pass a values object and url link e.g values.email or values.isPublic
export async function postToApi (values, url) {
    return new Promise(async (resolve, reject) => {
        try {
            const fields = Object.keys(values);
            const formData = new FormData();
            fields.forEach(field => {
                formData.append(field, values[field]);
            })
            const params = new URLSearchParams(formData.entries());
            const response = await fetch(url, {method: "POST", body: params});
            const result = await response.json();
            resolve(result);
        } catch (err) {
            if (err) reject(err);
        }
    })
}

export function fetchFromApi (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`/api/${link}`);
            const apiResponse = await response.json();
            if (!apiResponse.success) return reject(apiResponse.err);
            resolve(apiResponse.result);
        } catch (err) {
            reject(err);
        }
    })
}

export function deleteFromApi (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`/api/${link}`, {method: 'DELETE'});
            const apiResponse = await response.json();
            if (!apiResponse.success) return reject(apiResponse.err)
            resolve(apiResponse.result);
        } catch (err) {
            reject(err);
        }
    })
}

export function checkForUser (setUser, setUserCheckDone) {
    fetch('/api/getuserdetails')
        .then(response => response.json())
        .then(apiResponse => {
            if (apiResponse.success) setUser(apiResponse.result.username);
            setUserCheckDone(true);
        })
        .catch(err => console.log(err))
}

export function getCategories () {
    const categories = [
        {name: 'towatch', text: 'To Watch'},
        {name: 'ranked', text: 'Ranked'},
        {name: 'other', text: 'Other'}
    ]
    categories.ranked = 'Ranked';
    categories.towatch = 'To Watch';
    categories.other = 'Other';
    return categories
} 
export function getPageFromPath (pathname) {
    // e.g. pathname /some/thing/here. return 'here'
    return pathname.split('/').slice(-1)[0];
}