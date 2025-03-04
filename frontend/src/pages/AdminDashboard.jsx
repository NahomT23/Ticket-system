import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { fetchTickets } from '../features/ticketSlice';
import TicketStats from '../components/TicketStats';
import DashboardAnalytics from '../components/Analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,     
  TableCell
} from '@/components/ui/table';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationCode: null,
      loadingCode: false,
      currentPage: 1,
      itemsPerPage: 5,
      redirectToHome: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTickets());
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logout());
    this.setState({ redirectToHome: true });
  };

  handleGenerateCode = async () => {
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
        alert(data.message || 'Error generating invitation code');
      } else {
        this.setState({ invitationCode: data.data.code });
      }
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Error generating invitation code');
    } finally {
      this.setState({ loadingCode: false });
    }
  };

  handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
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
        alert(data.message || 'Error deleting ticket');
      } else {
        alert('Ticket deleted successfully');
        this.props.dispatch(fetchTickets());
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Error deleting ticket');
    }
  };

  handleUpdate = async (ticketId) => {
    const newStatus = prompt('Enter new status (open, in progress, completed):');
    if (!newStatus) return;
    const { token } = this.props.auth;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/update/${ticketId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Error updating ticket');
      } else {
        alert('Ticket updated successfully');
        this.props.dispatch(fetchTickets());
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Error updating ticket');
    }
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { invitationCode, loadingCode, currentPage, itemsPerPage, redirectToHome } = this.state;
    const { tickets, auth } = this.props;


      const adminName = auth.user ? auth.user.name || auth.user.email : 'Admin';

    if (redirectToHome) {
      return <Navigate to="/" />;
    }

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tickets.length / itemsPerPage);

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome {adminName}</h1>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="destructive" className="text-red-600" onClick={this.handleLogout}>
              Logout
            </Button>
            <Button variant="default" onClick={this.handleGenerateCode}>
              {loadingCode ? 'Generating...' : 'Generate Invitation Code'}
            </Button>
          </div>
        </div>

        {/* Invitation Code */}
        {invitationCode && (
          <Card>
            <CardContent>
              <p>
                Invitation Code: <strong>{invitationCode}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ticket Stats at the Top */}
        <TicketStats />

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {tickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTickets.map((ticket) => (
                    <TableRow key={ticket._id}>
                    <Link to={`/ticket/${ticket._id}`} className="hover:underline">                    
                    <TableCell>{ticket.title}</TableCell>
                    </Link>
                      <TableCell>{ticket.description}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.priority || 'N/A'}</TableCell>
                      <TableCell>
                        {ticket.createdBy
                          ? ticket.createdBy.name || ticket.createdBy.email
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" onClick={() => this.handleUpdate(ticket._id)}>
                          Update
                        </Button>
                        <Button variant="destructive" onClick={() => this.handleDelete(ticket._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2">
          <Button onClick={() => this.paginate(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? 'default' : 'outline'}
              onClick={() => this.paginate(number)}
            >
              {number}
            </Button>
          ))}
          <Button
            onClick={() => this.paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

        {/* Dashboard Analytics at the Bottom */}
        <DashboardAnalytics />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  tickets: state.tickets.tickets,
});

export default connect(mapStateToProps)(DashboardPage);
