const mongoose = require("mongoose");

const uresumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
  mobile:{type:String},
  experience: { type: String },
  state:{type:String, default:"new"},
  complete:{type:Boolean, default:false},
});

module.exports = mongoose.model("resume", uresumeSchema);
