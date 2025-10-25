// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyCodePage from './pages/VerifyCodePage';
import ManageGroupPage from './pages/ManageGroupPage';

import ProfilePage from './pages/ProfilePage';
import CreateGroupPage from './pages/CreateGroupPage';
import InviteMembersPage from './pages/InviteMembersPage';
import InviteAcceptPage from './pages/InviteAcceptPage';
import EditGroupPage from './pages/EditGroupPage'; // <-- NOVO
import NotificationsPage from './pages/NotificationsPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />

      {/* perfil + grupos */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/create-group" element={<CreateGroupPage />} />
      <Route path="/invite-members" element={<InviteMembersPage />} />
      <Route path="/invite/:inviteId" element={<InviteAcceptPage />} />
      <Route path="/groups/:id/edit" element={<EditGroupPage />} /> {/* <-- NOVA ROTA */}
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* se você já usa essa tela */}
      <Route path="/manage-group" element={<ManageGroupPage />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
