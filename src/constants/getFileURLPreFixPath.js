function getFileURLPreFixPath(req) {
  const { protocol } = req;
  return `${protocol}://${req.get("host")}/`;
}
module.exports.getFileURLPreFixPath = getFileURLPreFixPath;
