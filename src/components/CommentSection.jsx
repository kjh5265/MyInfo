import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  limit,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore';
import { MessageCircle, Send, X, Trash2, User } from 'lucide-react';

const ADMIN_PASSWORD = "5265";

export default function CommentSection({ isAdmin: initialAdmin = false }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAdmin, setIsAdmin] = useState(initialAdmin);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const chatEndRef = useRef(null);

  // Update isAdmin when prop changes
  useEffect(() => {
    setIsAdmin(initialAdmin);
  }, [initialAdmin]);

  // Get or create user ID and nickname from localStorage
  const getUserId = () => {
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatUserId', userId);
    }
    return userId;
  };

  const getNickname = () => {
    return localStorage.getItem('chatNickname') || '';
  };

  // Get unique author count
  const getAuthorCount = (userId) => {
    const uniqueIds = [...new Set(comments.map(c => c.userId))];
    return uniqueIds.indexOf(userId) + 1;
  };

  // Load comments from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'comments', 'food', 'items'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(loadedComments);
      
      // Scroll to bottom after loading
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, []);

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userId = getUserId();
    const nickname = getNickname();
    const authorNum = getAuthorCount(userId);

    await addDoc(collection(db, 'comments', 'food', 'items'), {
      content: newComment.trim(),
      userId: userId,
      authorName: isAdmin ? '재현' : (nickname || `작성자${authorNum}`),
      isAdmin: isAdmin,
      createdAt: new Date().toISOString()
    });

    setNewComment("");
    
    // Scroll to bottom after sending
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Admin login
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

  // Save nickname
  const handleNicknameSave = (e) => {
    e.preventDefault();
    if (nicknameInput.trim()) {
      localStorage.setItem('chatNickname', nicknameInput.trim());
      setShowNicknameModal(false);
      setNicknameInput("");
    }
  };

  // Clear chat (admin only)
  const handleClearChat = async () => {
    if (!isAdmin) return;
    
    if (confirm("채팅창의 모든 채팅을 삭제하시겠습니까?")) {
      const q = query(collection(db, 'comments', 'food', 'items'));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
    }
  };

  // Format date/time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    
    if (isToday) {
      return `${ampm} ${displayHours}:${minutes}`;
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day} ${ampm} ${displayHours}:${minutes}`;
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={() => {
            if (isAdmin || getNickname()) {
              setShowChatModal(true);
            } else {
              setShowNicknameModal(true);
            }
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          채팅하기
        </button>
      </div>

      {/* Nickname Modal */}
      {showNicknameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNicknameModal(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4"
              onClick={() => setShowNicknameModal(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">닉네임 설정</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">채팅에 사용될 닉네임을 입력하세요</p>
            <form onSubmit={handleNicknameSave}>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={10}
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

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowChatModal(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md h-[70vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">채팅</h3>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button 
                    onClick={handleClearChat}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="채팅창 비우기"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowChatModal(false);
                    setShowNicknameModal(true);
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="닉네임 변경"
                >
                  <User className="w-5 h-5" />
                </button>
                <button onClick={() => setShowChatModal(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Chat List - Latest at bottom, admin on right */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  아직 채팅이 없습니다
                </p>
              ) : (
                <>
                  {comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className={`flex ${comment.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          comment.isAdmin 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        <p className="text-xs font-medium mb-1 opacity-70">{comment.authorName}</p>
                        <p className="text-sm break-words">{comment.content}</p>
                        <p className={`text-xs mt-1 opacity-50 ${comment.isAdmin ? 'text-right' : ''}`}>
                          {formatTime(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={isAdmin ? "재현님 채팅 입력..." : "채팅 입력..."}
                  className="flex-1 px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <X className="w-5 h-5 text-gray-500" />
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
    </>
  );
}

// Export function to open admin login from outside
export const openAdminLogin = () => {
  window.dispatchEvent(new CustomEvent('openAdminLogin'));
};
