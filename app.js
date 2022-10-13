const { handleBlogsRoute, handleLogInOnRoute } = require('./src/router');
const { getPostData, getQueryString, handleSession } = require('./src/utils');

const requestHandler = async (req, res) => {
  // set response delay
  setTimeout(async () => {
    // get route and queryString and assgin them to req
    const { url, headers, method } = req;
    const { pathname: route, searchParams } = new URL(
      url,
      `http://${headers.host}`
    );
    req.route = route;
    req.queryString = getQueryString(searchParams);

    // get cookie and assign it to req
    let { cookie } = headers;
    cookie = cookie || '';
    req.cookie = {};
    if (cookie !== '') {
      cookie.split(';').forEach((entry) => {
        const [key, val] = entry.split('=');
        req.cookie[key] = val;
      });
    }

    // parse session info in cookie
    const userId = req.cookie.userid;
    // check if the request has session info with userId, if not, add a new session for it and set cookie with that session info, if has, check if the session is expired or not, if it is, do the same thing as no session case, if not, do nothing.
    // finally, return effective ssession
    let session;
    try {
      session = await handleSession(userId, req, res);
    } catch (error) {
      // if get session failed, return 500
      res.writeHead(500, { 'Content-type': 'text/plain' });
      res.write(`${error.message}\n`);
      res.end();
    }

    // assign session to req.session for cache
    req.session = session === '' ? session : JSON.parse(session);

    // if request is not related to login/logon, need check if the user is authenticated(by checking username in session) because unauthenticated user has no access to use any other services
    // can regard this as middleware
    if (method !== 'GET' && route === '/api/blogs')
      if (!req.session?.username) {
        // if user is unauthenticated, return 401
        res.writeHead(401, { 'Content-type': 'text/plain' });
        res.write('Unauthorized\n');
        res.end();

        return undefined;
      }

    // After pass authentication, start to parse request
    // get post data
    const postData = await getPostData(req);
    // assign post data to req
    req.body = postData;

    // set response data type
    res.setHeader('Content-type', 'application/json');

    // route match
    // try to match logInOn route
    const logInOnResponse = await handleLogInOnRoute(req, res);
    if (logInOnResponse) return res.end(JSON.stringify(logInOnResponse));
    // try to match blogs route
    const blogsResponse = await handleBlogsRoute(req, res);
    if (blogsResponse) return res.end(JSON.stringify(blogsResponse));
    // no route match, return 404
    res.writeHead(404, { 'Content-type': 'text/plain' });
    res.write('404 not found\n');
    res.end();

    return undefined;
  }, 1000);
};

module.exports = requestHandler;
