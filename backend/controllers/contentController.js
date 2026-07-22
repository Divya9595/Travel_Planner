import Content from "../models/Content.js";

export const getContent = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await Content.findOne({ section });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find().sort({ section: 1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { section } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ message: "Value is required" });
    }

    const content = await Content.findOneAndUpdate(
      { section },
      { value, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await Content.findOneAndDelete({ section });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
