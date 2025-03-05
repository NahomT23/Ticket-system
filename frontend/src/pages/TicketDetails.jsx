import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import { InView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

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
    this.props.navigate(-1);
  };

  renderTicketDetails() {
    const { ticket } = this.state;
    const { isDarkMode } = this.props;

    return (
      <div className={`p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
              {ticket.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-extrabold`}>
                Description:
              </p>
              <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-1`}>
                {ticket.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-extrabold`}>
                  Status:
                </p>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-1`}>
                  {ticket.status}
                </p>
              </div>
              <div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-extrabold`}>
                  Priority:
                </p>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-1`}>
                  {ticket.priority || 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-extrabold`}>
                  Created By:
                  <div>
                    <h1 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-1 font-bold`}>Name: </h1>
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-1 font-extralight`}>
                  {ticket.createdBy ? ticket.createdBy.name : 'N/A'}
                </p>
                
                <h1 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-bold`}>Email: </h1>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-extralight`} >
                  {ticket.createdBy ? ticket.createdBy.email : 'N/A'}
                </p>
                  </div>
                </p>

              </div>
              <div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-extrabold`}>
                  Created At:
                </p>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mt-1`}>
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  render() {
    const { ticket, loading, error } = this.state;
    const { isDarkMode } = this.props;

    // Change the body background color dynamically based on dark mode
    document.body.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#ffffff';

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
      <div className={`p-8 ${isDarkMode ? 'bg-gray-900 text-black' : 'bg-white text-black'} min-h-screen`}>
        <Button variant="outline" onClick={this.handleBack} className="mb-4">
          Back
        </Button>
        <InView triggerOnce threshold={0.2}>
          {({ inView, ref }) => (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {this.renderTicketDetails()}
            </motion.div>
          )}
        </InView>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  isDarkMode: state.theme.isDarkMode,
});

export default connect(mapStateToProps)(withRouter(TicketDetails));



