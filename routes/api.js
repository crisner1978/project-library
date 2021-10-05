/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../models").Book;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      Book.find({}, (err, data) => {
        if (!data) {
          res.json([]);
        } else {
          const formatData = data.map((book) => {
            return {
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length,
            };
          });
          res.json(formatData);
        }
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({ title, comments: [] });
      newBook.save((err, data) => {
        if (err || !data) {
          res.send("there was an error saving");
        } else {
          res.json({ _id: data._id, title: data.title });
        }
      });
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.remove({}, (err, data) => {
        if (err || !data) {
          res.send("error");
        } else {
          res.send("complete delete successful");
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      Book.findById(bookid, (err, data) => {
        if (!data) {
          res.json("no book exists");
        } else {
          res.json({
            _id: data._id,
            title: data.title,
            comments: data.comments,
          });
        }
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      Book.findById(bookid, (err, bookdata) => {
        if (!bookdata) {
          res.json("no book exists");
        } else {
          bookdata.comments.push(comment);
          bookdata.save((err, savedata) => {
            res.json({
              _id: savedata._id,
              title: savedata.title,
              comments: savedata.comments,
            });
          });
        }
      });
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      });
      //if successful response will be 'delete successful'
    });
};
