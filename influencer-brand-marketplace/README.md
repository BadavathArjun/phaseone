# Influencer-Brand Marketplace

A full-stack web application that connects influencers with brands for marketing campaigns and collaborations. The platform enables brands to discover, connect, and work with influencers while providing influencers with opportunities to monetize their social media presence.

## 🚀 Features

- **User Authentication & Authorization** - Secure login/registration system
- **Influencer Discovery** - Search and filter influencers by niche, audience size, engagement rate
- **Campaign Management** - Create, manage, and track marketing campaigns
- **Real-time Messaging** - Chat system between brands and influencers
- **Profile Management** - Comprehensive profiles for both brands and influencers
- **Proposal System** - Submit and manage campaign proposals
- **Analytics Dashboard** - Track campaign performance and engagement metrics
- **Instagram Integration** - Connect and analyze Instagram accounts

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hook Form** - Performant forms with easy validation
- **Recharts** - Data visualization library
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Development Tools
- **ESLint** - JavaScript linting
- **Nodemon** - Development server auto-restart
- **Vite** - Frontend build tool

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd influencer-brand-marketplace
```

### 2. Install Dependencies

#### Install root dependencies (if any):
```bash
npm install
```

#### Install client dependencies:
```bash
cd client
npm install
cd ..
```

#### Install server dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the server directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/influencer-marketplace
JWT_SECRET=your-super-secret-jwt-key
PORT=4001
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB installation
mongod

# Or if using MongoDB Atlas, make sure your connection string is correct in .env
```

### 5. Run the Application

#### Option 1: Run both client and server separately

**Terminal 1 - Start the backend server:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:4001`

**Terminal 2 - Start the frontend client:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`

#### Option 2: Run with root scripts (if configured)

```bash
# Development mode
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4001

## 📁 Project Structure

```
influencer-brand-marketplace/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── contexts/      # React context providers
│   │   ├── api/           # API service functions
│   │   └── assets/        # Static assets
│   ├── public/            # Public static files
│   └── package.json
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API route handlers
│   ├── controllers/      # Request controllers
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   ├── config/           # Configuration files
│   └── package.json
├── package.json          # Root package configuration
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Client
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌟 Key Features Explained

### Authentication System
- JWT-based authentication
- Role-based access (Brand/Influencer)
- Secure password hashing with bcryptjs
- Protected routes and middleware

### Real-time Messaging
- Socket.io integration for instant messaging
- Chat rooms for campaign discussions
- Real-time notifications

### Campaign Management
- Create and manage marketing campaigns
- Proposal submission and approval system
- Campaign analytics and tracking

### Influencer Discovery
- Advanced search and filtering
- Profile verification system
- Social media integration (Instagram)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

The API documentation can be found at `http://localhost:4001` when the server is running, or refer to the route files in `server/routes/` for detailed endpoint information.

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**: Kill the process using the port or change the port in the configuration
2. **MongoDB connection failed**: Ensure MongoDB is running and the connection string is correct
3. **CORS errors**: Check that the frontend URL is allowed in the server CORS configuration
4. **Dependencies issues**: Clear node_modules and reinstall (`rm -rf node_modules && npm install`)

### Getting Help:

- Check the console for error messages
- Ensure all prerequisites are installed
- Verify environment variables are set correctly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, please contact the development team or create an issue in the repository.

---

**Happy coding! 🎉**
