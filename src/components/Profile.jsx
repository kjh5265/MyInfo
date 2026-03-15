import { User, MapPin, Heart, Mail, ExternalLink } from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-3xl">
        {/* Profile Header - Centered */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            {/* 프로필 사진 영역 - 나중에 사진 추가 가능 */}
            <div className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/50 overflow-hidden">
              <User className="w-20 h-20 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4 tracking-tight">
            김재현
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
            개발자를 꿈꾸는的大学生
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-6">
            <a href="mailto:kjhkjh5265@naver.com" className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a href="#" className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
                    <MapPin className="w-4 h-4" />사는곳
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
                  <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  취미
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['유튜브', '넷플릭스', '영화', '탁구'].map((hobby) => (
                  <div key={hobby} className="p-4 text-center rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{hobby}</span>
                  </div>
                ))}
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
