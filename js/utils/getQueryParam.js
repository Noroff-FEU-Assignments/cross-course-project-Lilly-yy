export function getQueryParam(param) {
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

const id = getQueryParam("name");