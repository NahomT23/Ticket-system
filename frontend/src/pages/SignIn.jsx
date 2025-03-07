import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signInAsync } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function withRouter(Component) {
  return function ComponentWithRouterProp(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      invitationCode: '',
      loading: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const resultAction = await this.props.signInAsync({
        email: this.state.email,
        password: this.state.password,
        invitationCode: this.state.invitationCode,
      });
      if (signInAsync.fulfilled.match(resultAction)) {
        toast.success('Sign in successful!');
        const role = resultAction.payload.user.role;
        if (role === 'admin') {
          this.props.navigate('/admindashboard');
        } else {
          this.props.navigate('/userdashboard');
        }
      } else {
        toast.error(resultAction.error.message || 'Sign in failed');
      }
    } catch (err) {
      toast.error('Failed to sign in: ' + err.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { auth } = this.props;
    const { loading } = this.state;
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <form onSubmit={this.handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password:</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Invitation Code (optional):</label>
            <input
              type="text"
              name="invitationCode"
              value={this.state.invitationCode}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {auth.error && <p className="text-red-500 mb-4">{auth.error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded transition duration-200`}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  signInAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
