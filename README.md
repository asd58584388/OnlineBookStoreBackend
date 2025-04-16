# Online Book Store Backend

A RESTful API backend for an online bookstore application built with Node.js, Express, and MongoDB.
Front End: https://github.com/asd58584388/OnlineBookStoreFrontend

## Features

- User authentication (registration and login)
- Book listings and categories
- Book reviews and ratings
- Shopping cart functionality
- Order management
- User-created book lists (public/private)

## Technology Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd OnlineBookStoreBackend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=your_mongodb_connection_string
   PORT=3006
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Users
- `POST /api/users/` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/bookLists` - Get user's book lists
- `POST /api/users/bookLists` - Create a new book list

### Book Lists
- `GET /api/bookLists/` - Get all public book lists
- `GET /api/bookLists/:id` - Get a specific book list
- `POST /api/bookLists/books/:booklistid` - Add a book to a list
- `DELETE /api/bookLists/:booklistid` - Delete a book list

### Book Reviews
- `GET /api/bookReviews/:bookid` - Get reviews for a book
- `POST /api/bookReviews/` - Create a book review

### Shopping Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/` - Add item to cart
- `PUT /api/cart/:itemid` - Update cart item
- `DELETE /api/cart/:itemid` - Remove item from cart

### Orders
- `POST /api/orders/` - Create a new order

### Categories
- `GET /api/categories` - Get all book categories

## Database Schema

The application uses the following main data models:

- **User**: Stores user credentials and profile information
- **Cart**: Manages user shopping cart items
- **BookList**: Allows users to create and share book lists
- **BookReview**: Stores user reviews and ratings for books
- **Order**: Tracks user purchase orders


## Development

Start the development server with hot-reloading:
```bash
npm start
```

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation
- `DATABASE_URL`: MongoDB connection string
- `PORT`: Server port (defaults to 3006)
