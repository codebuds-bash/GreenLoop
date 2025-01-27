const mongoose = require('mongoose');

// Schema for RecyclingItem
const recyclingItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  materialDetails: { type: String, required: true },
  manufacturingLocation: String,
  uniqueTrackingID: { type: String, required: true, unique: true },
  recyclingFrequency: { type: Number, default: 0 },
  priorForms: String,
  recyclingState: { type: String, required: true },
  processingCenter: { type: String, required: true },
  energySavedAmount: String,
  waterSavedAmount: String,
  recycledOutput: String,
  carbonEmissionReduction: String,
  wasteDivertedWeight: String,
  sustainabilityScore: String,
  recyclingEvents: [{ date: String, description: String }],
  rewardPoints: { type: Number, default: 0 },
  totalRewards: { type: Number, default: 0 },
  potentialReuse: String,
  ecoTip: String,
});

const RecyclingItem = mongoose.model('RecyclingItem', recyclingItemSchema);

module.exports = RecyclingItem;
