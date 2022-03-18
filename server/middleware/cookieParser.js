const parseCookies = (req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    [...req.headers.cookie.matchAll(/(\S+)=([^\s;]+);?/g)].forEach(match => {
      req.cookies[match[1]] = match[2];
    });
  }

  next();
};

module.exports = parseCookies;