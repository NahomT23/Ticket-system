import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

class ProtectedRoute extends Component {
  render() {
    const { auth, requiredRole, children } = this.props;
    
    // If not logged in, redirect to sign in
    if (!auth.user) {
      return <Navigate to="/signin" />;
    }
    
    // If a role is required and the user's role doesn't match, redirect to homepage
    if (requiredRole && auth.user.role !== requiredRole) {
      return <Navigate to="/" />;
    }
    
    return children;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProtectedRoute);
