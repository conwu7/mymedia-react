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