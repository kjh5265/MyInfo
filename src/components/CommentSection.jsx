import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  limit 
} from 'firebase/firestore';
import { MessageCircle, Send, X } from 'lucide-react';

const ADMIN_PASSWORD = "2024";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Get or create user ID from localStorage
  const getUserId = () => {
    let userId = localStorage.getItem('commentUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('commentUserId', userId);
    }
    return userId;
  };

  // Check admin status
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Get unique author count to determine author name
  const getAuthorCount = (userId) => {
    const uniqueIds = [...new Set(comments.map(c => c.userId))];
    return uniqueIds.indexOf(userId) + 1;
  };

  // Load comments from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'comments', 'food', 'items'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(loadedComments);
    });

    return () => unsubscribe();
  }, []);

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userId = getUserId();
    const authorNum = getAuthorCount(userId);

    await addDoc(collection(db, 'comments', 'food', 'items'), {
      content: newComment.trim(),
      userId: userId,
      authorName: isAdmin ? '관리자' : `작성자${authorNum}`,
      isAdmin: isAdmin,
      createdAt: new Date().toISOString()
    });

    setNewComment("");
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

  return (
    <>
      {/* Comment Button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={() => setShowCommentModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          댓글 보기
        </button>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCommentModal(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md h-[70vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">댓글</h3>
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <button 
                    onClick={() => setShowAdminLogin(true)}
                    className="text-sm text-purple-500 hover:underline"
                  >
                    관리자
                  </button>
                )}
                <button onClick={() => setShowCommentModal(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  아직 댓글이 없습니다
                </p>
              ) : (
                comments.slice(0, 5).map((comment) => (
                  <div 
                    key={comment.id}
                    className={`flex ${comment.isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        comment.isAdmin 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1 opacity-70">{comment.authorName}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
              {comments.length > 5 && (
                <p className="text-center text-sm text-gray-500">
                  +{comments.length - 5}개 더보기
                </p>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={isAdmin ? "관리자 댓글 입력..." : "댓글 입력..."}
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
