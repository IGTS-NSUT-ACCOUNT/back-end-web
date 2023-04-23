const BlogRepository = require("./../repositories/BlogRepository");
const SubtopicRepository = require("./../repositories/SubtopicRepository");
const EditorRepository = require("./../repositories/EditorRepository");
const CommentRepository = require("./../repositories/CommentRepository");
const UserRepository = require("./../repositories/UserRepository");

require("dotenv").config();

const limit = 30;
// Blog Service

// getAblog
const getAblog = async (blog_id, user_id) => {
  const blog = await BlogRepository.getABlog(blog_id);

  const editorUser = await UserRepository.getUserById(blog.editor_user_id);
  blog.editor = {
    name: editorUser.name.first_name + " " + editorUser.name.last_name,
    pfp_url: editorUser.pfp_url,
  };

  const liked = user_id ? (blog.liked_by.get(user_id) ? true : false) : false;
  return { blog, liked };
};

// getAllBlogs
const getAllBlogs = async (pge_no) => {
  const blogs = await BlogRepository.getBlogs(pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  const expandedArtists = await generateEditorBlogList(expandedSubtopics);

  const trimmedContent = await trimContent(expandedArtists);
  return trimmedContent;
};
// serachBlogs
const searchBlog = async (query, pge_no) => {
  const blogs = await BlogRepository.searchBlogsByTitle(query, pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  const expandedArtists = await generateEditorBlogList(expandedSubtopics);
  const trimmedContent = trimContent(expandedArtists);
  return trimmedContent;
};

// getBlogsBySubTopic
const getBlogsBySubTopic = async (pge_no, subtopic_id) => {
  const blogs = await SubtopicRepository.getAllBlogs(subtopic_id);
  const result = blogs.slice(pge_no * limit, pge_no * limit + limit);
  const finalResult = await generateResultFromBlogIds(result);

  const expandedArtists = await generateEditorBlogList(finalResult);
  const trimmedContent = trimContent(expandedArtists);
  return trimmedContent;
};
// getBlogsByNew
const getBlogsByNew = async (pge_no) => {
  const blogs = await BlogRepository.getBlogsByNew(pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  const expandedArtists = await generateEditorBlogList(expandedSubtopics);
  const trimmedContent = trimContent(expandedArtists);
  return trimmedContent;
};

// getBlogsByPopular
const getBlogsByPopular = async (pge_no) => {
  const blogs = await BlogRepository.getBlogsByPopular(pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  const expandedArtists = await generateEditorBlogList(expandedSubtopics);
  const trimmedContent = trimContent(expandedArtists);
  return trimmedContent;
};
// getBlogsByArtist
const getBlogsByArtist = async (editor_user_id, pge_no) => {
  const blogs = await EditorRepository.getBlogIds(editor_user_id);
  const result = blogs.slice(pge_no * limit, pge_no * limit);
  const ff = await generateResultFromBlogIds(result);
  const expandedArtists = await generateEditorBlogList(ff);


  const trimmedContent = trimContent(expandedArtists);
  return trimmedContent;
};

const generateResultFromBlogIds = async (blog_ids) => {
  const result = await Promise.all(
    blog_ids.map(async (el, i) => {
      var blog = await BlogRepository.getABlogSilent(el);

      if (blog.public)
        return {
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          subtopics: blog.subtopics,
          blog_id: blog._id,
          editor_user_id: blog.editor_user_id,
        };
    })
  );

  return result;
};

const generateSubTopicsFromBlogList = async (blog_list) => {
  blog_list = blog_list.map((blog) => {
    return blog.toObject();
  });
  return blog_list;
};

const getComments = async (blog_id, user_id) => {
  const comments = await BlogRepository.getComments(blog_id);

  const result = await generateComments(comments, user_id);

  return result;
};

const generateComments = async (comments, user_id) => {
  const result = await Promise.all(
    comments.map(async (el, i) => {
      const comment = await CommentRepository.getComment(el);
      const commentWriter = await UserRepository.getUserById(comment.user_id);

      const user_vote = comment.scored_by.get(
        user_id ? user_id.toString() : ""
      );

      const commBlock = {
        id: comment._id,
        name: commentWriter.name,
        pfp_url: commentWriter.pfp_url,
        message: comment.content,
        score: comment.score,
        is_user_commenter: user_id
          ? comment.user_id.equals(user_id)
            ? true
            : false
          : false,
        is_user_voted: user_vote ? true : false,
        user_vote: user_vote,
      };
      if (comment.replies && comment.replies.length)
        commBlock.replies = await generateComments(comment.replies, user_id);

      return commBlock;
    })
  );

  // console.log(comments, result);
  result.sort((a, b) => b.score - a.score);

  return result;
};
// addAComment
const addAComment = async (user_id, blog_id, content) => {
  const comment = await CommentRepository.addComment(content, user_id);
  await BlogRepository.addCommentToBlog(blog_id, comment._id);
  return comment;
};

// deleteAComment
const deleteAComment = async (blog_id, comment_id) => {
  const comment = await CommentRepository.getComment(comment_id);
  // delete all replies
  comment.replies.forEach(async (el) => {
    await CommentRepository.deleteComment(el);
  });
  // remove comment from blog
  await BlogRepository.removeCommentFromBlog(blog_id, comment_id);

  // deleteComment
  await CommentRepository.deleteComment(comment_id);
  return true;
};

// addLike
const addLike = async (blog_id, user_id) => {
  const blog = await BlogRepository.addLike(blog_id, user_id);
  return blog;
};

// RemoveLike
const removeLike = async (blog_id, user_id) => {
  const blog = await BlogRepository.removeLike(blog_id, user_id);
  return blog;
};

// -getSimilarBlogs()
const getSimilarBlogs = async (blog_id) => {
  const blog = await BlogRepository.getABlogSilent(blog_id);
  const subtopics = blog.subtopics;

  let blogs = [];
  subtopics.forEach(async (subtopic) => {
    blogs = [
      ...blogs,
      await SubtopicRepository.getAllBlogs(subtopic._id, 0, 5000),
    ];
  });

  const map = {};
  blogs.forEach((blog_id) => {
    if (!map[blog_id]) map[blog_id] = 0;
    map[blog_id]++;
  });

  const resultList = Object.keys(map).sort(async (a, b) => {
    if (map[a] == map[b]) {
      const blogA = await BlogRepository.getABlog(a);
      const blogB = await BlogRepository.getABlog(b);
      return blogB.views - blogA.views;
    } else map[b] - map[a];
  });

  const result = (await generateResultFromBlogIds(resultList)).slice(0, 5);

  return result;
};

const generateEditorBlogList = async (blogList) => {
  const blogB = await Promise.all(
    blogList.map(async (blog) => {

      const editorUser = await UserRepository.getUserById(blog.editor_user_id);
      if (!editorUser) return blog;
      return {
        ...blog,
        editor: {
          name: editorUser.name.first_name + " " + editorUser.name.last_name,
          pfp_url: editorUser.pfp_url,
        },
      };
    })
  );

  return blogB;
};

const trimContent = (blogList) => {
  blogL = blogList.map((blog) => {
    if (blog.content && blog.content.length > 500) {
      blog.content = blog.content.slice(0, 500);
    }
    return blog;
  });
  return blogL;
};



module.exports = {
  getAblog,
  getAllBlogs,
  searchBlog,
  getBlogsBySubTopic,
  getBlogsByNew,
  getBlogsByPopular,
  getBlogsByArtist,
  addAComment,
  deleteAComment,
  addLike,
  removeLike,
  getSimilarBlogs,
  getComments,
  generateResultFromBlogIds,
};
