const Subtopic = require("./../models/blog/Subtopic");

// - addNewSubtopic()
const addNewSubtopic = async (name) => {
  const subtopic = new Subtopic({
    name
  });
  const savedSubtopic = await subtopic.save();
  return savedSubtopic;
};
// - getAllBlogs()
const getAllBlogs = async (subtopic_id, pge_no, limit) => {
  const subtopic = await getSubtopicById(subtopic_id);
  return subtopic.blog_ids;
};

const addBlogId = async (subtopic_id, blog_id) => {
  const subtopic = await getSubtopicById(subtopic_id);
  subtopic.blog_ids.push(blog_id);
  const savedSubtopic = await subtopic.save();
  return savedSubtopic;
};
const removeBlogId = async (subtopic_id, blog_id) => {
  const subtopic = await getSubtopicById(subtopic_id);
  subtopic.blog_ids = subtopic.blog_ids.filter((x) => !x.equals(blog_id));
  const updatedSubtopic = await subtopic.save();
  return updatedSubtopic;
};

const getSubtopicById = async (subtopic_id) => {
  const subtopic = await Subtopic.findById(subtopic_id);
  return subtopic;
};

// - getSubtopic() // search function
const getSubtopic = async (query) => {
  let results = await Subtopic.aggregate([{
    $search: {
      compound: {
        should: [{
          autocomplete: {
            query: query,
            path: "name",
          },
        }, ],
      },
    },
  }, ]);

  return results;
};

const getAllSubtopics = async () => {
  const subtopics = await Subtopic.find();
  return subtopics;
};

const deleteBlog = async (subtopic_id, blog_id) => {
  const subtopic = await getSubtopicById(subtopic_id);
  subtopic.blog_ids = subtopic.blog_ids.filter((el) => !el.equals(blog_id));
}

module.exports = {
  addNewSubtopic,
  addBlogId,
  removeBlogId,
  getAllBlogs,
  getSubtopic,
  getSubtopicById,
  getAllSubtopics,
  deleteBlog
};