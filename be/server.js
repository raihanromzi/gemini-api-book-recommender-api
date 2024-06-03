import express from "express";
import { getBookRecommendation } from "./generate.js";
import { parse } from "marked";

const app = express();

app.get("/getbooks", async (req, res) => {
  const { genre, favoriteBook, theme } = req.query;

  if (!genre || !favoriteBook || !theme) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  console.log({ genre, favoriteBook, theme });
  const books = await getBookRecommendation(genre, favoriteBook, theme);
  console.log(books);
  res.json({
    answer: parse(books),
  });
});

app.get("/index.html", (req, res) => {
  res.sendFile("index.html", { root: "fe" });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
