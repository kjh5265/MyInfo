import { useState, useEffect } from 'react'
import Profile from './components/Profile'
import DarkModeToggle from './components/DarkModeToggle'
// import LockScreen from './components/LockScreen'

function App() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const ADMIN_PASSWORD = "5265";

  // Check admin status on load
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Listen for admin login event
  useEffect(() => {
    const handleOpenAdminLogin = () => {
      setShowAdminLogin(true);
    };
    window.addEventListener('openAdminLogin', handleOpenAdminLogin);
    return () => window.removeEventListener('openAdminLogin', handleOpenAdminLogin);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setPasswordInput("");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  // Pass admin status to Profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Header with DarkModeToggle and Admin - Fixed on desktop, absolute on mobile */}
      <div className="absolute sm:fixed top-0 right-0 left-0 z-50 flex justify-end items-center gap-2 sm:gap-3 p-3 sm:p-4">
        {/* Admin Login Button - shown when not admin */}
        {!isAdmin && (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            title="관리자 로그인"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        )}
        
        {/* Admin Status - shown when admin */}
        {isAdmin && (
          <span className="text-sm text-purple-500 font-medium">
            재현님 안녕하세요
          </span>
        )}
        
        <DarkModeToggle />
        
        {/* Logout Button - shown when admin */}
        {isAdmin && (
          <button
            onClick={handleAdminLogout}
            className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 shadow-md hover:shadow-lg transition-all"
            title="로그아웃"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600 dark:text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowAdminLogin(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4"
              onClick={() => setShowAdminLogin(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">관리자 로그인</h4>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              />
              <button 
                type="submit"
                className="w-full py-2 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors"
              >
                확인
              </button>
            </form>
          </div>
        </div>
      )}

      <Profile isAdmin={isAdmin} />
    </div>
  )
}

export default App
