import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (isSignup) {
      // Signup flow
      try {
        const res = await fetch('https://agrosense-server.vercel.app/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, firstName, lastName, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        // After signup, try login automatically
        const loginRes = await fetch('https://agrosense-server.vercel.app/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message || 'Login after signup failed');
  login(loginData.user, loginData.token);
  navigate('/');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Login flow
      try {
        const res = await fetch('https://agrosense-server.vercel.app/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
  login(data.user, data.token);
  navigate('/');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return isSignup ? (
    <div className="bg-[#101613] px-2 py-10 flex justify-center items-center min-h-screen">
      <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-4 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-green-900">
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 text-green-200">Sign up</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">Username</label>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="p-2 border border-green-800 bg-green-950 text-green-100 rounded-md"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="p-2 border border-green-800 bg-green-950 text-green-100 rounded-md w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="p-2 border border-green-800 bg-green-950 text-green-100 rounded-md w-full"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">Email</label>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-2 border w-full border-green-800 bg-green-950 text-green-100 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">Password</label>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-2 border border-green-800 bg-green-950 text-green-100 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-tr from-green-800 to-green-700 text-green-50 p-2 rounded-md hover:bg-green-700 hover:text-green-200 transition duration-300 border border-green-900 shadow"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          <p
            onClick={() => { setIsSignup(false); setError(''); }}
            className="text-green-400 cursor-pointer hover:underline text-center"
          >
            Already have an account? Login
          </p>
          {error && <div className='text-green-400 mt-2 text-sm sm:text-base md:text-lg'>{error}</div>}
        </form>
      </div>
    </div>
  ) : (
    <div className="bg-[#101613] px-2 py-10 flex justify-center items-center min-h-screen">
      <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-4 sm:p-10 rounded-xl shadow-lg w-full max-w-md border border-green-900">
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 text-green-200">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">Username</label>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="p-2 border border-green-800 bg-green-950 text-green-100 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium text-base sm:text-lg md:text-xl text-green-300">Password</label>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-2 border border-green-800 bg-green-950 text-green-100 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-tr from-green-800 to-green-700 text-green-50 p-2 rounded-md hover:bg-green-700 hover:text-green-200 transition duration-300 border border-green-900 shadow"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p
            onClick={() => { setIsSignup(true); setError(''); }}
            className="text-green-400 cursor-pointer hover:underline text-center"
          >
            Don't have an account? Sign Up
          </p>
          {error && <div className='text-green-400 mt-2 text-sm sm:text-base md:text-lg'>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;