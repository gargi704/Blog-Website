import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken, getType } from '../utils/common-utill';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 50000,
    headers: { "content-type": "application/json" },
    withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;

        if (config.TYPE?.params) {
            config.url = `${config.url}/${config.TYPE.params}`;
        } else if (config.TYPE?.query) {
            config.url = `${config.url}?${config.TYPE.query}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => processResponse(response),
    (error) => Promise.reject(processError(error))
);

const processResponse = (response) => {
    if (response?.status >= 200 && response?.status < 300) {
        return { isSuccess: true, data: response.data };
    } else {
        return { isFailure: true, status: response?.status, msg: response?.statusText || "Something went wrong", code: response?.status };
    }
};

const processError = (error) => {
    if (error.code === 'ECONNABORTED') return { isError: true, msg: "Request timeout. Please try again.", code: "" };
    if (error.response) {
        if (error.response.status === 403 || error.response.status === 401) sessionStorage.clear();
        return { isError: true, msg: API_NOTIFICATION_MESSAGES.responseFailure.message, code: error.response.status };
    } else if (error.request) {
        return { isError: true, msg: API_NOTIFICATION_MESSAGES.requestFailure.message, code: "" };
    } else {
        return { isError: true, msg: API_NOTIFICATION_MESSAGES.networkError.message, code: "" };
    }
};

const API = {};
for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, param) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: (value.method === 'GET' || value.method === 'DELETE') ? undefined : body,
            TYPE: getType(value, param),
        });
}

// File upload
export const uploadFile = async (formData) => {
    const res = await axios.post(`${API_URL}/file/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAccessToken()}`
        },
    });
    return res.data;
};

// Get comments for a post
export const getComments = async (postId) => {
    try {
        return await API.getAllComments(null, postId);
    } catch (error) {
        console.log("Error while calling getComments API", error);
        return { isError: true, msg: error.response?.data || error.message, code: error.response?.status };
    }
};

export { API };
