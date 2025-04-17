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
3. Set up environment variables (create a `.env` file)
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
