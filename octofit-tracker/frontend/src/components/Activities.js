import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    const baseUrl = codespaceName
      ? `https://${codespaceName}-8000.app.github.dev`
      : 'http://localhost:8000';
    const apiUrl = `${baseUrl}/api/activities/`;
    console.log('Activities API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 loading-container fade-in">
        <div className="spinner-border text-primary loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 loading-spinner">Loading activities...</p>
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
        <h2>🏃 Activities Tracker</h2>
        <p className="mb-0">Monitor all fitness activities</p>
      </div>
      
      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">User</th>
                <th scope="col">Type</th>
                <th scope="col">Duration</th>
                <th scope="col">Distance</th>
                <th scope="col">Calories</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center empty-state">
                    <div className="py-4">
                      <p className="mb-0">📋 No activities found</p>
                      <small className="text-muted">Start tracking your workouts!</small>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map(activity => (
                  <tr key={activity.id}>
                    <td className="fw-bold">{activity.id}</td>
                    <td>
                      <span className="badge bg-primary">{activity.user}</span>
                    </td>
                    <td>
                      <span className="badge bg-info">{activity.activity_type}</span>
                    </td>
                    <td>{activity.duration} <small className="text-muted">min</small></td>
                    <td>{activity.distance} <small className="text-muted">km</small></td>
                    <td>
                      <span className="badge bg-success">{activity.calories} cal</span>
                    </td>
                    <td>{new Date(activity.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activities;
