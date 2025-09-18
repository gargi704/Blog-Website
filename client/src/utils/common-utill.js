export const getRefreshToken = () => {
    return sessionStorage.getItem('refreshToken');
}

export const setAccessToken = (accessToken) => {
    sessionStorage.setItem('accessToken', accessToken);  
};

export const setRefreshToken = (refreshToken) => {
    sessionStorage.setItem('refreshToken', `Bearer ${refreshToken}`);
}

export const getAccessToken = () => sessionStorage.getItem('accessToken');

export const getType = (service, param) => {
    if (param) return { params: param };
    return {};
};





