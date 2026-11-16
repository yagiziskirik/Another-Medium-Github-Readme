const http = require("http");
const handler = require("./api/medium");

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  req.query = Object.fromEntries(parsed.searchParams);

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.send = (body) => res.end(body);

  handler(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/?username=yagiziskirik&index=0`);
});
