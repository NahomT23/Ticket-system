import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { fetchTickets } from '../features/ticketSlice';
import { toggleTheme } from '../features/themeSlice';
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
  TableCell,
} from '@/components/ui/table';
import { Moon, Sun, Edit2, Trash2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import {
  DialogDescription,
  DialogHeader,
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';
import Loading from '../components/Loading';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationCode: null,
      loadingCode: false,
      ticketsLoading: true,
      currentPage: 1,
      itemsPerPage: 5,
      redirectToHome: false,
      searchTerm: '',
      selectedPriority: 'all',
      selectedStatus: 'all',
      isDeleteDialogOpen: false,
      ticketToDelete: null,
      copied: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // Set ticketsLoading to true then fetch tickets
    this.setState({ ticketsLoading: true });
    dispatch(fetchTickets()).then(() => {
      this.setState({ ticketsLoading: false });
    });
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
      // Optionally set a copied state to change the icon (if desired)
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 3000);
    }
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
        this.props.dispatch(fetchTickets());
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Error deleting ticket');
    }
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  toggleDarkMode = () => {
    const { dispatch } = this.props;
    dispatch(toggleTheme());
  };

  get filteredTickets() {
    const { tickets } = this.props;
    const { searchTerm, selectedPriority, selectedStatus } = this.state;

    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
      const matchesStatus =
        selectedStatus === 'all' ||
        ticket.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }

  render() {
    const {
      invitationCode,
      currentPage,
      itemsPerPage,
      redirectToHome,
      searchTerm,
      selectedPriority,
      selectedStatus,
      ticketsLoading,
      copied,
    } = this.state;

    const { tickets, auth, isDarkMode } = this.props;
    // Show Loading component if tickets are still being fetched
    if (ticketsLoading) {
      return <Loading text="Loading Dashboard..." isDarkMode={isDarkMode} />;
    }

    const filteredTickets = this.filteredTickets;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const pageVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    if (redirectToHome) {
      return <Navigate to="/" />;
    }

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
              <Button
                onClick={this.handleGenerateCode}
                disabled={this.state.loadingCode}
                className="mb-4"
              >
                {this.state.loadingCode ? 'Generating...' : 'Generate Invitation Code'}
              </Button>
            </div>

            {invitationCode && (
              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <p className={`font-mono ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Invitation Code: <strong>{invitationCode}</strong>
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={this.handleCopyCode}
                    className={isDarkMode ? 'hover:bg-gray-600' : ''}
                  >
                    {copied ? (
                      <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
                        {/* You can replace this with a different icon if desired */}
                        Copied!
                      </span>
                    ) : (
                      <Copy size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            <TicketStats isDarkMode={isDarkMode} />

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle
                    className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
                  >
                    <Input
                      placeholder="Search by title..."
                      value={searchTerm}
                      onChange={(e) => this.setState({ searchTerm: e.target.value })}
                      className={`max-w-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                  </CardTitle>
                  <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
                    <div className="flex gap-2">
                      <Select
                        value={selectedStatus}
                        onValueChange={(value) => this.setState({ selectedStatus: value })}
                      >
                        <SelectTrigger
                          className={`w-[150px] ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'text-black'
                          }`}
                        >
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent
                          className={isDarkMode ? 'bg-gray-800 text-white' : 'text-black'}
                        >
                          <SelectItem
                            value="all"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            All Statuses
                          </SelectItem>
                          <SelectItem
                            value="open"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            Open
                          </SelectItem>
                          <SelectItem
                            value="in progress"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            In Progress
                          </SelectItem>
                          <SelectItem
                            value="completed"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            Completed
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedPriority}
                        onValueChange={(value) => this.setState({ selectedPriority: value })}
                      >
                        <SelectTrigger
                          className={`w-[150px] ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'text-black'
                          }`}
                        >
                          <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent
                          className={isDarkMode ? 'bg-gray-800 text-white' : 'text-black'}
                        >
                          <SelectItem
                            value="all"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            All Priorities
                          </SelectItem>
                          <SelectItem
                            value="low"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            Low
                          </SelectItem>
                          <SelectItem
                            value="medium"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            Medium
                          </SelectItem>
                          <SelectItem
                            value="high"
                            className={isDarkMode ? 'text-white' : 'text-black'}
                          >
                            High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentTickets.length === 0 ? (
                  <p
                    className={`text-center py-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    No tickets found.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <Table className="min-w-0 md:min-w-[600px]">
                      <TableHeader className={isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                        <TableRow>
                          <TableHead className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                            Title
                          </TableHead>
                          <TableHead
                            className={`hidden md:table-cell ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-900'
                            }`}
                          >
                            Description
                          </TableHead>
                          <TableHead className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                            Status
                          </TableHead>
                          <TableHead
                            className={`hidden md:table-cell ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            Priority
                          </TableHead>
                          <TableHead
                            className={`hidden md:table-cell ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-900'
                            }`}
                          >
                            Created By
                          </TableHead>
                          <TableHead className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTickets.map((ticket) => (
                          <TableRow
                            key={ticket._id}
                            className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                          >
                            <TableCell className="font-medium max-w-[150px] truncate">
                              <Link
                                to={`/ticket/${ticket._id}`}
                                className={`hover:underline ${
                                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}
                              >
                                {ticket.title}
                              </Link>
                            </TableCell>
                            <TableCell
                              className={`hidden md:table-cell ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-600'
                              }`}
                            >
                              <Link
                                to={`/ticket/${ticket._id}`}>
                              {ticket.description}
                           </Link>
                              </TableCell>
                            <TableCell className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  ticket.status.toLowerCase() === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : ticket.status.toLowerCase() === 'in progress'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`hidden md:table-cell ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                            >
                              {ticket.priority || 'N/A'}
                            </TableCell>
                            <TableCell
                              className={`hidden md:table-cell ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {ticket.createdBy
                                ? ticket.createdBy.name || ticket.createdBy.email
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Link to={`/ticket/update/${ticket._id}`}>
                                  <Button
                                    variant="outline"
                                    className={`${
                                      isDarkMode ? 'border-gray-200 text-gray-300' : 'text-gray-600'
                                    }`}
                                    size="sm"
                                  >
                                    <span className="block md:hidden">
                                      <Edit2
                                        size={16}
                                        className={`${
                                          isDarkMode ? 'text-gray-100' : 'text-gray-600'
                                        }`}
                                      />
                                    </span>
                                    <span className="hidden md:inline">Update</span>
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  className={`${
                                    isDarkMode ? 'border-red-400 text-red-300' : 'text-red-600'
                                  }`}
                                  size="sm"
                                  onClick={() =>
                                    this.setState({
                                      isDeleteDialogOpen: true,
                                      ticketToDelete: ticket._id,
                                    })
                                  }
                                >
                                  <Trash2
                                    size={16}
                                    className={`${
                                      isDarkMode ? 'text-red-300' : 'text-red-600'
                                    }`}
                                  />
                                  <span className="hidden md:inline ml-2">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <Dialog
                        open={this.state.isDeleteDialogOpen}
                        onOpenChange={(open) => {
                          if (!open) {
                            this.setState({
                              isDeleteDialogOpen: false,
                              ticketToDelete: null,
                            });
                          }
                        }}
                      >
                        <DialogContent
                          className={`${
                            isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
                          }`}
                        >
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this ticket? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="secondary"
                              onClick={() => this.setState({ isDeleteDialogOpen: false })}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={async () => {
                                await this.handleDelete(this.state.ticketToDelete);
                                this.setState({
                                  isDeleteDialogOpen: false,
                                  ticketToDelete: null,
                                });
                              }}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className={`flex justify-center space-x-2 ${isDarkMode ? 'text-gray-100' : ''}`}>
              <Button
                variant="outline"
                onClick={() => this.paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
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
                variant="outline"
                onClick={() => this.paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>

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
