const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LightSchema = Schema({
    id: { type: Number },
    buildingName: { type: String },
    room: { type: String },
    name: { type: String },
    status: { type: String },
    colour: { type: String },
    brightness: { type: Number },
});

const Light = mongoose.model('Light', LightSchema);
module.exports = Light;