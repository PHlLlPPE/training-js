const express = require('express');
const router = express.Router();

let exercises = [
    { id: 1, title: "Écrire une fonction qui inverse une chaîne", language: "JavaScript" },
    { id: 2, title: "Créer une fonction qui retourne la somme d'un tableau", language: "Python" }
];

// Récupérer tous les exercices
router.get('/', (req, res) => {
    res.json(exercises);
});

module.exports = router;
