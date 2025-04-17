export const responseInterceptor = (req, res, next) => {
  const oldSend = res.send;
  const oldJson = res.json;

  req.send = function (data) {
    res.responseBody = data;
    return oldSend.apply(res, arguments);
  };

  res.json = function (data) {
    res.responseBody = data;
    return oldJson.apply(res, arguments);
  };

  next();
};
