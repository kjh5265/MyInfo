import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const mmdd = String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
    
    if (password === mmdd) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              비밀번호
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              maxLength={4}
              className="w-full px-6 py-4 text-center text-2xl font-bold bg-gray-100 dark:bg-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 text-gray-800 dark:text-white"
            />
            
            {error && (
              <p className="text-red-500 text-center mt-4">
                비밀번호가 올바르지 않습니다
              </p>
            )}
            
            <button
              type="submit"
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
