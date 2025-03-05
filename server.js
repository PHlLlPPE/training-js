const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const exercisesRoutes = require('./routes/exercises');
app.use('/api/exercises', exercisesRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
