import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInAsync } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    invitationCode: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(signInAsync(formData));
      if (signInAsync.fulfilled.match(resultAction)) {
        // Redirect based on the returned user role
        const role = resultAction.payload.user.role;
        if (role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/userdashboard');
        }
      }
    } catch (err) {
      console.error('Failed to sign in: ', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Sign In</h2>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Invitation Code (optional):</label>
          <input
            type="text"
            name="invitationCode"
            value={formData.invitationCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {auth.error && <p className="text-red-500 mb-2">{auth.error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
