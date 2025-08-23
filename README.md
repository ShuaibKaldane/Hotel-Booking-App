          
# Wonderlust - Hotel Booking Application

A full-stack web application for hotel/property booking built with Node.js, Express.js, MongoDB, and EJS templating. This application allows users to browse properties, make bookings, leave reviews, and manage their reservations.

## 🚀 Features

### User Authentication & Authorization
- User registration and login system using Passport.js
- Session management with MongoDB store
- Role-based access control (property owners vs guests)
- Secure password handling with passport-local-mongoose

### Property Management
- **Browse Properties**: View all available listings with images, descriptions, and pricing
- **Property Details**: Detailed view of individual properties with owner information
- **Search & Filter**: Search properties by location, country, or other criteria
- **Auto-suggestions**: Real-time search suggestions for better user experience
- **CRUD Operations**: Property owners can create, read, update, and delete their listings

### Booking System
- **Make Reservations**: Book properties with date selection and guest details
- **Booking Validation**: 
  - Prevents double bookings for the same dates
  - Validates check-in/check-out dates
  - Ensures check-in dates are not in the past
- **Booking Management**: Users can view and cancel their bookings
- **Owner Dashboard**: Property owners can view all bookings for their properties
- **Payment Options**: Support for Cash, Card, and UPI payment methods
- **Dynamic Pricing**: Automatic calculation based on number of nights and rooms

### Review System
- Users can leave reviews and ratings (1-5 stars) for properties
- Review validation and moderation
- Display average ratings and user feedback

### Image Management
- **Cloudinary Integration**: Secure image upload and storage
- **Image Optimization**: Automatic image processing and optimization
- **Default Images**: Fallback to default images when no image is uploaded

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **Passport.js** - Authentication middleware
- **passport-local** - Local authentication strategy
- **passport-local-mongoose** - Mongoose plugin for Passport
- **express-session** - Session middleware
- **connect-mongo** - MongoDB session store

### Frontend
- **EJS** - Embedded JavaScript templating
- **ejs-mate** - Layout support for EJS
- **Bootstrap** - CSS framework (implied from form classes)

### File Upload & Storage
- **Cloudinary** - Cloud-based image management
- **Multer** - File upload middleware
- **multer-storage-cloudinary** - Cloudinary storage for Multer

### Validation & Error Handling
- **Joi** - Data validation library
- **Custom Error Handling** - ExpressError utility
- **Flash Messages** - User feedback system

## 📁 Project Structure

```
Hotel-Booking-App/
├── controllers/          # Route controllers
│   ├── Listening.js     # Property management logic
│   ├── booking.js       # Booking management logic
│   ├── review.js        # Review system logic
│   └── user.js          # User authentication logic
├── middleware/          # Custom middleware
│   └── auth.js          # Authentication middleware
├── modules/             # Database models
│   ├── Listening.js     # Property model
│   ├── booking.js       # Booking model
│   ├── review.js        # Review model
│   └── user.js          # User model
├── routes/              # Route definitions
│   ├── listing.js       # Property routes
│   ├── booking.js       # Booking routes
│   ├── review.js        # Review routes
│   └── user.js          # User routes
├── views/               # EJS templates
│   ├── booking/         # Booking-related views
│   ├── listening/       # Property-related views
│   ├── users/           # User-related views
│   ├── includes/        # Partial templates
│   └── layouts/         # Layout templates
├── public/              # Static assets
│   ├── css/             # Stylesheets
│   └── js/              # Client-side JavaScript
├── utils/               # Utility functions
│   ├── ExpressError.js  # Custom error class
│   └── wrapAsync.js     # Async error wrapper
├── CloudConfig.js       # Cloudinary configuration
├── schema.js            # Joi validation schemas
└── index.js             # Main application file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.18.0 or higher)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hotel-Booking-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret_key
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the application**
   ```bash
   npm start
   ```
   or for development:
   ```bash
   node index.js
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:8080`

## 🔧 Configuration

### MongoDB Setup
- Create a MongoDB Atlas cluster or set up local MongoDB
- Update the `ATLASDB_URL` in your `.env` file
- The application will automatically connect to the database on startup

### Cloudinary Setup
- Sign up for a Cloudinary account
- Get your cloud name, API key, and API secret
- Update the Cloudinary credentials in your `.env` file
- Images will be stored in the 'WonderLandApp' folder

## 📝 API Endpoints

### Properties
- `GET /alllist` - View all properties
- `GET /listing/new` - Create new property form
- `POST /listening/response` - Save new property
- `GET /listing/:id` - View property details
- `GET /listings/:id/edit` - Edit property form
- `PUT /listing/:id` - Update property
- `DELETE /listing/:id` - Delete property
- `GET /search` - Search properties
- `GET /api/suggestions` - Get search suggestions

### Bookings
- `POST /listing/:id/book` - Create booking
- `GET /bookings` - View user bookings
- `PUT /bookings/:bookingId/cancel` - Cancel booking
- `GET /listing/:listingId/bookings` - View property bookings (owners)

### Reviews
- Routes for creating, viewing, and managing reviews

### Authentication
- User registration, login, and logout routes

## 🔒 Security Features

- **Input Validation**: Server-side validation using Joi schemas
- **Authentication**: Secure user authentication with Passport.js
- **Authorization**: Role-based access control for different user types
- **Session Security**: Secure session management with MongoDB store
- **File Upload Security**: Restricted file types and secure cloud storage
- **Error Handling**: Comprehensive error handling and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




## 🔮 Future Enhancements

- **Payment Integration**: Add real payment gateway integration
- **Email Notifications**: Send booking confirmations and reminders
- **Advanced Search**: Add filters for price range, amenities, etc.
- **Mobile App**: Develop mobile application
- **Admin Dashboard**: Add admin panel for system management
- **Analytics**: Add booking and revenue analytics
- **Multi-language Support**: Internationalization
- **Real-time Chat**: Add messaging between guests and hosts

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Node.js and Express.js**
        
