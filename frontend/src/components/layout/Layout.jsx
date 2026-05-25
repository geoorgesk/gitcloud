import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}