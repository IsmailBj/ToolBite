const { removeBackground } = require("@imgly/background-removal-node");
const { pathToFileURL } = require("url");

exports.stripBackground = async (imagePath) => {
  // FIX: On Windows, absolute paths like C:\... are misinterpreted as web protocols.
  // Converting the path to a proper file:// URL ensures the AI library recognizes it as a local file.
  const fileUrl = pathToFileURL(imagePath).href;

  const blob = await removeBackground(fileUrl);
  const resultBuffer = await blob.arrayBuffer();
  return Buffer.from(resultBuffer);
};
