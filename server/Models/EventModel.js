const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  modifier: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const Events = mongoose.model('events', EventSchema);

export default Events;
