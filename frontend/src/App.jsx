import { useState, useEffect } from 'react';

function App() {
    const [exercise, setExercise] = useState(null);
    const [userSolution, setUserSolution] = useState('');
    const [result, setResult] = useState(null);
    const [score, setScore] = useState(localStorage.getItem("score") || 0);
    const [solutionRevealed, setSolutionRevealed] = useState(false);

    // Charger un exercice aléatoire
    const fetchExercise = () => {
        setUserSolution('');
        setResult(null);
        setSolutionRevealed(false);

        fetch('http://localhost:5000/api/exercises/random')
            .then(response => response.json())
            .then(data => setExercise(data))
            .catch(error => console.error("Erreur lors du chargement de l'exercice :", error));
    };

    useEffect(() => {
        fetchExercise();
    }, []);

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/api/exercises/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: exercise.id, userSolution })
        });

        const data = await response.json();
        if (data.success) {
            setResult("✅ Correct !");
            const newScore = parseInt(score) + 1;
            setScore(newScore);
            localStorage.setItem("score", newScore);
        } else {
            setResult("❌ Mauvaise réponse, essaie encore !");
        }
    };

    return (
        <div>
            <h1>Exercice de JavaScript</h1>
            <h2>Score : {score} 🏆</h2>

            {exercise ? (
                <div>
                    <h2>{exercise.title}</h2>
                    <p>{exercise.description}</p>
                    <pre>{exercise.example}</pre>

                    <textarea
                        rows="5"
                        cols="50"
                        value={userSolution}
                        onChange={(e) => setUserSolution(e.target.value)}
                        placeholder="Écris ta solution ici..."
                    />
                    <br />

                    <button onClick={handleSubmit}>Vérifier</button>
                    <button onClick={fetchExercise} style={{ marginLeft: "10px" }}>⏭ Passer</button>

                    {result && <p>{result}</p>}

                    {!solutionRevealed && result === "❌ Mauvaise réponse, essaie encore !" && (
                        <button onClick={() => setSolutionRevealed(true)}>Voir la solution</button>
                    )}

                    {solutionRevealed && (
                        <div>
                            <h3>Solution :</h3>
                            <pre>{exercise.solution}</pre>
                        </div>
                    )}
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
}

export default App;
