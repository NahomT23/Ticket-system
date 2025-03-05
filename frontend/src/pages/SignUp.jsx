import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signUpAsync } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';


function withRouter(Component) {
  return function ComponentWithRouterProp(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      role: 'user',
      invitationCode: '',
      loading: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRoleChange = (e) => {
    const value = e.target.value;
    this.setState({ role: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.state.role === 'admin' && !this.state.invitationCode) {
      alert('Invitation code is required for admin signup.');
      return;
    }
    this.setState({ loading: true });
    try {
      const resultAction = await this.props.signUpAsync({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        role: this.state.role,
        invitationCode: this.state.invitationCode,
      });
      if (signUpAsync.fulfilled.match(resultAction)) {
        const role = resultAction.payload.user.role;
        if (role === 'admin') {
          this.props.navigate('/admindashboard');
        } else {
          this.props.navigate('/userdashboard');
        }
      }
    } catch (err) {
      console.error('Failed to sign up: ', err);
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
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
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
            <label className="block mb-1 font-medium">Role:</label>
            <select
              name="role"
              value={this.state.role}
              onChange={this.handleRoleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {this.state.role === 'admin' && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Invitation Code:</label>
              <input
                type="text"
                name="invitationCode"
                value={this.state.invitationCode}
                onChange={this.handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          )}
          {auth.error && <p className="text-red-500 mb-4">{auth.error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded transition duration-200`}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
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
  signUpAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));
