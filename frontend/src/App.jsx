import { useState, useEffect } from 'react';

function App() {
  const [exercise, setExercise] = useState(null);
  const [userSolution, setUserSolution] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/exercises/random')
        .then(response => response.json())
        .then(data => setExercise(data))
        .then(error => console.error("Erreur lors du chargement de l'exercice :", error));
  }, []);

  const handleSubmit = async ( ) => {
    const response = await fetch('http://localhost/5000/api/exercises/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ id: exercise.id, userSolution})

    });

    const data = await response.json();
    setResult(data.success ? "✅ Correct !" : "❌ Mauvaise réponse, essaie encore !");
  };

  return (
    <div>
      <h1>Exercice de JavaScript</h1>
      {exercise ? (
        <div>
          <h2>{exercise.title}</h2>
          <p>{exercise.description}</p>
          <pre>{exercise.example}</pre>
          <textarea
              rows="5"
              cols="50"
              value="{userSolution}"
              onChange={(e) => setUserSolution(e.target.value)}
              placeholder='Écris ta solution ici...'
              />
              <br />
              <button onClick={handleSubmit}>Vérifier</button>
              {result && <p>{result}</p>}
        </div>
      ) : (
          <p>Chargement...</p>
      )}
    </div>
  );
}

export default App;