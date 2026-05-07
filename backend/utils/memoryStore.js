const users = [];
const posts = [];

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

module.exports = {
  users,
  posts,
  createId,
};
