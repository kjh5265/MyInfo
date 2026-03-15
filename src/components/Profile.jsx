function Profile() {
  return (
    <div className="max-w-2xl mx-auto pt-20 px-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full p-1">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-8 px-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            김재현
          </h1>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              📍 사당
            </span>
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
              INTJ
            </span>
          </div>

          {/* Contact */}
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="mailto:kjhkjh5265@naver.com"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span>✉️</span>
              <span>kjhkjh5265@naver.com</span>
            </a>
            <a 
              href="https://instagram.com/jaehyyunn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span>📷</span>
              <span>@jaehyyunn</span>
            </a>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              🎯 관심
            </h2>
            <div className="flex flex-wrap gap-2">
              {['유튜브', '넷플릭스', '영화', '탁구', '게임', '강아지', '일본'].map((interest, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Food */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              🍽️ 음식
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">좋아하는 음식</span>
                  <p className="text-gray-700 dark:text-gray-200">고기, 회</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">안 먹는 음식</span>
                  <p className="text-gray-700 dark:text-gray-200">해삼, 멍게류</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
