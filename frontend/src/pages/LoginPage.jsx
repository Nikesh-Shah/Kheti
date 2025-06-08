import React, { useState } from 'react';
import { loginUser } from '../api/api';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onSwitch }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberMe = e => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(form);
      // Store token in localStorage if rememberMe, else in sessionStorage
      if (rememberMe) {
        localStorage.setItem('token', res.data.token);
      } else {
        sessionStorage.setItem('token', res.data.token);
      }

      const role = res.data.user?.role;
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-bg">
      <AuthForm
        title="Welcome to Kheti"
        fields={[
          { label: 'Email', name: 'email', type: 'email', value: form.email, onChange: handleChange },
          { label: 'Password', name: 'password', type: 'password', value: form.password, onChange: handleChange },
          {
            label: '',
            name: 'rememberMe',
            type: 'checkbox',
            value: rememberMe,
            onChange: handleRememberMe,
            render: () => (
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                  style={{ marginRight: 4 }}
                />
                Remember Me
              </label>
            )
          }
        ]}
        onSubmit={handleSubmit}
        submitText="Login"
        switchText="Don't have an account?"
        onSwitch={onSwitch}
        error={error}
      />
    </div>
  );
};

export default LoginPage;