const BlogService = require("./../services/BlogService");

const getHighlights = async () => {
  const blogs = await BlogService.getBlogsByNew(0);
  const trimmed = blogs.slice(0, 5);
  const result = trimmed.map((el, i) => {
    return {
      type: "blog",
      title: el.title,
      description: el.content.slice(0, 200),
      thumbnail: el.thumbnail,
      id: el._id,
    };
  });
  console.log(result);
  return result;
};

module.exports = { getHighlights };
