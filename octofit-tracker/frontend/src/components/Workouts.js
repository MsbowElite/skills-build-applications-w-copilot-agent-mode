import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    const baseUrl = codespaceName
      ? `https://${codespaceName}-8000.app.github.dev`
      : 'http://localhost:8000';
    const apiUrl = `${baseUrl}/api/workouts/`;
    console.log('Workouts API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'Beginner': 'bg-success',
      'Intermediate': 'bg-warning',
      'Advanced': 'bg-danger',
      'Expert': 'bg-dark'
    };
    return badges[difficulty] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container mt-5 loading-container fade-in">
        <div className="spinner-border text-primary loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 loading-spinner">Loading workouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 error-container fade-in">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 fade-in">
      <div className="page-header text-center mb-4">
        <h2>💪 Workout Suggestions</h2>
        <p className="mb-0">Personalized workout plans to reach your goals</p>
      </div>
      
      <div className="row">
        {workouts.length === 0 ? (
          <div className="col-12 empty-state">
            <div className="text-center py-5">
              <p className="mb-0">💪 No workout suggestions found</p>
              <small className="text-muted">Check back later for new workouts!</small>
            </div>
          </div>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">{workout.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{workout.description}</p>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>🏃 Type:</strong></span>
                      <span className="badge bg-info">{workout.workout_type}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>⏱️ Duration:</strong></span>
                      <span className="badge bg-primary">{workout.duration} min</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>📊 Difficulty:</strong></span>
                      <span className={`badge ${getDifficultyBadge(workout.difficulty_level)}`}>
                        {workout.difficulty_level}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>🔥 Calories:</strong></span>
                      <span className="badge bg-success">{workout.calories_burned} cal</span>
                    </li>
                  </ul>
                </div>
                <div className="card-footer bg-transparent">
                  <button className="btn btn-primary btn-sm w-100">Start Workout</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Workouts;
