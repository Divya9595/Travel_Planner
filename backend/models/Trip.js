import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    from: {
      type: String,
      trim: true,
      default: '',
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    dateFrom: {
      type: String,
      trim: true,
      default: '',
    },
    dateTo: {
      type: String,
      trim: true,
      default: '',
    },
    travellers: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 traveller required'],
    },
    dates: {
      type: String,
      default: '',
    },
    weather: {
      type: mongoose.Schema.Types.Mixed,
    },
    attractions: [
      {
        type: String,
      },
    ],
    packing: [
      {
        item: { type: String },
        icon: { type: String },
        packed: { type: Boolean, default: false },
      },
    ],
    todoList: [
      {
        task: { type: String },
        done: { type: Boolean, default: false },
      },
    ],
    transport: {
      type: mongoose.Schema.Types.Mixed,
    },
    reminders: [
      {
        text: { type: String },
        icon: { type: String },
        urgent: { type: Boolean, default: false },
      },
    ],
    itinerary: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model('Trip', tripSchema, 'trip_enquiry');
export default Trip;
