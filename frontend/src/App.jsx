import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

function App() {
    const [exercise, setExercise] = useState(null);
    const [userSolution, setUserSolution] = useState('');
    const [result, setResult] = useState(null);
    const [score, setScore] = useState(localStorage.getItem("score") || 0);
    const [solutionRevealed, setSolutionRevealed] = useState(false);
    const [executionResult, setExecutionResult] = useState('');

    const fetchExercise = () => {
        setUserSolution('');
        setResult(null);
        setExecutionResult('');
        setSolutionRevealed(false);

        fetch('https://exo-js.philippe-gaulin.dev/api/exercises/random')
            .then(response => response.json())
            .then(data => setExercise(data))
            .catch(error => console.error("Erreur lors du chargement de l'exercice :", error));
    };

    useEffect(() => {
        fetchExercise();
    }, []);

    const handleSubmit = async () => {
        const response = await fetch('https://exo-js.philippe-gaulin.dev/api/exercises/check', {
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

    const executeCode = () => {
        if (!exercise) return;
    
        try {
            const functionNameMatch = userSolution.match(/function\s+(\w+)\s*\(/);
            
            if (!functionNameMatch) {
                setExecutionResult("Erreur : Impossible de détecter la fonction.");
                return;
            }
    
            const functionName = functionNameMatch[1];
    
            const func = new Function(`
                "use strict";
                ${userSolution}
                return ${functionName}(${exercise.example.match(/\((.*?)\)/)[1]});
            `);
    
            const result = func();
            setExecutionResult(result !== undefined ? result.toString() : "Aucune sortie");
    
        } catch (error) {
            setExecutionResult(`Erreur : ${error.message}`);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-red-400">🎯 Exercice de JavaScript</h1>
                <h2 className="text-lg sm:text-xl text-center mb-4">🏆 Score : <span className="text-yellow-400">{score}</span></h2>

                {exercise ? (
                    <div>
                        <h2 className="text-2xl font-semibold">{exercise.title}</h2>
                        <p className="text-gray-300">{exercise.description}</p>
                        <pre className="bg-gray-700 p-4 rounded-md mt-2 break-words overflow-x-auto">{exercise.example}</pre>

                        <CodeMirror
                            value={userSolution}
                            extensions={[javascript()]}
                            theme={oneDark}
                            onChange={(value) => setUserSolution(value)}
                            className="mt-4 w-full border border-gray-600 rounded-md overflow-x-auto"
                        />

                        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold transition-all">✅ Vérifier</button>
                            <button onClick={executeCode} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold transition-all">▶ Exécuter</button>
                            <button onClick={fetchExercise} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-semibold transition-all">⏭ Passer</button>
                        </div>

                        {executionResult && (
                            <div className="mt-4 p-4 bg-gray-700 text-green-400 rounded-md">
                                <h3 className="font-semibold text-yellow-400">Résultat :</h3>
                                <pre className="break-words overflow-x-auto">{executionResult}</pre>
                            </div>
                        )}

                        {result && <p className="mt-4 text-lg font-bold">{result}</p>}

                        {!solutionRevealed && result === "❌ Mauvaise réponse, essaie encore !" && (
                            <button onClick={() => setSolutionRevealed(true)} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold transition-all">👀 Voir la solution</button>
                        )}

                        {solutionRevealed && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-md">
                                <h3 className="font-semibold text-yellow-400">Solution :</h3>
                                <CodeMirror
                                    value={exercise.solution}
                                    extensions={[javascript()]}
                                    theme={oneDark}
                                    options={{
                                        mode: 'javascript',
                                        lineNumbers: true,
                                        tabSize: 2,
                                        indentWithTabs: false,
                                        readOnly: true,
                                    }}
                                    className="mt-2 w-full border border-gray-600 rounded-md overflow-x-auto"
                                />
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