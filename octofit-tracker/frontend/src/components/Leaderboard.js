import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Leaderboard API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-badge rank-1';
    if (index === 1) return 'rank-badge rank-2';
    if (index === 2) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  if (loading) {
    return (
      <div className="container mt-5 loading-container fade-in">
        <div className="spinner-border text-primary loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 loading-spinner">Loading leaderboard...</p>
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
        <h2>🏆 Leaderboard</h2>
        <p className="mb-0">Top performers and rankings</p>
      </div>
      
      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" className="text-center">Rank</th>
                <th scope="col">User</th>
                <th scope="col">Team</th>
                <th scope="col" className="text-end">Total Points</th>
                <th scope="col" className="text-center">Activities</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center empty-state">
                    <div className="py-4">
                      <p className="mb-0">🏆 No leaderboard data found</p>
                      <small className="text-muted">Start competing to see rankings!</small>
                    </div>
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr key={entry.id || index}>
                    <td className="text-center">
                      <div className={getRankBadgeClass(index)}>
                        {index + 1}
                      </div>
                    </td>
                    <td>
                      <strong>{entry.user}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {entry.team || 'N/A'}
                      </span>
                    </td>
                    <td className="text-end">
                      <span className="badge bg-success fs-6">
                        {entry.total_points} pts
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-info">
                        {entry.activities_count}
                      </span>
                    </td>
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

export default Leaderboard;
