import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="p-8 min-h-screen">

<h1 className="text-4xl font-bold mb-6">
        Welcome back, <span className="text-yellow-500">{user.name ?? "User"}</span>
      </h1>

      {/* Ticket Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Ticket Completed */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="completed-image.jpg" alt="Completed" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">52</h2>
          <p className="text-lg font-semibold mt-2">Ticket/s Completed</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full">See More</button>
        </div>

        {/* Ticket In Process */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="in-process-image.jpg" alt="In Process" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">10</h2>
          <p className="text-lg font-semibold mt-2">Ticket/s In Process</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full">See More</button>
        </div>

        {/* Ticket Pending */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="pending-image.jpg" alt="Pending" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">7</h2>
          <p className="text-lg font-semibold mt-2">Ticket/s Pending</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full">See More</button>
        </div>

        {/* Ticket On Hold */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img src="on-hold-image.jpg" alt="On Hold" className="rounded-md mb-4" />
          <h2 className="text-6xl font-bold text-yellow-500">1</h2>
          <p className="text-lg font-semibold mt-2">Ticket/s On Hold</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full">See More</button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">June 28, 2023, 6:49PM</p>
                <p className="text-gray-600">Submitted: Ticket#2920</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">View</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">June 23, 2023, 1:37AM</p>
                <p className="text-gray-600">User Profile: Account settings updated</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">View</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">May 20, 2023, 1:00PM</p>
                <p className="text-gray-600">Success: Ticket#002 has been verified</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">View</button>
            </div>
            {/* Add more activities as needed */}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Latest Announcements</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">June 10, 2023, 10:00AM</p>
                <p className="text-gray-600">Start of Summer Term</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Read</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">May 28, 2023, 4:00PM</p>
                <p className="text-gray-600">Employees’ Retreat</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Read</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">May 10, 2023, 10:30AM</p>
                <p className="text-gray-600">New Office Hours</p>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">Read</button>
            </div>
            {/* Add more announcements as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
