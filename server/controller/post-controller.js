import Post from '../model/post.js';

export const createPost = async (request, response) => {
    try {
        const { username, picture, title, description, categories, createdDate } = request.body;
        if (!username || !picture) {
            return response.status(400).json({ msg: "username and picture are required" });
        }
        if (!title || !description) {
            return response.status(400).json({ msg: "title and description are required" });
        }
        const post = new Post({
            title,
            description,
            picture,
            username,
            categories: categories || "All",
            createdDate: createdDate || new Date()
        });

        await post.save();
        return response.status(200).json({ msg: 'Post saved successfully', post });
    } catch (error) {
        console.error("Error creating post:", error);
        return response.status(500).json({ msg: "Server error", error });
    }
};


export const updatePost = async (request, response) => {
    console.log("Update params.id:", request.params.id);
    console.log("Update body:", request.body);
    try {
        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });
        response.status(200).json("Post updated successfully");
    } catch (error) {
        console.log("Update error:", error.message);
        response.status(500).json(error);
    }
}

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findByIdAndDelete(request.params.id);
        if (!post) {
            return response.status(404).json({ msg: "Post not found" });
        }
        return response.status(200).json({ msg: "Post deleted successfully" });
    } catch (error) {
        console.error("Error while deleting post:", error);
        return response.status(500).json({ msg: "Error while deleting post" });
    }
};

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error)
    }
}

export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let posts;
    try {
        if (username)
            posts = await Post.find({ username: username });
        else if (category)
            posts = await Post.find({ categories: category });
        else
            posts = await Post.find({});
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error)
    }
}

export const getType = (value, param) => {
    if (value.params) {
        return { params: param };   
    }
    if (value.query) {
        return { query: param };
    }
    return {};
};
