import { useState, useEffect } from 'react';

function App() {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/exercises')
            .then(response => response.json())
            .then(data => setExercises(data))
            .catch(error => console.error("Erreur lors du chargement des exercices :", error));
    }, []);

    return (
        <div>
            <h1>Liste des Exercices</h1>
            <ul>
                {exercises.map(exercise => (
                    <li key={exercise.id}>
                        {exercise.title} - Langage : {exercise.language}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
