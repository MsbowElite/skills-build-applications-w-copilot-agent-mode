import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Users API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
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
        <p className="mt-3 loading-spinner">Loading users...</p>
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
        <h2>👥 Users</h2>
        <p className="mb-0">Manage and view all registered users</p>
      </div>
      
      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Full Name</th>
                <th scope="col">Team</th>
                <th scope="col" className="text-end">Points</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center empty-state">
                    <div className="py-4">
                      <p className="mb-0">👥 No users found</p>
                      <small className="text-muted">Register to start your fitness journey!</small>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td className="fw-bold">{user.id}</td>
                    <td>
                      <span className="badge bg-primary">{user.username}</span>
                    </td>
                    <td>
                      <small className="text-muted">{user.email}</small>
                    </td>
                    <td>
                      {user.first_name || user.last_name ? 
                        `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                        <span className="text-muted">N/A</span>
                      }
                    </td>
                    <td>
                      {user.team ? 
                        <span className="badge bg-secondary">{user.team}</span> : 
                        <span className="text-muted">No Team</span>
                      }
                    </td>
                    <td className="text-end">
                      <span className="badge bg-success fs-6">
                        {user.total_points || 0} pts
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

export default Users;
