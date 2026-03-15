import { User, MapPin, Heart, Mail, ExternalLink, Play, Tv, Film, Sparkles, Dumbbell } from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-3xl">
        {/* Profile Header - Centered */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            {/* 프로필 사진 */}
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/50">
              <img src="/myPic.jpg" alt="프로필" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4 tracking-tight">
            김재현
          </h1>
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-6">
            <a href="mailto:kjhkjh5265@naver.com" className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a href="https://instagram.com/jaehyynn" className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Info Cards - Grid Layout */}
        <div className="grid gap-6">
          {/* Basic Info Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  기본 정보
                </h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">나이</span>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">95년생</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">위치</span>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                    <MapPin className="w-4 h-4" />사당
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">MBTI</span>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">INTJ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hobbies Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                  <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  취미
                </h2>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 flex flex-col items-center rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer">
                  <Play className="w-6 h-6 mb-2 text-pink-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">유튜브</span>
                </div>
                <div className="p-4 flex flex-col items-center rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer">
                  <Tv className="w-6 h-6 mb-2 text-pink-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">넷플릭스</span>
                </div>
                <div className="p-4 flex flex-col items-center rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer">
                  <Film className="w-6 h-6 mb-2 text-pink-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">영화</span>
                </div>
                <div className="p-4 flex flex-col items-center rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer">
                  <Dumbbell className="w-6 h-6 mb-2 text-pink-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">탁구</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 dark:text-gray-500 mt-16 text-sm">
          © 2026 MyInfo. All rights reserved.
        </p>
      </div>
    </div>
  );
}
