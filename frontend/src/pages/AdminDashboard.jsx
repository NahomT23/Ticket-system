import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';

import TicketStats from '../components/TicketStats';
import TicketFilters from '../components/TicketFilters';
import TicketTable from '../components/TicketTable';
import DeleteDialog from '../components/DeleteDialog';
import Pagination from '../components/Pagination';
import DashboardAnalytics from '../components/Analytics';
import InvitationCodeCard from '../components/InvitationCodeCard';
import Loading from '../components/Loading';
import { Button } from '@/components/ui/button';

// Assume fetchTickets is available via redux action creators
import { fetchTickets } from '../features/ticketSlice';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchTerm: '',
      selectedPriority: 'all',
      selectedStatus: 'all',
      isDeleteDialogOpen: false,
      ticketToDelete: null,
      copied: false,
      invitationCode: null,
      loadingCode: false,
      ticketsLoading: false,
      redirectToHome: false,
    };
  }

  componentDidMount() {
    this.refreshTickets();
  }

  refreshTickets = () => {
    this.setState({ ticketsLoading: true });
    this.props.dispatch(fetchTickets()).then(() => {
      this.setState({ ticketsLoading: false });
    }).catch((error) => {
      console.error(error);
      this.setState({ ticketsLoading: false });
    });
  };

  generateCode = async () => {
    this.setState({ loadingCode: true });
    const { token } = this.props.auth;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error generating invitation code');
      } else {
        this.setState({ invitationCode: data.data.code });
        toast('Invitation code generated');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast('Error generating invitation code');
    } finally {
      this.setState({ loadingCode: false });
    }
  };

  handleCopyCode = () => {
    const { invitationCode } = this.state;
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode);
      toast('Invitation code copied to clipboard!');
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 3000);
    }
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  handleDeleteClick = (ticketId) => {
    this.setState({ isDeleteDialogOpen: true, ticketToDelete: ticketId });
  };

  handleDelete = async (ticketId) => {
    const { token } = this.props.auth;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/delete/${ticketId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Error deleting ticket');
      } else {
        toast('Ticket deleted successfully');
        this.refreshTickets();
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Error deleting ticket');
    }
    this.setState({ isDeleteDialogOpen: false, ticketToDelete: null });
  };

  handleSearchChange = (value) => {
    this.setState({ searchTerm: value, currentPage: 1 });
  };

  handleStatusChange = (value) => {
    this.setState({ selectedStatus: value, currentPage: 1 });
  };

  handlePriorityChange = (value) => {
    this.setState({ selectedPriority: value, currentPage: 1 });
  };

  render() {
    const {
      currentPage,
      searchTerm,
      selectedPriority,
      selectedStatus,
      isDeleteDialogOpen,
      ticketToDelete,
      copied,
      invitationCode,
      loadingCode,
      ticketsLoading,
      redirectToHome,
    } = this.state;
    const { tickets, isDarkMode } = this.props;

    // Redirect if needed
    if (redirectToHome) {
      return <Navigate to="/" />;
    }
    if (ticketsLoading) {
      return <Loading text="Loading Dashboard..." isDarkMode={isDarkMode} />;
    }

    // Filter tickets
    const filteredTickets = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority =
        selectedPriority === 'all' || ticket.priority === selectedPriority;
      const matchesStatus =
        selectedStatus === 'all' ||
        ticket.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesPriority && matchesStatus;
    });

    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const pageVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <InView triggerOnce>
        {({ inView, ref }) => (
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className={`min-h-screen p-4 md:p-8 space-y-8 transition-colors duration-300 ${
              isDarkMode ? 'dark bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="flex justify-end">
              <Button onClick={this.generateCode} disabled={loadingCode} className="mb-4">
                {loadingCode ? 'Generating...' : 'Generate Invitation Code'}
              </Button>
            </div>
            {invitationCode && (
              <InvitationCodeCard
                invitationCode={invitationCode}
                copied={copied}
                onCopy={this.handleCopyCode}
                isDarkMode={isDarkMode}
              />
            )}
            <TicketStats isDarkMode={isDarkMode} />
            <TicketFilters
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              selectedPriority={selectedPriority}
              onSearchChange={this.handleSearchChange}
              onStatusChange={this.handleStatusChange}
              onPriorityChange={this.handlePriorityChange}
              isDarkMode={isDarkMode}
            />
            {currentTickets.length === 0 ? (
              <p className={`text-center py-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                No tickets found.
              </p>
            ) : (
              <TicketTable
                tickets={currentTickets}
                isDarkMode={isDarkMode}
                onDeleteClick={this.handleDeleteClick}
              />
            )}
            <DeleteDialog
              isOpen={isDeleteDialogOpen}
              onClose={() =>
                this.setState({ isDeleteDialogOpen: false, ticketToDelete: null })
              }
              onConfirm={() => this.handleDelete(ticketToDelete)}
              isDarkMode={isDarkMode}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPaginate={this.paginate}
              isDarkMode={isDarkMode}
            />
            <DashboardAnalytics isDarkMode={isDarkMode} />
          </motion.div>
        )}
      </InView>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tickets: state.tickets.tickets,
  isDarkMode: state.theme.isDarkMode,
});

export default connect(mapStateToProps)(AdminDashboard);
