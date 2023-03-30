const CommentRepository = require("./../repositories/CommentRepository");

// Comments Service

const getAComment = async (comment_id) => {
  const comment = await CommentRepository.getComment(comment_id);
  return comment;
};

// scoreAComment
const scoreAComment = async (comment_id, user_id, score) => {
  const comment = await CommentRepository.addScore(
    comment_id,
    score === 1 ? true : false,
    user_id
  );
  return comment;
};
// addAReply
const addAReply = async (comment_id, user_id, content) => {
  const comment = await CommentRepository.addComment(content, user_id);
  const updatedComment = await CommentRepository.addReplyId(
    comment_id,
    comment._id
  );
  return updatedComment;
};
// deleteAReply
const deleteAReply = async (comment_id, reply_id) => {
  await CommentRepository.deleteReplyId(comment_id, reply_id);
  await CommentRepository.deleteComment(reply_id);
};

module.exports = {
  getAComment,
  scoreAComment,
  addAReply,
  deleteAReply,
};
