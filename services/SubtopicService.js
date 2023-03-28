const SubtopicRepository = require("./../repositories/SubtopicRepository");

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

module.exports = { getSubtopics, createANewSubtopic };
