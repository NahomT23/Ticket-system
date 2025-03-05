import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import Loading from '../components/Loading'; // Import the reusable Loading component

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      loadingTickets: false,
      formData: {
        title: '',
        description: '',
        priority: 'medium',
        status: 'open', // default status added
      },
      creating: false,
      currentPage: 1,
      itemsPerPage: 5,
      isDialogOpen: false,
    };
  }

  componentDidMount() {
    this.loadTickets();
  }

  handleLogout = () => {
    const { dispatch, navigate } = this.props;
    dispatch(logout());
    navigate('/');
  };

  loadTickets = async () => {
    this.setState({ loadingTickets: true });
    const { token } = this.props.auth;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/get`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error loading tickets');
      } else {
        this.setState({ tickets: data.data });
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast('Error loading tickets');
    } finally {
      this.setState({ loadingTickets: false });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: value },
    }));
  };

  handleCreateTicket = async (e) => {
    e.preventDefault();
    this.setState({ creating: true });
    const { formData } = this.state;
    const { token } = this.props.auth;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error creating ticket');
      } else {
        toast('Ticket created successfully');
        this.setState({
          formData: { title: '', description: '', priority: 'medium', status: 'open' },
          isDialogOpen: false,
        });
        this.loadTickets(); // Refresh tickets after creation
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast('Error creating ticket');
    } finally {
      this.setState({ creating: false });
    }
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const {
      tickets,
      loadingTickets,
      formData,
      creating,
      currentPage,
      itemsPerPage,
      isDialogOpen,
    } = this.state;
    const { isDarkMode } = this.props;

    // Container classes based on dark mode state
    const containerClass = isDarkMode
      ? 'bg-gray-900 text-gray-100'
      : 'bg-white text-gray-900';

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tickets.length / itemsPerPage);

    return (
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-4 min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>   <Dialog open={isDialogOpen} onOpenChange={(open) => this.setState({ isDialogOpen: open })}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className={`mb-4 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}
            >
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`sm:max-w-[425px] ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
          >
            <DialogHeader>
              <DialogTitle>Create Ticket</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new ticket.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={this.handleCreateTicket}>
              <div className="grid gap-4 py-4">
                <div>
                  <label
                    className={`block mb-2 px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'text-gray-100' : 'bg-white text-gray-900'}`}
                  >
                    Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={this.handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={this.handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Priority:</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={this.handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Status:</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={this.handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  >
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => this.setState({ isDialogOpen: false })}
                  type="button"
                  className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className={`${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {creating ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tickets Table */}
        <div className="mt-6 flex flex-col flex-grow">
          <h2 className="text-lg font-medium mb-4">My Tickets</h2>
          {loadingTickets ? (
            <Loading text="Loading tickets..." isDarkMode={isDarkMode} />
          ) : tickets.length === 0 ? (
            <div>No tickets found.</div>
          ) : (
            <div className="flex-grow">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr>
                    <th className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>
                      Title
                    </th>
                    <th className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>
                      Description
                    </th>
                    <th className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>
                      Status
                    </th>
                    <th className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        {ticket.title}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        {ticket.description}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        {ticket.status}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        {ticket.priority || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}

          
{tickets.length > 0 && (
  <div className="flex justify-center mt-4 pb-20">
    <button
      onClick={() => this.paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}
    >
      Prev
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
      <button
        key={number}
        onClick={() => this.paginate(number)}
        className={`px-3 py-1 rounded mx-1 ${
          currentPage === number
            ? 'bg-blue-500 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-gray-100'
            : 'bg-gray-300 text-gray-900'
        }`}
      >
        {number}
      </button>
    ))}
    <button
      onClick={() => this.paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}
    >
      Next
    </button>
  </div>
)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  isDarkMode: state.theme.isDarkMode,
});

export default connect(mapStateToProps)(UserDashboard);
