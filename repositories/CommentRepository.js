const Comment = require("./../models/blog/Comment");

// Comments Repository
// - addComment
const addComment = async (content, user_id) => {
  const comment = new Comment({ content, user_id });
  const savedComment = await comment.save();
  return savedComment;
};

// - addScore()
const addScore = async (comment_id, vote, user_id) => {
  // check if already voted
  const comment = await getComment(comment_id);
  const currentScore = comment.scored_by[user_id.toString()];
  if (currentScore === undefined) {
    // have not voted yet
    vote ? (comment.score += 1) : (comment.score -= 1);
    comment.scored_by[user_id.toString()] = vote;
  } else {
    if (vote !== currentScore) {
      vote ? (comment.score += 2) : (comment.score -= 2);
      comment.scored_by[user_id.toString()] = vote;
    }
  }

  const updatedComment = await comment.save();
  return updatedComment;
};

// - addReplyId()
const addReplyId = async (comment_id, reply_id) => {
  const comment = await getComment(comment_id);
  comment.replies.push(reply_id);
  const updatedComment = await comment.save();
  return updatedComment;
};

// - deleteReplyId()
const deleteReplyId = async (comment_id, reply_id) => {
  const comment = await getComment(comment_id);
  comment.replies = comment.replies.filter((rep) => !rep.equals(reply_id));
  const updatedComment = await comment.save();
  return updatedComment;
};

// - getComment()
const getComment = async (comment_id) => {
  const comment = await Comment.findById(comment_id);
  return comment;
};

// - deleteComment()
const deleteComment = async (comment_id) => {
  const comment = await getComment(comment_id);
  // delete all replies
  const replies = comment.replies;
  replies.forEach(async (el) => {
    await Comment.findByIdAndDelete(el);
  });

  // delete comment
  await Comment.findByIdAndDelete(comment_id);
  return true;
};

module.exports = {
  addComment,
  addScore,
  addReplyId,
  deleteReplyId,
  getComment,
  deleteComment,
};
