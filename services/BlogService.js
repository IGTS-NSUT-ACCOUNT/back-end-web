const BlogRepository = require("./../repositories/BlogRepository");
const SubtopicRepository = require("./../repositories/SubtopicRepository");
const EditorRepository = require("./../repositories/EditorRepository");
const CommentRepository = require("./../repositories/CommentRepository");

require("dotenv").config();

const limit = 30;
// Blog Service

// getAblog
const getAblog = async (blog_id) => {
  const blog = await BlogRepository.getABlog(blog_id);

  blog.subtopics = blog.subtopics.map(async (el) => {
    const subtopic = await SubtopicRepository.getSubtopicById(el);
    return { subtopic_id: subtopic._id, name: subtopic.name };
  });

  return blog;
};

// getAllBlogs
const getAllBlogs = async (pge_no) => {
  const blogs = await BlogRepository.getBlogs(pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  return expandedSubtopics;
};
// serachBlogs
const searchBlog = async (query, pge_no) => {
  const blogs = await BlogRepository.searchBlogsByTitle(query, pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  return expandedSubtopics;
};

// getBlogsBySubTopic
const getBlogsBySubTopic = async (pge_no, subtopic_id) => {
  const blogs = await SubtopicRepository.getAllBlogs(subtopic_id);
  const result = blogs.slice(pge_no * limit, pge_no * limit);
  const finalResult = await generateResultFromBlogIds(result);
  const expandedSubtopics = await generateSubTopicsFromBlogList(finalResult);
  return expandedSubtopics;
};
// getBlogsByNew
const getBlogsByNew = async (pge_no) => {
  const blogs = await BlogRepository.getBlogsByNew(pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  return expandedSubtopics;
};

// getBlogsByPopular
const getBlogsByPopular = async (pge_no) => {
  const blogs = await BlogRepository.getBlogsByPopular(pge_no, limit);
  const expandedSubtopics = await generateSubTopicsFromBlogList(blogs);
  return expandedSubtopics;
};
// getBlogsByArtist
const getBlogsByArtist = async (editor_user_id, pge_no) => {
  const blogs = await EditorRepository.getBlogIds(editor_user_id);
  const result = blogs.slice(pge_no * limit, pge_no * limit);
  const ff = await generateResultFromBlogIds(result);
  const expandedSubtopics = await generateSubTopicsFromBlogList(ff);
  return expandedSubtopics;
};

const generateResultFromBlogIds = async (blog_ids) => {
  const result = [];
  blog_ids.forEach(async (el, i) => {
    var blog = await BlogRepository.getABlog(el);
    result.push({
      title: blog.title,
      content: blog.content,
      thumbnail: blog.thumbnail,
      subtopics: blog.subtopics.map(async (el) => {
        const subtopic = await SubtopicRepository.getSubtopicById(el);
        return { subtopic_id: subtopic._id, name: subtopic.name };
      }),
      blog_id: blog._id,
    });
  });
  return result;
};

const generateSubTopicsFromBlogList = async (blog_list) => {
  blog_list = blog_list.map((el) => {
    const subtopics = blog.subtopics.map(async (el) => {
      const subtopic = await SubtopicRepository.getSubtopicById(el);
      return { subtopic_id: subtopic._id, name: subtopic.name };
    });
    return { ...el, subtopics };
  });
  return blog_list;
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

  const expandedSubtopics = await generateSubTopicsFromBlogList(result);

  return expandedSubtopics;
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
};
