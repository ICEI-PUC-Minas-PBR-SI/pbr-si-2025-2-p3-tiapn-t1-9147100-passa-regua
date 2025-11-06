// src/App.jsx
import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ManageGroupPage from './pages/ManageGroupPage';
import RegisterPage from './pages/RegisterPage';
import VerifyCodePage from './pages/VerifyCodePage';

import CreateGroupPage from './pages/CreateGroupPage';
import EditGroupPage from './pages/EditGroupPage'; // <-- NOVO
import IncluirDespesa from './pages/IncluirDespesas.jsx';
import InviteAcceptPage from './pages/InviteAcceptPage';
import InviteMembersPage from './pages/InviteMembersPage';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage';

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

      <Route path="/incluir-despesa/:id" element={<IncluirDespesa />} />

      {/* se você já usa essa tela */}
      <Route path="/manage-group" element={<ManageGroupPage />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
