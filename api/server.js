const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Models
const Light = require('./Light.js');

// Connect to db
mongoose.connect(
    'mongodb+srv://bfahad:sit314project@sit314-project.aoj5t.mongodb.net/sit314-project?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true, }
);
mongoose.connection.on('error' , console.error.bind(console, 'Connection error: '));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Get lights
app.get('/api/light/get' , (req, res) => {
    Light.find({}).sort({updatedAt: 'descending'}).exec((err, light) => {
        if (err) {
            console.log("SERVER: /get error")
        }
        return res.send({ light })
    })
})

// Save lights
app.post('/api/light/create', (req, res) => {
    const light = new Light({
        id: req.body.id,
        buildingName: req.body.buildingName,
        room: req.body.room,
        name: req.body.name,
        status: req.body.status,
        colour: req.body.colour,
        brightness: req.body.brightness,
    });
    light.save( (err) => {
        if (err) {
            console.log("SERVER: /create error")
        }
        return res.send({ light });
    });
})

// Delete lights
app.post('/api/light/delete/:id', (req, res) => {
    Light.findOneAndDelete({id: req.params.id}, (err, light) => {
        if (err) {
            console.log("SERVER: /delete error")
        }
        return res.send({ message: 'Light has been removed', light });
    })
})

// Update Light
app.post('/api/light/update/:id', (req, res) => {
    Light.findOneAndUpdate({id: req.params.id}, {
            status: req.body.status,
            colour: req.body.colour,
            brightness: req.body.brightness,
        }, (err, light) => {
            if (err) {
                console.log("SERVER: /update error")
            } else {
                console.log("UPDATED", res)
            }
            
        }
    )
})


const PORT = 5000;
app.listen(PORT);
console.log('API running on port: ' + PORT);