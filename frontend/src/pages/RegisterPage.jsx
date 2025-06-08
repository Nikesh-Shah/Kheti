import React, { useState } from 'react';
import { registerUser } from '../api/api';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await registerUser({ ...form, role: 'user' });
      alert('Registration successful! Please login.');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: ''
      });
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-bg">
      <AuthForm
        title="Join Kheti"
        fields={[
          { label: 'First Name', name: 'firstName', type: 'text', value: form.firstName, onChange: handleChange },
          { label: 'Last Name', name: 'lastName', type: 'text', value: form.lastName, onChange: handleChange },
          { label: 'Email', name: 'email', type: 'email', value: form.email, onChange: handleChange },
          { label: 'Password', name: 'password', type: 'password', value: form.password, onChange: handleChange },
          { label: 'Phone Number', name: 'phoneNumber', type: 'tel', value: form.phoneNumber, onChange: handleChange, pattern: '\\d{10}', title: 'Enter a 10-digit phone number' }
        ]}
        onSubmit={handleSubmit}
        submitText="Register"
        switchText="Already have an account?"
        onSwitch={() => window.location.href = '/login'}
        error={error}
      />
    </div>
  );
};

export default RegisterPage;