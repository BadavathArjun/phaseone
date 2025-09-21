import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Messaging from '../components/Messaging';
import './Messages.css';

const Messages = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for demonstration
    const mockChats = [
      {
        id: 1,
        otherUser: {
          name: 'Sarah Johnson',
          role: 'influencer',
          avatar: 'SJ',
          online: true
        },
        lastMessage: 'Looking forward to working together!',
        timestamp: '2 hours ago',
        unread: 3
      },
      {
        id: 2,
        otherUser: {
          name: 'Nike Marketing',
          role: 'brand',
          avatar: 'NM',
          online: false
        },
        lastMessage: 'Campaign details are ready for review.',
        timestamp: 'Yesterday',
        unread: 0
      },
      {
        id: 3,
        otherUser: {
          name: 'Alex Rivera',
          role: 'influencer',
          avatar: 'AR',
          online: true
        },
        lastMessage: 'Thanks for the opportunity!',
        timestamp: '2 days ago',
        unread: 1
      },
      {
        id: 4,
        otherUser: {
          name: 'Coca-Cola Brand',
          role: 'brand',
          avatar: 'CC',
          online: false
        },
        lastMessage: 'Let me know your availability for a call',
        timestamp: '1 week ago',
        unread: 0
      },
    ];
    setChats(mockChats);
    setLoading(false);
  }, []);

  // Filter chats based on search term
  const filteredChats = chats.filter(chat =>
    chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="messages-page">
        <div className="messages-container">
          <div className="messages-loading">
            <div className="messages-loading-skeleton messages-title"></div>
            <div className="messages-loading">
              <div className="messages-loading-skeleton messages-chat-list"></div>
              <div className="messages-loading-skeleton messages-chat-area"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <h1 className="messages-title">Messages</h1>
          <p className="messages-subtitle">Connect and collaborate with brands and influencers</p>
        </div>

        <div className="messages-layout">
          {/* Chat List */}
          <div className="messages-chat-list">
            <div className="messages-chat-list-header">
              <div className="messages-search-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="messages-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="messages-search-input"
                />
              </div>
            </div>

            <div className="messages-chat-list-content">
              {filteredChats.length === 0 ? (
                <div className="messages-chat-list-empty">
                  <svg xmlns="http://www.w3.org/2000/svg" className="messages-chat-list-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="messages-chat-list-empty-text">No conversations found</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`messages-chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                  >
                    <div className="messages-chat-item-content">
                      <div className="messages-chat-avatar">
                        <div className={`messages-chat-avatar-circle ${chat.otherUser.role === 'influencer' ? 'messages-avatar-influencer' : 'messages-avatar-brand'}`}>
                          {chat.otherUser.avatar}
                        </div>
                        {chat.otherUser.online && (
                          <div className="messages-chat-online-indicator"></div>
                        )}
                      </div>

                      <div className="messages-chat-details">
                        <div className="messages-chat-header">
                          <p className="messages-chat-name">
                            {chat.otherUser.name}
                          </p>
                          <span className="messages-chat-time">
                            {chat.timestamp}
                          </span>
                        </div>

                        <div className="messages-chat-message">
                          <p className="messages-chat-last-message">
                            {chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="messages-chat-unread">
                              {chat.unread}
                            </span>
                          )}
                        </div>

                        <div className="messages-chat-role">
                          <span className={`messages-chat-role-badge ${chat.otherUser.role}`}>
                            {chat.otherUser.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="messages-chat-area">
            {selectedChat ? (
              <Messaging chatId={selectedChat.id} otherUser={selectedChat.otherUser} />
            ) : (
              <div className="messages-chat-placeholder">
                <div className="messages-chat-placeholder-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="messages-chat-placeholder-title">Select a conversation</h3>
                <p className="messages-chat-placeholder-text">Choose a chat from the list to start messaging</p>
                <div className="messages-chat-placeholder-description">
                  <p>Connect with brands and influencers to discuss collaborations</p>
                  <p>and build meaningful partnerships.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
