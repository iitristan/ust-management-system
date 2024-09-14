import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. This is a placeholder component.</p>
      <div className="dashboard-content">
        <section>
          <h2>Quick Stats</h2>
          <p>Your stats will appear here.</p>
        </section>
        <section>
          <h2>Recent Activity</h2>
          <p>Your recent activities will be listed here.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
