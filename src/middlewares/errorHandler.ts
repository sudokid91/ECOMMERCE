// not found

const notFoundError = (req, res, next) => {
  const error = new Error('Not found: ' + req.originalUrl);
  res.status(404);
  next(error);
}

const errorHandler = (error, req, res) => {
  console.log(`errorHandler: `, { error })
  const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    message: error?.message,
    stack: error?.stack,
  })
}

export { notFoundError, errorHandler }