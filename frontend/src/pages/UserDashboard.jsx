import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [creating, setCreating] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const token = auth.token;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/get`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error loading tickets');
      } else {
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      alert('Error loading tickets');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = auth.token;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error creating ticket');
      } else {
        alert('Ticket created successfully');
        setFormData({ title: '', description: '', priority: 'medium' });
        loadTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket');
    } finally {
      setCreating(false);
    }
  };

  // Auto-load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl mb-6">User Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Create Ticket</h2>
        <form onSubmit={handleCreateTicket} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md max-w-md">
          <div className="mb-4">
            <label className="block mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Priority:</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
            {creating ? 'Creating...' : 'Create Ticket'}
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl mb-4">My Tickets</h2>
        {loadingTickets ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded">
                <thead>
                  <tr>
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="border p-2">{ticket.title}</td>
                      <td className="border p-2">{ticket.description}</td>
                      <td className="border p-2">{ticket.status}</td>
                      <td className="border p-2">{ticket.priority || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
