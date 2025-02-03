// Create web server
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { parse } = require("querystring");

let comments = [];

const server = http.createServer((req, res) => {
  const { method, headers } = req;

  if (method === "POST" && headers["content-type"] === "application/x-www-form-urlencoded") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const commentData = parse(body);
      const comment = {
        id: comments.length + 1,
        name: commentData.name,
        comment: commentData.comment,
        date: new Date().toISOString(),
      };

      comments.push(comment);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment added successfully", comment }));
    });
  } else if (method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(comments));
  } else if (method === "DELETE") {
    const { pathname } = url.parse(req.url, true);
    const id = parseInt(pathname.split("/")[2], 10);

    if (!isNaN(id)) {
      comments = comments.filter((comment) => comment.id !== id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Comment ${id} deleted successfully` }));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid comment ID" }));
    }
  } else if (method === "PUT") {
    const { pathname } = url.parse(req.url, true);
    const id = parseInt(pathname.split("/")[2], 10);

    if (!isNaN(id)) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const updatedCommentData = parse(body);
        let foundCommentIndex;

        comments.forEach((comment, index) => {
          if (comment.id === id) {
            foundCommentIndex