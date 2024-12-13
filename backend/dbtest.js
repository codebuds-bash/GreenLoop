const mongoose = require('mongoose');

const uri = 'mongodb+srv://greenloop_new_user:9752748594@cluster0greenloop.cu5rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0GREENLOOP';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
