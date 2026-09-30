const serverless = require("serverless-http");
const app = require("../../AI-BACKEND/server");

const handler = serverless(app, {
  binary: ["image/*", "multipart/form-data"]
});

module.exports.handler = async (event, context) => {
  // Normalize path if Netlify passes /.netlify/functions/api prefix
  if (event.path && event.path.startsWith("/.netlify/functions/api")) {
    event.path = event.path.replace(/^\/\.netlify\/functions\/api/, "/api");
  }
  return handler(event, context);
};
