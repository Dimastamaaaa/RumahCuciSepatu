import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppShell.css';

export default function AppShell() {
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-col">
        <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
