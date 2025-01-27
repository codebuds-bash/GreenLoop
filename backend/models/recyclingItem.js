const mongoose = require('mongoose');

const recyclingSchema = new mongoose.Schema({
  itemName: String,
  materialDetails: String,
  manufacturingLocation: String,
  uniqueTrackingID: String,
  recyclingFrequency: Number,
  priorForms: String,
  recyclingState: String,
  processingCenter: String,
  energySavedAmount: String,
  waterSavedAmount: String,
  recycledOutput: String,
  carbonEmissionReduction: String,
  wasteDivertedWeight: String,
  sustainabilityScore: String,
  recyclingEvents: Array,
  rewardPoints: Number,
  totalRewards: Number,
  potentialReuse: String,
  ecoTip: String,
});

const RecyclingItem = mongoose.model('RecyclingItem', recyclingSchema);

module.exports = RecyclingItem;
