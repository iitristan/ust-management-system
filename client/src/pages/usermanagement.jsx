import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.API_URL}/api/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleEditUser = async (editedUser) => {
    try {
      const response = await axios.put(`${process.env.API_URL}/api/users/${editedUser.id}`, editedUser);
      const updatedUser = response.data.user;
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAccessChange = async (userId, newAccessValue) => {
    try {
      const response = await axios.put(`${process.env.API_URL}/api/users/${userId}`, { access: newAccessValue });
      const updatedUser = response.data.user;
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
    } catch (error) {
      console.error('Error updating user access:', error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div>
      <div className="bg-[#FEC00F] py-6 mb-4">
        <h1 className="text-4xl font-bold text-black text-left px-6">User Management</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Picture</th>
              <th className="py-2 px-4 border-b">HD</th>
              <th className="py-2 px-4 border-b">Access</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-center">{user.id}</td>
                <td className="py-2 px-4 border-b text-center">{user.name}</td>
                <td className="py-2 px-4 border-b text-center">{user.email}</td>
                <td className="py-2 px-4 border-b text-center">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                </td>
                <td className="py-2 px-4 border-b">{user.hd}</td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={user.access}
                    onChange={(e) => handleAccessChange(user.id, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEditClick(user)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-between items-center mt-4">
        {/* ... (pagination controls remain unchanged) ... */}
      </div>

      {editingUser && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit User</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleEditUser(editingUser);
      }}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={editingUser.name}
            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <input
            type="text"
            id="role"
            value={editingUser.role}
            onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editingUser.access}
              onChange={(e) => setEditingUser({...editingUser, access: e.target.checked})}
              className="form-checkbox h-5 w-5 text-blue-600 mr-2"
            />
            <span className="text-gray-700 text-sm font-bold">Access</span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default UserManagement;