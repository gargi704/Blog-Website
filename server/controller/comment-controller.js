import Comment from "../model/comment.js";

export const newComment = async (request, response) => {
  try {
    const comment = await Comment.create(request.body);
    response.status(200).json(comment);
  } catch (error) {
    response.status(500).json({ msg: "Error while adding comment" });
  }
};

export const getAllComments = async (request, response) => {
  try {
    const comments = await Comment.find({ postId: request.params.postId });
    response.status(200).json(comments);
  } catch (error) {
    response.status(500).json({ msg: "Error while fetching comments" });
  }
};

export const deleteComment = async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);
        if (!comment) return response.status(404).json("Comment not found");

        await comment.deleteOne();
        response.status(200).json('Comment deleted successfully');
    } catch (error) {
        response.status(500).json(error);
    }
};
