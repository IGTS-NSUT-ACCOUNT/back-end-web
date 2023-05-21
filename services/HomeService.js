const BlogService = require("./../services/BlogService");
const EventService = require('./../services/EventService');
const getHighlights = async () => {
  const blogs = await BlogService.getBlogsByNew(0);
  const events = await EventService.getAllEvents(0, 30);
  const trimmed = [...blogs.slice(0, 5), ...events.slice(0, 5)];
  const result = trimmed.map((el, i) => {

    if (el.title)
      return {
        type: "blog",
        title: el.title,
        description: el.content.slice(0, 200),
        thumbnail: el.thumbnail,
        id: el._id,
        date: el.createdAt
      };
    else return {
      type: "event",
      title: el.event_title,
      description: el.details.slice(0, 200),
      thumbnail: el.main_poster,
      id: el._id,
      date: el.createdAt
    }
  });

  console.log(result);

  const r = result.sort((a, b) => {
    return b.date - a.date;
  })

  return r;
};

module.exports = {
  getHighlights
};