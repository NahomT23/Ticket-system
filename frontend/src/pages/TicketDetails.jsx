import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';

// withRouter HOC to inject router props into a class component
export function withRouter(WrappedComponent) {
  return function ComponentWithRouterProp(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <WrappedComponent {...props} params={params} navigate={navigate} />;
  };
}

class TicketDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: null,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchTicket();
  }

  fetchTicket = async () => {
    this.setState({ loading: true });
    const { token } = this.props.auth;
    const { id } = this.props.params; // gets ticket id from URL parameters
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/getById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        this.setState({ error: data.message || 'Error fetching ticket' });
      } else {
        this.setState({ ticket: data.data });
      }
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleBack = () => {
    // Go back to the previous page (or you can navigate to a fixed route)
    this.props.navigate(-1);
  };

  render() {
    const { ticket, loading, error } = this.state;

    if (loading) {
      return <p className="p-8">Loading ticket details...</p>;
    }
    if (error) {
      return <p className="p-8">Error: {error}</p>;
    }
    if (!ticket) {
      return <p className="p-8">No ticket details found.</p>;
    }

    return (
      <div className="p-8 space-y-4">
        <Button variant="outline" onClick={this.handleBack} className="mb-4">
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Description:</strong> {ticket.description}
            </p>
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            <p>
              <strong>Priority:</strong> {ticket.priority || 'N/A'}
            </p>
            <p>
              <strong>Created By:</strong>{' '}
              {ticket.createdBy
                ? ticket.createdBy.name || ticket.createdBy.email
                : 'N/A'}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(TicketDetails));
