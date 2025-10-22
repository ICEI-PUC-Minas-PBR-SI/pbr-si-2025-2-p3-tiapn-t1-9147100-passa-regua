import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyCodePage from './pages/VerifyCodePage';
import ManageGroupPage from './pages/ManageGroupPage';

/**
 * The root component for Passa Régua's authentication flow.
 *
 * It defines all routes used in the login and registration process. When
 * additional processes are implemented (e.g. group management), new routes
 * should be added here.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
      <Route path="/manage-group" element={<ManageGroupPage />} />
      {/* A fallback route for undefined URLs */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
