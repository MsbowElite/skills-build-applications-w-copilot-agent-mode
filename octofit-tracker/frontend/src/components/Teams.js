import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Teams API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
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
        <p className="mt-3 loading-spinner">Loading teams...</p>
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
        <h2>👫 Teams</h2>
        <p className="mb-0">Collaborate and compete together</p>
      </div>
      
      <div className="row">
        {teams.length === 0 ? (
          <div className="col-12 empty-state">
            <div className="text-center py-5">
              <p className="mb-0">👫 No teams found</p>
              <small className="text-muted">Create a team to get started!</small>
            </div>
          </div>
        ) : (
          teams.map(team => (
            <div key={team.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{team.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{team.description}</p>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>👑 Captain:</strong></span>
                      <span className="badge bg-primary">{team.captain || 'N/A'}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>👥 Members:</strong></span>
                      <span className="badge bg-success">{team.members_count || 0}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>📅 Created:</strong></span>
                      <span className="badge bg-secondary">
                        {new Date(team.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="card-footer bg-transparent">
                  <button className="btn btn-primary btn-sm w-100">View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Teams;
