import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpAsync } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    invitationCode: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For admin sign up, invitation code is required.
    if (formData.role === 'admin' && !formData.invitationCode) {
      alert('Invitation code is required for admin signup.');
      return;
    }
    try {
      const resultAction = await dispatch(signUpAsync(formData));
      if (signUpAsync.fulfilled.match(resultAction)) {
        const role = resultAction.payload.user.role;
        if (role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/userdashboard');
        }
      }
    } catch (err) {
      console.error('Failed to sign up: ', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <div className="mb-4">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
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
          <label className="block mb-1">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {formData.role === 'admin' && (
          <div className="mb-4">
            <label className="block mb-1">Invitation Code:</label>
            <input
              type="text"
              name="invitationCode"
              value={formData.invitationCode}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        )}
        {auth.error && <p className="text-red-500 mb-2">{auth.error}</p>}
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
