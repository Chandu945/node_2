const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");

    fs.readFile("file.txt", "utf8", (err, data) => {
      let previous = err ? "" : data; // Use empty string if file read fails

      res.end(`
        <form action="/message" method="POST">
          <h1>${previous}</h1>
          <label>Name:</label>
          <input type="text" name="username" />
          <button type="submit">Add</button>
        </form>
      `);
    });
  } else if (req.url === "/message" && req.method === "POST") {
    res.setHeader("Content-Type", "text/html");

    let dataChunks = [];

    req.on("data", (chunks) => {
      dataChunks.push(chunks);
    });

    req.on("end", () => {
      let combinedBuffer = Buffer.concat(dataChunks);
      let value = decodeURIComponent(combinedBuffer.toString().split("=")[1]); 

      fs.writeFile("file.txt", value, (err) => {
        if (err) {
          console.error("Failed to write file:", err);
          res.end("Error saving data");
          return;
        }

        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
