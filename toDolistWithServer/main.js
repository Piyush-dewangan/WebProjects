const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.end();
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
app.post("/savetodo", (req, res) => {
  var id;

  fs.readFile(__dirname + "/id.txt", "utf-8", (err, data) => {
    // console.log("sdf", data);
    if (!data) {
      id = 1;
    } else {
      console.log(id);
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
    req.body.id = id;
    // console.log(id);
    todos.push(req.body);
    // console.log(todos);
    fs.writeFile(__dirname + "/data.txt", JSON.stringify(todos), (err) => {});
    res.send(JSON.stringify(todos));
  });
});
app.post("/deletetodo", (req, res) => {
  fs.readFile(__dirname + "/data.txt", "utf-8", (err, data) => {
    let todos;
    if (data.length === 0) {
      res.end();
    } else {
      todos = JSON.parse(data);
    }
    let id = req.body.id;
    // console.log(id);
    todos = todos.filter((value) => {
      return value.id != id;
    });

    // console.log(todos);
    fs.writeFile(__dirname + "/data.txt", JSON.stringify(todos), (err) => {});
    res.send(JSON.stringify(todos));
  });
});
app.post("/checked", (req, res) => {
  fs.readFile(__dirname + "/data.txt", "utf-8", (err, data) => {
    let todos;
    if (data.length === 0) {
      res.end();
    } else {
      todos = JSON.parse(data);
    }
    let id = req.body.id;
    // console.log(id);
    todos.forEach((value) => {
      if (value.id == id) {
        value.iscompleted = req.body.iscompleted;
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
