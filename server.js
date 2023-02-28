const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for JSon Req
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});

mongoose.connection.on('error', (err) => {
  console.error(`Database connection error: ${err}`);
});

app.get('/', (req, res) => {
    res.send('Social Network');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
