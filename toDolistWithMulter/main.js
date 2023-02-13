const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.json());
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/savetodo", (req, res) => {
  fs.readFile(__dirname + "/data.txt", "utf-8", (err, data) => {
    let todos;
    if (data.length === 0) {
      todos = [];
    } else {
      todos = JSON.parse(data);
    }

    res.send(JSON.stringify(todos));
  });
});
app.post("/savetodo", upload.single("file"), (req, res) => {
  var id;
  // console.log(JSON.parse(req.body.data), "body hai");
  let bodydata = JSON.parse(req.body.data);
  // console.log(req.body), "body hai";
  // console.log(req.file, "file hai");
  fs.readFile(__dirname + "/id.txt", "utf-8", (err, data) => {
    // console.log("sdf", data);
    if (!data) {
      id = 1;
    } else {
      id = ++data;
    }
    fs.writeFile(__dirname + "/id.txt", JSON.stringify(id), (err) => {});
  });

  fs.readFile(__dirname + "/data.txt", "utf-8", (err, data) => {
    let todos;
    if (data.length === 0) {
      todos = [];
    } else {
      todos = JSON.parse(data);
    }
    bodydata.id = id;
    bodydata.url = req.file.filename;
    // console.log(id);
    todos.push(bodydata);
    // console.log(todos);
    fs.writeFile(__dirname + "/data.txt", JSON.stringify(todos), (err) => {});
    res.send(JSON.stringify(todos));
  });
});
app.post("/deletetodo", upload.single("file"), (req, res) => {
  // console.log(req.file);
  fs.readFile(__dirname + "/data.txt", "utf-8", (err, data) => {
    let todos;
    if (data.length === 0) {
      res.end();
    } else {
      todos = JSON.parse(data);
    }
    let bodydata = JSON.parse(req.body.data);
    let id = bodydata.id;
    // console.log(id);
    todos = todos.filter((value) => {
      return value.id != id;
    });

    // console.log(todos);
    fs.writeFile(__dirname + "/data.txt", JSON.stringify(todos), (err) => {});
    res.send(JSON.stringify(todos));
  });
});
app.post("/checked", upload.single("file"), (req, res) => {
  fs.readFile(__dirname + "/data.txt", "utf-8", (err, data) => {
    let todos;
    let bodydata = JSON.parse(req.body.data);
    if (data.length === 0) {
      res.end();
    } else {
      todos = JSON.parse(data);
    }

    let id = bodydata.id;
    // console.log(req.body.data);
    todos.forEach((value) => {
      if (value.id == id) {
        value.iscompleted = bodydata.iscompleted;
      }
    });

    // console.log(todos);
    fs.writeFile(__dirname + "/data.txt", JSON.stringify(todos), (err) => {});
    res.end(JSON.stringify(todos));
  });
});

app.listen(port, () => {
  console.log(`To Do app listening at http://localhost:${port}`);
});
