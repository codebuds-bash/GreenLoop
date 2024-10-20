const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin:9752748594@greenloop-cluster.cu5rv.mongodb.net/your_db_name?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
