import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import TicketCreationDialog from '../components/TicketCreationDialog';
import TicketTable from '../components/UserTicketTable';
import Pagination from '../components/UserPagination';
import { logout } from '../features/authSlice';

const initialFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
};

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      loadingTickets: false,
      formData: { ...initialFormData },
      creating: false,
      isDialogOpen: false,
      currentPage: 1,
      itemsPerPage: 5,
    };
  }

  componentDidMount() {
    this.loadTickets();
  }

  loadTickets = async () => {
    this.setState({ loadingTickets: true });
    const { token } = this.props.auth;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ticket/get`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
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

  createTicket = async (e) => {
    e.preventDefault();
    this.setState({ creating: true });
    const { formData } = this.state;
    const { token } = this.props.auth;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error creating ticket');
      } else {
        toast('Ticket created successfully');
        this.setState({ formData: { ...initialFormData }, isDialogOpen: false });
        this.loadTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast('Error creating ticket');
    } finally {
      this.setState({ creating: false });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: { ...prevState.formData, [name]: value },
    }));
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logout());
    window.location.href = '/';
  };

  render() {
    const { tickets, loadingTickets, formData, creating, isDialogOpen, currentPage, itemsPerPage } = this.state;
    const { isDarkMode } = this.props;

    const containerClass = isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';

    // Calculate pagination indices
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tickets.length / itemsPerPage);

    return (
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-10 min-h-screen ${containerClass}`}>
        <TicketCreationDialog
          isDialogOpen={isDialogOpen}
          onOpenChange={(open) => this.setState({ isDialogOpen: open })}
          onSubmit={this.createTicket}
          formData={formData}
          onChange={this.handleChange}
          creating={creating}
          isDarkMode={isDarkMode}
        />
        <div className="mt-6 flex flex-col flex-grow">
          <h2 className="text-lg font-medium mb-4">My Tickets</h2>
          {loadingTickets ? (
            <Loading text="Loading tickets..." isDarkMode={isDarkMode} />
          ) : tickets.length === 0 ? (
            <div>No tickets found.</div>
          ) : (
            <TicketTable tickets={currentTickets} isDarkMode={isDarkMode} />
          )}
          {tickets.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPaginate={this.paginate}
              isDarkMode={isDarkMode}
            />
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
