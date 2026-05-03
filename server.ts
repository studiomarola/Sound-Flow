import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("soundflow.db");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT,
    status TEXT DEFAULT 'Draft',
    release_date TEXT,
    artists TEXT,
    cover_url TEXT,
    audio_url TEXT,
    lyrics TEXT,
    spotify_link TEXT,
    youtube_link TEXT,
    apple_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    title TEXT NOT NULL,
    deadline TEXT,
    assignee TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS marketing_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    type TEXT CHECK(type IN ('pre', 'post')),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('video', 'photo', 'audio')),
    url TEXT NOT NULL,
    size TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadDir));

  // API Routes
  
  // Upload
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });
  
  // Songs
  app.get("/api/songs", (req, res) => {
    const songs = db.prepare("SELECT * FROM songs ORDER BY created_at DESC").all();
    res.json(songs);
  });

  app.post("/api/songs", (req, res) => {
    const { title, genre, status, release_date, artists, lyrics } = req.body;
    const info = db.prepare(
      "INSERT INTO songs (title, genre, status, release_date, artists, lyrics) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(title, genre, status || 'Draft', release_date, artists, lyrics);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/songs/:id", (req, res) => {
    const { id } = req.params;
    const { title, genre, status, release_date, artists, lyrics, spotify_link, youtube_link, apple_link, cover_url } = req.body;
    db.prepare(`
      UPDATE songs 
      SET title = ?, genre = ?, status = ?, release_date = ?, artists = ?, lyrics = ?, 
          spotify_link = ?, youtube_link = ?, apple_link = ?, cover_url = ?, audio_url = ?
      WHERE id = ?
    `).run(title, genre, status, release_date, artists, lyrics, spotify_link, youtube_link, apple_link, cover_url, req.body.audio_url, id);
    res.json({ success: true });
  });

  app.delete("/api/songs/:id", (req, res) => {
    db.prepare("DELETE FROM songs WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Tasks
  app.get("/api/tasks/all", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY deadline ASC").all();
    res.json(tasks);
  });

  app.get("/api/songs/:songId/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks WHERE song_id = ?").all(req.params.songId);
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const { song_id, title, deadline, assignee } = req.body;
    const info = db.prepare(
      "INSERT INTO tasks (song_id, title, deadline, assignee) VALUES (?, ?, ?, ?)"
    ).run(song_id, title, deadline, assignee);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Marketing
  app.get("/api/marketing/all", (req, res) => {
    const actions = db.prepare("SELECT * FROM marketing_actions").all();
    res.json(actions);
  });

  app.get("/api/songs/:songId/marketing", (req, res) => {
    const actions = db.prepare("SELECT * FROM marketing_actions WHERE song_id = ?").all(req.params.songId);
    res.json(actions);
  });

  app.post("/api/marketing", (req, res) => {
    const { song_id, title, type } = req.body;
    const info = db.prepare(
      "INSERT INTO marketing_actions (song_id, title, type) VALUES (?, ?, ?)"
    ).run(song_id, title, type);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/marketing/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE marketing_actions SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Files
  app.get("/api/files", (req, res) => {
    const files = db.prepare("SELECT * FROM files ORDER BY created_at DESC").all();
    res.json(files);
  });

  app.post("/api/files", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { type } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const size = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
    
    const info = db.prepare(
      "INSERT INTO files (name, type, url, size) VALUES (?, ?, ?, ?)"
    ).run(req.file.originalname, type, fileUrl, size);
    
    res.json({ 
      id: info.lastInsertRowid,
      name: req.file.originalname,
      type,
      url: fileUrl,
      size
    });
  });

  app.delete("/api/files/:id", (req, res) => {
    const file = db.prepare("SELECT url FROM files WHERE id = ?").get(req.params.id) as { url: string } | undefined;
    if (file) {
      const filePath = path.join(__dirname, file.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      db.prepare("DELETE FROM files WHERE id = ?").run(req.params.id);
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
