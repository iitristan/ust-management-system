import React from 'react';
import { formatTime } from '../utils/formatTime';
import DashboardInfoCards from '../components/dashboard/dashboardinfocards';

const Dashboard = ({ user }) => {
  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">
        Welcome back, <span className="text-yellow-500">{user?.name || "User"}</span>
      </h1>

      {/* Ticket Summary Section */}
      <DashboardInfoCards formatTime={formatTime} />

      {/* Recent Activity Section */}
      {/* ... rest of the code remains unchanged */}
    </div>
  );
};

export default Dashboard;
