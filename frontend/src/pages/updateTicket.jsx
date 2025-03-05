import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

export function withRouter(WrappedComponent) {
  return function ComponentWithRouterProps(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <WrappedComponent {...props} params={params} navigate={navigate} />;
  };
}

class UpdateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: null,
      loading: false,
      error: null,
      title: '',
      description: '',
      status: '',
      priority: ''
    };
  }

  componentDidMount() {
    this.fetchTicket();
  }

  fetchTicket = async () => {
    const { id } = this.props.params;
    this.setState({ loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/getById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.auth.token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        this.setState({ error: data.message || "Error fetching ticket" });
      } else {
        this.setState({
          ticket: data.data,
          title: data.data.title,
          description: data.data.description,
          status: data.data.status,
          priority: data.data.priority || "",
        });
      }
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id } = this.props.params;
    const { title, description, status, priority } = this.state;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/update/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.auth.token}`,
          },
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Error updating ticket");
      } else {
        toast.success("Ticket updated successfully");
        this.props.navigate("/adminDashboard");
      }
    } catch (err) {
      toast.error("Error updating ticket: " + err.message);
    }
  };

  handleBack = () => {
    this.props.navigate("/adminDashboard");
  };

  render() {
    const { ticket, loading, error, title, description, status, priority } = this.state;
    const { isDarkMode } = this.props;

    if (loading) {
      return <Loading text="Loading ticket details..." isDarkMode={isDarkMode} />;
    }
    if (error) {
      return <p className="p-8">Error: {error}</p>;
    }
    if (!ticket) {
      return <p className="p-8">No ticket found.</p>;
    }

    // Animation variants for smooth entrance
    const formVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <div
        className={`p-4 md:p-8 min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Button
          variant="outline"
          onClick={this.handleBack}
          className={`${isDarkMode ? "text-black border-gray-300" : "text-gray-700"} mr-2 mb-4`}
        >
          Back
        </Button>
        <InView triggerOnce threshold={0.2}>
          {({ inView, ref }) => (
            <motion.div
              ref={ref}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={formVariants}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className={`${isDarkMode ? "text-white" : "text-gray-900"} text-2xl font-bold`}>
                    Update Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={this.handleSubmit} className="space-y-4">
                    <div>
                      <label className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => this.setState({ title: e.target.value })}
                        className={`w-full mt-1 p-2 border rounded ${
                          isDarkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => this.setState({ description: e.target.value })}
                        className={`w-full mt-1 p-2 border rounded ${
                          isDarkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                        required
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => this.setState({ status: e.target.value })}
                          className={`w-full mt-1 p-2 border rounded ${
                            isDarkMode
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-gray-100 text-gray-900 border-gray-300"
                          }`}
                          required
                        >
                          <option value="open">Open</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} font-medium`}>
                          Priority
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => this.setState({ priority: e.target.value })}
                          className={`w-full mt-1 p-2 border rounded ${
                            isDarkMode
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-gray-100 text-gray-900 border-gray-300"
                          }`}
                        >
                          <option value="">Select Priority</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="outline"
                        className={`${isDarkMode ? "text-black border-gray-300" : "text-gray-700"} mr-2`}
                      >
                        Update Ticket
                      </Button>
                      <Button
                        variant="outline"
                        onClick={this.handleBack}
                        className={`${isDarkMode ? "text-black border-gray-300" : "text-gray-700"} mr-2`}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
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

export default connect(mapStateToProps)(withRouter(UpdateTicket));
