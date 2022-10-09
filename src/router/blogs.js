const {
  getBlogList,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controller');
const { verifyProps, getDefinedProps, makeReturnData } = require('../utils');
const { ErrorModel } = require('../model');
const { blogErrMsg } = require('../config/error');

const { CREATE_BLOG_FAILED, INVALID_ID, NOT_LOGGED_IN } = blogErrMsg;

const handleBlogsRoute = async (req) => {
  const { method, route, queryString, body = {} } = req;
  const { id: blogId, keyword, author, isadmin } = queryString;
  const authorName = author;

  if (method === 'GET' && route === '/api/blogs') {
    if (blogId) {
      // fetch a specific blog
      const response = await getBlog(blogId);
      return makeReturnData(response);
    }
    // fetch blogs
    // check if admin page list request
    // if (isadmin) {
    //   authorName = req.session?.username;
    //   if (!authorName)
    //     return makeReturnData({ error: NOT_LOGGED_IN, result: undefined });
    // }
    const response = await getBlogList(keyword || '', authorName || '');
    return makeReturnData(response);
  }

  const { authorId, id, title, content } = body;
  const props = { title, content };
  const authorProps = { authorId, title, content };
  const propRules = { authorId: 1, id: 1, title: 1, content: 10 };

  // create a new blog
  if (method === 'POST' && route === '/api/blogs') {
    if (verifyProps(propRules, authorProps)) {
      const response = await createBlog(authorProps);
      return makeReturnData(response);
    }
    return new ErrorModel(CREATE_BLOG_FAILED);
  }

  // update a blog
  if (method === 'PATCH' && route === '/api/blogs') {
    if (!verifyProps(propRules, { id })) return new ErrorModel(INVALID_ID);
    const definedProps = getDefinedProps(props);
    if (verifyProps(propRules, definedProps)) {
      const response = await updateBlog({ id, ...definedProps });
      return makeReturnData(response);
    }
    return new ErrorModel(CREATE_BLOG_FAILED);
  }

  // delete a blog
  if (method === 'DELETE' && route === '/api/blogs') {
    if (!verifyProps(propRules, { id })) return new ErrorModel(INVALID_ID);
    const response = await deleteBlog(id);
    return makeReturnData(response);
  }

  return undefined;
};

module.exports = handleBlogsRoute;
