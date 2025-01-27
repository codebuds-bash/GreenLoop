const RecyclingItem = require('../models/recyclingItem');

// Fetch recycling item details from the database
exports.getRecyclingItem = async (req, res) => {
  try {
    const item = await RecyclingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).send({ message: 'Recycling item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).send({ message: 'Server Error', error });
  }
};
