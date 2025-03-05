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
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4 text-red-400">🎯 Exercice de JavaScript</h1>
                <h2 className="text-xl text-center mb-4">🏆 Score : <span className="text-yellow-400">{score}</span></h2>

                {exercise ? (
                    <div>
                        <h2 className="text-2xl font-semibold">{exercise.title}</h2>
                        <p className="text-gray-300">{exercise.description}</p>
                        <pre className="bg-gray-700 p-4 rounded-md mt-2">{exercise.example}</pre>

                        <textarea
                            className="w-full p-3 mt-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="5"
                            value={userSolution}
                            onChange={(e) => setUserSolution(e.target.value)}
                            placeholder="Écris ta solution ici..."
                        />
                        
                        <div className="mt-4 flex justify-between">
                            <button 
                                onClick={handleSubmit} 
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold transition-all"
                            >
                                ✅ Vérifier
                            </button>
                            <button 
                                onClick={fetchExercise} 
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-semibold transition-all"
                            >
                                ⏭ Passer
                            </button>
                        </div>

                        {result && <p className="mt-4 text-lg font-bold">{result}</p>}

                        {!solutionRevealed && result === "❌ Mauvaise réponse, essaie encore !" && (
                            <button 
                                onClick={() => setSolutionRevealed(true)}
                                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold transition-all"
                            >
                                👀 Voir la solution
                            </button>
                        )}

                        {solutionRevealed && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-md">
                                <h3 className="font-semibold text-yellow-400">Solution :</h3>
                                <pre className="text-green-400">{exercise.solution}</pre>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">Chargement...</p>
                )}
            </div>
        </div>
    );
}

export default App;
