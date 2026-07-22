import Trip from '../models/Trip.js';

export const createTrip = async (req, res) => {
  try {
    const {
      from,
      destination,
      dateFrom,
      dateTo,
      travellers,
      dates,
      weather,
      attractions,
      packing,
      todoList,
      transport,
      reminders,
      itinerary,
    } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const trip = await Trip.create({
      user: req.user.id,
      from,
      destination,
      dateFrom,
      dateTo,
      travellers,
      dates,
      weather,
      attractions,
      packing,
      todoList,
      transport,
      reminders,
      itinerary,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { packing, todoList, reminders, transport } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    if (packing !== undefined) trip.packing = packing;
    if (todoList !== undefined) trip.todoList = todoList;
    if (reminders !== undefined) trip.reminders = reminders;
    if (transport !== undefined) trip.transport = transport;
    const updated = await trip.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
