const SubtopicRepository = require("./../repositories/SubtopicRepository");
const BlogRepository = require("./../repositories/BlogRepository");
// Subtopic Service
// getSubtopics //query
const getSubtopics = async (query) => {
  const subtopics = await SubtopicRepository.getSubtopic(query);
  return subtopics;
};

// createANewSubtopic
const createANewSubtopic = async (name) => {
  const subtopic = await SubtopicRepository.addNewSubtopic(name);
  return subtopic;
};

const getAllSubtopicsBySize = async () => {
  const subtopics = await SubtopicRepository.getAllSubtopics();
  subtopics.sort(async (a, b) => {
    let ca,
      cb = 0;

    a.blog_ids.forEach(async (el, i) => {
      const blog = await BlogRepository.getABlogSilent(el);
      if (blog && blog.public) ca++;
    });
    b.blog_ids.forEach(async (el, i) => {
      const blog = await BlogRepository.getABlogSilent(el);
      if (blog && blog.public) cb++;
    });

    return b - a;
  });

  let result = subtopics.filter((el, i) => el.blog_ids.length > 0);
  console.log(result);

  return result;
};

module.exports = { getSubtopics, createANewSubtopic, getAllSubtopicsBySize };
