// src/components/layout/SellerLayout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const SellerLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6 bg-white/70 backdrop-blur-xl rounded-tl-3xl shadow-lg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
