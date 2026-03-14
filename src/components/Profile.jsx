import { User, MapPin, Heart, Code } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Profile Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-xl">
          <User className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Your Name
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          한 줄 소개를 입력하세요
        </p>
      </div>

      {/* Info Cards */}
      <div className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            기본 정보
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="font-medium">나이:</span> ?
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">위치:</span> ?
            </li>
          </ul>
        </div>

        {/* Tech Stack Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            기술 스택
          </h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'JavaScript', 'HTML', 'CSS'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hobbies Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            취미
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• 취미 1</li>
            <li>• 취미 2</li>
            <li>• 취미 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
