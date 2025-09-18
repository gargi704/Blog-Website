// API NOTIFICATION MESSAGES
export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: "Loading...",
        message: "Data is being loaded. Please wait"
    },
    success: {
        title: "Success",
        message: "Data successfully loaded"
    },
    requestFailure: {
        title: "Error!",
        message: "An error occur while parsing request data"
    },
    responseFailure: {
        title: "Error!",
        message: "An error occur while fetching response from server. Please try again"
    },
    networkError: {
        title: "Error!",
        message: "Unable to connect to the server. Please check internet connectivity and try again."
    }
}

export const SERVICE_URLS = {
    // Auth
    userLogin: { url: '/login', method: 'POST' },
    userSignup: { url: '/signup', method: 'POST' },
    userLogout: { url: '/logout', method: 'POST' },
    getRefreshToken: { url: '/token', method: 'POST' },

    // Posts
    createPost: { url: '/create', method: 'POST' },
    getAllPosts: { url: '/posts', method: 'GET' },
    getPost: { url: '/post', method: 'GET', params: true }, 
    updatePost: { url: '/update', method: 'PUT', params: true }, 
    deletePost: { url: '/delete', method: 'DELETE', params: true }, 
    // File
    uploadFile: { url: '/file/upload', method: 'POST' },
    getImage: { url: '/file', method: 'GET', params: true },
    // Comments
    newComment: { url: '/comment/new', method: 'POST' },
    getAllComments: { url: '/comment', method: 'GET', params: true }, 
    deleteComment: { url: '/comment/delete', method: 'DELETE', params: true } 
}