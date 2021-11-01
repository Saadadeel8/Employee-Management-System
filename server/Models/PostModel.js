const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  ID: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

const Post = mongoose.model('Posts', PostSchema);

export default Post;
