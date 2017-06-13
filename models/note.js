var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

    title: {
        type: String
    },

    bsody: {
        type: String
    }
});

var Note = mongoose.model("note", NoteSchema);

module.exports = Note;
