const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  username: {
    type: String,
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
});

const Post = mongoose.model('Posts', PostSchema);

export default Post;
