const http = require("http");

const app = require("../src/app");

/**
 * server port. uses system allocated PORT or defaults to
 * 3000
 * @type {number}
 */
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.set("port", port);

const server = http.createServer(app);

server.listen(port);

server.on("listening", () =>
  console.info("Server fired up and listening on port", port, "🚀")
);

server.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
