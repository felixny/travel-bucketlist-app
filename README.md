# Travel Bucket List & Info Hub

A full-stack web application for managing your travel bucket list with destination tracking, photo management, and travel planning features.

## Features

### Frontend (React + TypeScript)
- **User Authentication**: Sign up, login, and logout with Supabase
- **Destination Management**: Add, edit, delete, and view destinations
- **Image Upload**: Upload photos with AWS S3 integration
- **Search & Filter**: Find destinations by name, country, region, or category
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **External APIs**: Integration with Unsplash for destination images and REST Countries for country data

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for destinations
- **Authentication**: JWT-based authentication with Supabase
- **Image Storage**: AWS S3 integration with pre-signed URLs
- **External APIs**: Unsplash and REST Countries API integration
- **Input Validation**: Comprehensive validation and error handling
- **Security**: Rate limiting, CORS, and helmet middleware

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- React Hook Form with Yup validation
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript support
- Supabase for authentication and database
- AWS S3 for image storage
- External API integrations (Unsplash, REST Countries)
- Express middleware for security and validation

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS) enabled
- Optimized indexes for performance

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Supabase account** and project
4. **AWS account** with S3 bucket
5. **Unsplash API key** (optional, for destination images)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travel
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Environment Configuration

#### Backend Environment Variables

Create `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# External APIs
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Variables

Create `frontend/.env` file:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) is already configured in the schema

### 5. AWS S3 Setup

1. Create an S3 bucket
2. Configure CORS policy for your bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": []
    }
]
```

3. Create IAM user with S3 permissions
4. Add the credentials to your backend `.env` file

### 6. External APIs Setup

#### Unsplash API (Optional)
1. Create account at [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Get your access key and add it to backend `.env`

#### REST Countries API
- No API key required, free to use

## Running the Application

### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:

# Backend only
npm run server

# Frontend only
npm run client
```

### Production Mode

```bash
# Build frontend
npm run build

# Start backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### Destinations
- `GET /api/destinations` - Get all user destinations
- `GET /api/destinations/:id` - Get specific destination
- `POST /api/destinations` - Create new destination
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination
- `GET /api/destinations/search` - Search destinations

### Images
- `POST /api/images/presigned-url` - Get S3 pre-signed URL

### External APIs
- `GET /api/external/unsplash/:query` - Search Unsplash images
- `GET /api/external/countries` - Get all countries
- `GET /api/external/countries/:code` - Get specific country
- `GET /api/external/regions` - Get all regions

## Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Manual Deployment

1. **Backend Deployment**:
   - Deploy to platforms like Heroku, Railway, or AWS
   - Set environment variables
   - Ensure database connection

2. **Frontend Deployment**:
   - Build the React app: `npm run build`
   - Deploy to platforms like Vercel, Netlify, or AWS S3
   - Update API URLs for production

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

**Backend**:
- All variables from `backend/.env`
- `NODE_ENV=production`
- `FRONTEND_URL=https://yourdomain.com`

**Frontend**:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_URL=https://your-api-domain.com/api`

## Project Structure

```
travel/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── database/               # Database schema
│   └── schema.sql
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Changelog

### Version 1.0.0
- Initial release
- Complete CRUD operations for destinations
- User authentication with Supabase
- Image upload with AWS S3
- Search and filter functionality
- External API integrations
- Responsive design
- Docker support
