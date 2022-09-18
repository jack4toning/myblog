const blogErrMsg = {
  INVALID_TITLE_CONTENT: 'Title or content is invalid...',
  INVALID_ID: 'Id is invalid...',
  FETCH_BLOG_LIST_FAILED: 'Fetch blog list failed...',
  FETCH_BLOG_FAILED: 'Fetch blog failed...',
  CREATE_BLOG_FAILED: 'Create blog failed...',
  UPDATE_BLOG_FAILED: 'Update blog failed...',
  DELETE_BLOG_FAILED: 'Delete blog failed...',
  NOT_LOGGED_IN: 'You are not logged in...',
};

const loginInOnErrMsg = {
  USER_EXISTS: 'User already exists...',
  INVALID_USERNAME_PASSWORD: 'Username or password is invalid...',
  PASSWORD_NOT_MATCH: "Passwords doesn't match...",
  LOGIN_FAILED: 'Login failed...',
  LOGON_FAILED: 'Logon failed...',
};

const serverErrMsg = {
  SERVER_ISSUE: 'An error occurred on the server',
};

const redisErrMsg = {
  STRING_ONLY: 'Only accept string key...',
};

module.exports = { blogErrMsg, loginInOnErrMsg, serverErrMsg, redisErrMsg };
