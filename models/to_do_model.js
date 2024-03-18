const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task_des: {
    type: String,
    required: true
  },
  task_status: {
    type: {
      completed: {
        type: Boolean,
        default: false
      },
      pending: {
        type: Boolean,
        default: true
      }
    },
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }
});

module.exports = mongoose.model('to_do_model', todoSchema);
