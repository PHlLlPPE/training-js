const express = require('express');
const fs = require('fs');
const router = express.Router();

// Charger les exercices
const getExercises = () => {
    const data = fs.readFileSync('./exercises.json');
    return JSON.parse(data);
};

// Route pour récupérer tous les exercices
router.get('/', (req, res) => {
    res.json(getExercises());
});

// Route pour récupérer un exercice aléatoire
router.get('/random', (req, res) => {
    const exercises = getExercises();
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    res.json(randomExercise);
});

// Route pour vérifier une réponse (comparaison brute)
router.post('/check', (req, res) => {
    const { id, userSolution } = req.body;
    const exercises = getExercises();
    const exercise = exercises.find(ex => ex.id === id);

    if (!exercise) {
        return res.status(404).json({ success: false, message: "Exercice non trouvé" });
    }

    // Vérification simplifiée (on compare les chaînes brutes)
    const isCorrect = userSolution.trim() === exercise.solution.trim();
    res.json({ success: isCorrect });
});

module.exports = router;
