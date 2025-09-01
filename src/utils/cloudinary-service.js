const awsUpload = require("../config/aws");

exports.upload = async (path) => {
  const result = await awsUpload.upload(path);
  return result;
};
