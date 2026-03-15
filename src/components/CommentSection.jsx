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
  getDocs,
  updateDoc
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

  // Rate limiting: Check if user can send message
  const canSendMessage = () => {
    const userId = getUserId();
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000; // 5분 전
    const oneDayAgo = now - 24 * 60 * 60 * 1000; // 1일 전
    
    // Get message history from localStorage
    const messageHistory = JSON.parse(localStorage.getItem('messageHistory') || '{}');
    const userHistory = messageHistory[userId] || [];
    
    // Filter messages from last 5 minutes
    const recentMessages = userHistory.filter(t => t > fiveMinutesAgo);
    
    // Filter messages from last 24 hours (for daily limit)
    const todayMessages = userHistory.filter(t => t > oneDayAgo);
    
    // Check 5분 20개 제한
    if (recentMessages.length >= 20) {
      alert('5분 내에 너무 많은 메시지를 보냈습니다. 나중에 다시 시도해주세요.');
      return false;
    }
    
    // Check 하루 100개 제한
    if (todayMessages.length >= 100) {
      alert('오늘 이미 100개의 메시지를 보냈습니다. 내일 다시 이용해주세요.');
      return false;
    }
    
    return true;
  };

  // Save message timestamp
  const saveMessageTimestamp = () => {
    const userId = getUserId();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    const messageHistory = JSON.parse(localStorage.getItem('messageHistory') || '{}');
    let userHistory = messageHistory[userId] || [];
    
    // Keep only last 24 hours of history
    userHistory = userHistory.filter(t => t > oneDayAgo);
    userHistory.push(now);
    
    messageHistory[userId] = userHistory;
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
  };

  // Load comments from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'comments', 'food', 'items'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(comment => comment.disabled !== true); // Filter out disabled comments
      
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

    // Check message length (max 20 characters)
    if (newComment.trim().length > 20) {
      alert('메시지는 20자 이하로 입력해주세요.');
      return;
    }

    // Check rate limit (skip for admin)
    if (!isAdmin && !canSendMessage()) return;

    const userId = getUserId();
    const nickname = getNickname();
    const authorNum = getAuthorCount(userId);
    const authorName = isAdmin ? '재현' : (nickname || `작성자${authorNum}`);

    await addDoc(collection(db, 'comments', 'food', 'items'), {
      content: newComment.trim(),
      userId: userId,
      authorName: authorName,
      isAdmin: isAdmin,
      disabled: false,
      createdAt: new Date().toISOString()
    });

    // Save timestamp for rate limiting (skip for admin)
    if (!isAdmin) {
      saveMessageTimestamp();
    }

    setNewComment("");
    
    // Send Telegram notification (only for non-admin messages)
    if (!isAdmin) {
      const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN;
      const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      
      if (TELEGRAM_TOKEN && CHAT_ID) {
        const message = `💬 새 메시지!\n\n작성자: ${authorName}\n내용: ${newComment.trim()}`;
        
        try {
          await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message,
            })
          });
        } catch (error) {
          console.log('Telegram notification failed:', error);
        }
      }
    }
    
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
    const trimmedNickname = nicknameInput.trim();
    
    if (trimmedNickname === '재현') {
      alert("'재현'은 사용할 수 없는 닉네임입니다.");
      return;
    }
    
    if (trimmedNickname) {
      localStorage.setItem('chatNickname', trimmedNickname);
      setShowNicknameModal(false);
      setShowChatModal(true);
      setNicknameInput("");
    }
  };

  // Clear chat (admin only) - disable messages in Firestore (keep data)
  const handleClearChat = async () => {
    if (!isAdmin) return;
    
    if (confirm("채팅창을 비우시겠습니까?")) {
      try {
        const q = query(collection(db, 'comments', 'food', 'items'));
        const snapshot = await getDocs(q);
        
        // Disable all messages instead of deleting
        const disablePromises = snapshot.docs.map(docRef => 
          updateDoc(doc(db, 'comments', 'food', 'items', docRef.id), { disabled: true })
        );
        await Promise.all(disablePromises);
        
        setComments([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
        alert('채팅 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // Format date for date line (KakaoTalk style)
  const formatDateLine = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = date.toDateString();
    
    if (dateOnly === now.toDateString()) {
      return '오늘';
    } else if (dateOnly === yesterday.toDateString()) {
      return '어제';
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일`;
    }
  };

  // Check if date line is needed (different from previous message)
  const needsDateLine = (currentComment, index) => {
    if (index === 0) return true;
    const prevComment = comments[index - 1];
    const currentDate = new Date(currentComment.createdAt).toDateString();
    const prevDate = new Date(prevComment.createdAt).toDateString();
    return currentDate !== prevDate;
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
          재현과 채팅하기
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setShowChatModal(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md h-[80vh] sm:h-[70vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b dark:border-gray-700">
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
                {!isAdmin && (
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
                )}
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
                  {comments.map((comment, index) => {
                    // 내 채팅인지 확인 (userId가 같거나 admin인 경우)
                    const isMyMessage = (comment.userId === getUserId()) || (comment.isAdmin && isAdmin);
                    
                    // 사용자일 때: 재현(admin) 왼쪽, 다른 사용자들(나 포함) 오른쪽
                    // 관리자일 때: 재현(admin) 오른쪽, 다른 사용자들 왼쪽
                    const isRight = isAdmin 
                      ? comment.isAdmin  // 관리자: 내 메시지는 오른쪽
                      : !comment.isAdmin; // 사용자: 내 메시지는 오른쪽, 재현 왼쪽
                    
                    return (
                      <div key={comment.id}>
                        {/* Date Line - KakaoTalk style */}
                        {needsDateLine(comment, index) && (
                          <div className="flex items-center justify-center my-4">
                            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300">
                              {formatDateLine(comment.createdAt)}
                            </div>
                          </div>
                        )}
                        
                        <div 
                          className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
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
                            <p className={`text-xs mt-1 opacity-50 ${isRight ? 'text-right' : ''}`}>
                              {formatTime(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex-shrink-0 p-3 sm:p-4 border-t dark:border-gray-700">
              <div className="flex gap-2 items-center">
                <input
                  value={newComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 20) {
                      setNewComment(e.target.value);
                    }
                  }}
                  placeholder={isAdmin ? "재현님 채팅 입력..." : "채팅 입력..."}
                  className="flex-1 px-3 sm:px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {newComment.length}/20
                </span>
                <button
                  type="submit"
                  className="p-2 sm:p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
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
