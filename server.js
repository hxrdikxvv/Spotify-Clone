const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static frontend
app.use(express.static("public"));

// Serve songs folder
app.use("/songs", express.static("songs"));
app.use("/songs", express.static(path.join(__dirname, "songs")));


// Endpoint to get all songs
app.get("/api/songs", (req, res) => {
  const songsDir = path.join(__dirname, "songs");
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read songs directory" });
    }
    const songs = files.filter(file => file.endsWith(".mp3"));
    res.json(songs);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
