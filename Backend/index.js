const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const dbport = process.env.PORT || 5432;
const password = process.env.PASSWORD || 'Emm@karthik924';

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: dbport,
    password: password,
    database: 'postgres'
});

client.connect().then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log('Error connecting to database', err);
});

app.use(bodyParser.json());
app.use(cors());

// Define your routes and logic here

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    client.query(`SELECT id FROM users WHERE username='${username}' AND password='${password}'`).then((result) => {
        if (result.rows.length > 0) {
            res.status(200).send({ success: true, message: 'Login successful', id: result.rows[0].id });
        }
        else {
            res.status(400).send({ success: false, message: 'Invalid credentials' });
        }
    }).catch((err) => {
        console.log('Error', err);
        res.status(500).send({ success: false, message: 'Invalid credentials' });
    });
})

app.post('/register', (req, res) => {
    const { username, password, id } = req.body;
    console.log(username, password, id);
    client.query(`SELECT id FROM users WHERE username='${username}'`).then((result) => {
        if (result.rows.length > 0) {
            res.status(400).send({ success: false, message: 'Username already exists' });
        }
    });
    client.query(`INSERT INTO users (id, username, password) VALUES ('${id}','${username}', '${password}')`).then((result) => {
        res.status(200).send({ success: true, message: 'Registration successful' });
    }).catch((err) => {
        console.log('Error', err);
        res.status(500).send({ success: false, message: 'Registration failed' });
    });
})

app.post('/getTaskboards', async (req, res) => {
    try {
        const userId = req.body.userId;
        const userName = await client.query(`SELECT username FROM users WHERE id='${userId}'`);
      const taskboardsResult = await client.query(`SELECT * FROM taskboard WHERE userid='${userId}'`);
      
      const taskboards = taskboardsResult.rows;
  
      const promises = taskboards.map(async (row) => {
        const tasksResult = await client.query(`SELECT * FROM task WHERE taskboardid='${row.id}'`);
        row.tasks = tasksResult.rows.length > 0 ? tasksResult.rows : [];
      });
  
      await Promise.all(promises);
  
      res.status(200).send({ success: true, message: 'Taskboards fetched', taskboards, userName: userName.rows[0].username });
    } catch (error) {
      console.error('Error', error);
      res.status(400).send({ success: false, message: 'Error fetching taskboards' });
    }
  });
  

app.post('/addTaskboard', (req, res) => {
    const { id, name, userId } = req.body;
    client.query(`INSERT INTO taskboard (id,name, userid) VALUES ('${id}','${name}', '${userId}')`).then((result) => {
        res.status(200).send({ success: true, message: 'Taskboard added' });
    }).catch((err) => {
        console.log('Error', err);
        res.status(400).send({ success: false, message: 'Error adding taskboard' });
    });
})

app.post('/addTask', (req, res) => {
    const { id, name, taskboardid } = req.body;
    client.query(`INSERT INTO task (id,name, taskboardid, status) VALUES ('${id}','${name}', '${taskboardid}','${false}')`).then((result) => {
        res.status(200).send({ success: true, message: 'Task added' });
    }).catch((err) => {
        console.log('Error', err);
        res.status(400).send({ success: false, message: 'Error adding task' });
    });
})

app.post('/updateTask', (req, res) => {
    const { id, taskboardid } = req.body;
    console.log(id, taskboardid);
    client.query('UPDATE task SET taskboardid = $1 WHERE id = $2', [taskboardid, id]).then((result) => {
        res.status(200).send({ success: true, message: 'Task updated' });
    }).catch((err) => {
        console.log('Error', err);
        res.status(400).send({ success: false, message: 'Error updating task' });
    });
})

app.post('/updateTaskStatus', (req, res) => {
    const { id, status } = req.body;
    client.query(`UPDATE task SET status=${status} WHERE id='${id}'`).then((result) => {
        res.status(200).send({ success: true, message: 'Task status updated' });
    }).catch((err) => {
        console.log('Error', err);
        res.status(400).send({ success: false, message: 'Error updating task status' });
    });
})
        

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
