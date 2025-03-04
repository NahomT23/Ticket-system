import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignIn() {
    this.props.navigate('/signin');
  }

  handleSignUp() {
    this.props.navigate('/signup');
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl mb-8">Welcome to Our App</h1>
        <div className="space-x-4">
          <button onClick={this.handleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded">
            Sign In
          </button>
          <button onClick={this.handleSignUp} className="px-4 py-2 bg-green-500 text-white rounded">
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

// Higher Order Component to pass navigate function to the class-based Home
export default function WithNavigation(props) {
  const navigate = useNavigate();
  return <Home {...props} navigate={navigate} />;
}
