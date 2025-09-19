import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../api/auth';
import { io } from 'socket.io-client';

export default function Messaging({ chatId, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join-chat', chatId);
      
      socket.on('receive-message', (data) => {
        setMessages(prev => [...prev, data]);
      });
    }
  }, [socket, chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatAPI.getMessages(chatId);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchMessages();
      
      // Set up polling for messages (fallback if WebSockets fail)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      timestamp: new Date(),
      sender: 'currentUser' // This would be the actual current user ID
    };

    // Optimistic UI update
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    try {
      if (socket) {
        socket.emit('send-message', {
          chatId,
          ...messageData
        });
      } else {
        // Fallback to HTTP if WebSocket is not available
        await chatAPI.sendMessage(chatId, newMessage);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Revert optimistic update on error
      setMessages(prev => prev.filter(msg => msg !== messageData));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-96 bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Chat with {otherUser?.name}</h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded ml-8"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white shadow rounded-lg">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Chat with {otherUser?.name}</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'currentUser'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'currentUser' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}