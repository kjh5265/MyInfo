import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
  getDocs,
  updateDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { Send, X, Trash2, User, ArrowLeft } from 'lucide-react';

const ADMIN_PASSWORD = "5265";

export default function CommentSection({ isAdmin: initialAdmin = false }) {
  const [comments, setComments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null); // { userId, authorName }
  const [newComment, setNewComment] = useState("");
  const [isAdmin, setIsAdmin] = useState(initialAdmin);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const chatEndRef = useRef(null);
  const messagesUnsubRef = useRef(null);
  const conversationsUnsubRef = useRef(null);

  useEffect(() => {
    setIsAdmin(initialAdmin);
  }, [initialAdmin]);

  const getUserId = () => {
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatUserId', userId);
    }
    return userId;
  };

  const getNickname = () => localStorage.getItem('chatNickname') || '';

  // Rate limiting
  const canSendMessage = () => {
    const userId = getUserId();
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const messageHistory = JSON.parse(localStorage.getItem('messageHistory') || '{}');
    const userHistory = messageHistory[userId] || [];

    if (userHistory.filter(t => t > fiveMinutesAgo).length >= 20) {
      alert('5분 내에 너무 많은 메시지를 보냈습니다. 나중에 다시 시도해주세요.');
      return false;
    }
    if (userHistory.filter(t => t > oneDayAgo).length >= 100) {
      alert('오늘 이미 100개의 메시지를 보냈습니다. 내일 다시 이용해주세요.');
      return false;
    }
    return true;
  };

  const saveMessageTimestamp = () => {
    const userId = getUserId();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const messageHistory = JSON.parse(localStorage.getItem('messageHistory') || '{}');
    let userHistory = (messageHistory[userId] || []).filter(t => t > oneDayAgo);
    userHistory.push(now);
    messageHistory[userId] = userHistory;
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
  };

  // Subscribe to messages for a specific conversation
  const subscribeToMessages = (userId) => {
    if (messagesUnsubRef.current) messagesUnsubRef.current();

    const q = query(
      collection(db, 'chats', userId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    messagesUnsubRef.current = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.disabled !== true);
      setComments(loaded);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  };

  // Subscribe to all conversations (admin list view)
  const subscribeToConversations = () => {
    if (conversationsUnsubRef.current) conversationsUnsubRef.current();

    const q = query(
      collection(db, 'conversations'),
      orderBy('lastMessageAt', 'desc')
    );

    conversationsUnsubRef.current = onSnapshot(q, (snapshot) => {
      setConversations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  };

  useEffect(() => {
    if (!showChatModal) {
      if (messagesUnsubRef.current) messagesUnsubRef.current();
      if (conversationsUnsubRef.current) conversationsUnsubRef.current();
      return;
    }

    if (isAdmin) {
      subscribeToConversations();
    } else {
      subscribeToMessages(getUserId());
    }

    return () => {
      if (messagesUnsubRef.current) messagesUnsubRef.current();
      if (conversationsUnsubRef.current) conversationsUnsubRef.current();
    };
  }, [showChatModal, isAdmin]);

  // When admin selects a conversation
  useEffect(() => {
    if (isAdmin && activeConversation) {
      subscribeToMessages(activeConversation.userId);
    }
  }, [activeConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (newComment.trim().length > 20) {
      alert('메시지는 20자 이하로 입력해주세요.');
      return;
    }
    if (!isAdmin && !canSendMessage()) return;

    const userId = getUserId();
    const nickname = getNickname();
    const targetUserId = isAdmin ? activeConversation?.userId : userId;
    if (!targetUserId) return;

    const authorName = isAdmin ? '재현' : (nickname || '사용자');
    const now = new Date().toISOString();

    await addDoc(collection(db, 'chats', targetUserId, 'messages'), {
      content: newComment.trim(),
      userId: isAdmin ? 'admin' : userId,
      authorName,
      isAdmin,
      disabled: false,
      createdAt: now
    });

    // Update conversation metadata
    await setDoc(doc(db, 'conversations', targetUserId), {
      authorName: isAdmin ? activeConversation.authorName : authorName,
      lastMessage: newComment.trim(),
      lastMessageAt: now,
      userId: targetUserId
    }, { merge: true });

    if (!isAdmin) saveMessageTimestamp();
    setNewComment("");

    // Telegram notification (non-admin only)
    if (!isAdmin) {
      const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN;
      const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      if (TELEGRAM_TOKEN && CHAT_ID) {
        try {
          await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: `💬 새 메시지!\n\n작성자: ${authorName}\n내용: ${newComment.trim()}`
            })
          });
        } catch (error) {
          console.log('Telegram notification failed:', error);
        }
      }
    }

    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

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

  const handleClearChat = async () => {
    if (!isAdmin || !activeConversation) return;
    if (confirm("이 대화를 비우시겠습니까?")) {
      try {
        const q = query(collection(db, 'chats', activeConversation.userId, 'messages'));
        const snapshot = await getDocs(q);
        await Promise.all(
          snapshot.docs.map(docRef =>
            updateDoc(doc(db, 'chats', activeConversation.userId, 'messages', docRef.id), { disabled: true })
          )
        );
        setComments([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
        alert('채팅 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDateLine = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === now.toDateString()) return '오늘';
    if (date.toDateString() === yesterday.toDateString()) return '어제';
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const needsDateLine = (comment, index) => {
    if (index === 0) return true;
    return new Date(comment.createdAt).toDateString() !== new Date(comments[index - 1].createdAt).toDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    if (date.toDateString() === new Date().toDateString()) return `${ampm} ${h}:${minutes}`;
    return `${date.getMonth() + 1}/${date.getDate()} ${ampm} ${h}:${minutes}`;
  };

  const showConversationList = isAdmin && !activeConversation;

  return (
    <>
      {/* Chat Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            if (isAdmin || getNickname()) setShowChatModal(true);
            else setShowNicknameModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
        >
          재현과 1:1 채팅하기
        </button>
      </div>

      {/* Nickname Modal */}
      {showNicknameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNicknameModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4" onClick={() => setShowNicknameModal(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">닉네임 설정</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">채팅에 사용될 닉네임을 입력하세요</p>
            <form onSubmit={handleNicknameSave}>
              <input
                type="text"
                value={nicknameInput}
                onChange={e => setNicknameInput(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={10}
                className="w-full px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              />
              <button type="submit" className="w-full py-2 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors">
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
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-2">
                {isAdmin && activeConversation && (
                  <button
                    onClick={() => { setActiveConversation(null); setComments([]); }}
                    className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {isAdmin ? (activeConversation ? activeConversation.authorName : '채팅 목록') : '채팅'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && activeConversation && (
                  <button
                    onClick={handleClearChat}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="대화 비우기"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                {!isAdmin && (
                  <button
                    onClick={() => { setShowChatModal(false); setShowNicknameModal(true); }}
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

            {/* Admin: Conversation List */}
            {showConversationList && (
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 mt-10">아직 채팅이 없습니다</p>
                ) : (
                  conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation({ userId: conv.userId || conv.id, authorName: conv.authorName })}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 text-left transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white text-sm">{conv.authorName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                        {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ''}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Message View (user always, admin when conversation selected) */}
            {!showConversationList && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-10">아직 채팅이 없습니다</p>
                  ) : (
                    <>
                      {comments.map((comment, index) => {
                        const isRight = isAdmin ? comment.isAdmin : !comment.isAdmin;
                        return (
                          <div key={comment.id}>
                            {needsDateLine(comment, index) && (
                              <div className="flex items-center justify-center my-4">
                                <div className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300">
                                  {formatDateLine(comment.createdAt)}
                                </div>
                              </div>
                            )}
                            <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] p-3 rounded-2xl ${
                                comment.isAdmin
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                              }`}>
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

                <form onSubmit={handleSubmit} className="flex-shrink-0 p-3 sm:p-4 border-t dark:border-gray-700">
                  <div className="flex gap-2 items-center">
                    <input
                      value={newComment}
                      onChange={e => { if (e.target.value.length <= 20) setNewComment(e.target.value); }}
                      placeholder={isAdmin ? "재현님 채팅 입력..." : "채팅 입력..."}
                      className="flex-1 px-3 sm:px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{newComment.length}/20</span>
                    <button type="submit" className="p-2 sm:p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors flex-shrink-0">
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowAdminLogin(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4" onClick={() => setShowAdminLogin(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">관리자 로그인</h4>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              />
              <button type="submit" className="w-full py-2 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors">
                확인
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export const openAdminLogin = () => {
  window.dispatchEvent(new CustomEvent('openAdminLogin'));
};
