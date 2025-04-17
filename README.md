# Travlr Getaways

A full-stack travel application that allows users to browse and book travel experiences.

## Features
- Browse travel destinations
- View trip details including pricing and dates
- Admin interface for managing trips
- User authentication

## Technology Stack
- **Frontend**: Express with Handlebars templates, Angular admin SPA
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- Angular CLI

### Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (create a `.env` file) with the following variables:
   ```
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   FRONTEND_ORIGIN=http://localhost:3000
   ADMIN_ORIGIN=http://localhost:4200
   ```
4. Start the application:
   ```
   npm start
   ```
5. For the admin interface:
   ```
   cd app_admin
   npm install
   ng serve
   ```

## Project Structure
- `app_server/`: Server-side Express application
- `app_api/`: RESTful API endpoints
- `app_admin/`: Angular admin interface
- `public/`: Static assets
- `data/`: Database seed data

## API Documentation
- `POST /api/login`: User authentication
- `POST /api/register`: User registration
- `GET /api/trips`: Get all trips
- `POST /api/trips`: Create a new trip
- `GET /api/trips/:tripId`: Get a specific trip
- `PUT /api/trips/:tripId`: Update a trip
- `DELETE /api/trips/:tripId`: Delete a trip

## Development Notes
This project was developed as a full-stack application showcasing the integration of various technologies. The original implementation has been enhanced with modern development practices and improved security features.

## Development and Troubleshooting

### Running in Development Mode
For development with auto-reload:
```
npm run dev
```

### Common Issues and Solutions

#### Database Connection Issues
- Ensure your MongoDB connection string is correct in the `.env` file
- Make sure the database name is included at the end of the connection string (e.g., `/travlr`)
- Check that MongoDB is running and accessible

#### Port Conflicts
If you get an `EADDRINUSE` error:
- Check if you have another instance of the app running
- Change the PORT in your `.env` file

#### Authentication Issues
- Ensure your JWT_SECRET is set in the `.env` file
- Check that you're sending the proper Authorization headers in requests

#### CORS Issues
- Verify that the FRONTEND_ORIGIN and ADMIN_ORIGIN in your `.env` file match the actual URLs of your frontend and admin applications
