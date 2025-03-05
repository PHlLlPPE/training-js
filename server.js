const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Définition des origines autorisées pour CORS
const allowedOrigins = [
    'https://exo-js.philippe-gaulin.dev',
    'http://localhost:5173' // Pour le développement
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST']
}));

app.use(express.json());

// Importation des routes API
const exercisesRoutes = require('./routes/exercises');
app.use('/api/exercises', exercisesRoutes);

// Servir le frontend (après avoir fait `npm run build` côté frontend)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Rediriger toutes les routes vers `index.html` pour un SPA (Single Page App)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
