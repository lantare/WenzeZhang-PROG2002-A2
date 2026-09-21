const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number.parseInt(process.env.PORT || "5500", 10);
const publicRoot = path.resolve(__dirname);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function resolveRequestPath(urlPath) {
  const pathname = decodeURIComponent(new URL(urlPath, "http://localhost").pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(publicRoot, `.${requested}`);
  return resolved.startsWith(`${publicRoot}${path.sep}`) ? resolved : null;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    fs.createReadStream(filePath).pipe(response);
  });
});

server.listen(port, () => {
  console.log(`Harbour Hope client listening on http://localhost:${port}`);
});
