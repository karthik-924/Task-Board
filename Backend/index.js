const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;
const dbport = process.env.DB_PORT || 5432; // Fix the variable name
const password = process.env.DB_PASSWORD || "Emm@karthik924"; // Fix the variable name

const sequelize = new Sequelize("postgres", "postgres", password, {
  host: "localhost",
  port: dbport,
  dialect: "postgres",
});

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { timestamps: false, freezeTableName: true }
);

User.sync();

const taskboard = sequelize.define(
  "taskboard",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    userId: {
      type: DataTypes.STRING,
      field: 'userid',
    },
  },
  { timestamps: false, freezeTableName: true }
);

taskboard.sync();

const Task = sequelize.define(
  "task",
  {
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    taskboardId: {
      type: DataTypes.STRING,
      field: 'taskboardid',
    },
  },
  { timestamps: false, freezeTableName: true }
);

Task.sync();

User.hasMany(taskboard, { foreignKey: 'userid' });
taskboard.belongsTo(User, { foreignKey: 'userid' });
taskboard.hasMany(Task, { foreignKey: 'taskboardid' });
Task.belongsTo(taskboard, { foreignKey: 'taskboardid' });

sequelize.sync();

app.use(bodyParser.json());
app.use(cors());



app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      res
        .status(200)
        .send({ success: true, message: "Login successful", id: user.id });
    } else {
      res.status(400).send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).send({ success: false, message: "Invalid credentials" });
  }
});

app.post("/register", async (req, res) => {
  const { id, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      res
        .status(400)
        .send({ success: false, message: "Username already exists" });
    } else {
      const user = await User.create({ id, username, password });
      res
        .status(200)
        .send({ success: true, message: "Registration successful" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).send({ success: false, message: "Registration failed" });
  }
});

app.post("/getTaskboards", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(400).send({ success: false, message: "User not found" });
      return;
    }

    const taskboards = await taskboard.findAll({ where: { userId: userId } });

    const fetchTasksPromises = taskboards.map(async (taskboard) => {
      taskboard.dataValues.tasks = await Task.findAll({
        where: { taskboardId: taskboard.id },
      });
    });

    await Promise.all(fetchTasksPromises);

    res.status(200).send({
      success: true,
      message: "Taskboards fetched",
      taskboards,
      userName: user.username,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(400).send({ success: false, message: "Error fetching taskboards" });
  }
});


app.post("/addTaskboard", async (req, res) => {
  const { id, name, userid } = req.body;

  try {
    const Taskboard = await taskboard.create({ id, name, userid: userid });
    res.status(200).send({ success: true, message: "Taskboard added" });
  } catch (err) {
    console.error("Error", err);
    res.status(400).send({ success: false, message: "Error adding taskboard" });
  }
});

app.post("/addTask", async (req, res) => {
  const { id, name, taskboardid } = req.body;

  try {
    const task = await Task.create({
      id,
      name,
      status: false,
      taskboardid: taskboardid,
    });
    res.status(200).send({ success: true, message: "Task added" });
  } catch (err) {
    console.error("Error", err);
    res.status(400).send({ success: false, message: "Error adding task" });
  }
});

app.post("/updateTask", async (req, res) => {
  const { id, taskboardid } = req.body;

  try {
    const task = await Task.findByPk(id);

    if (task) {
      task.taskboardid = taskboardid;
      await task.save();
      res.status(200).send({ success: true, message: "Task updated" });
    } else {
      res.status(400).send({ success: false, message: "Task not found" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(400).send({ success: false, message: "Error updating task" });
  }
});

app.post("/updateTaskStatus", async (req, res) => {
  const { id, status } = req.body;

  try {
    const task = await Task.findByPk(id);

    if (task) {
      task.status = status;
      await task.save();
      res.status(200).send({ success: true, message: "Task status updated" });
    } else {
      res.status(400).send({ success: false, message: "Task not found" });
    }
  } catch (err) {
    console.error("Error", err);
    res
      .status(400)
      .send({ success: false, message: "Error updating task status" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
