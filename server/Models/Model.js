const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Users = mongoose.model('users', UserSchema);

export default Users;
