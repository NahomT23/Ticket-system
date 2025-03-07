Role-Based Ticketing System
A full-stack role-based support ticketing system built as a mini-project to showcase backend and frontend skills. The application allows users to create support tickets while admins manage and update them. The project demonstrates secure authentication, role-based access, real-time notifications, and a responsive, modern UI.

Table of Contents
Features
Technologies Used
Project Structure
Setup & Installation
API Endpoints
Environment Variables
Deployment
Usage

Features
User Authentication & Authorization:

JWT-based login and signup.
Two user roles: User (can create tickets) and Admin (manages tickets).
The first user to sign up automatically becomes the admin.
Admins can generate a secure invitation code that expires after one day or once used for admin promotion.
Ticket Management:

Users can create tickets with a title, description, priority and status.
Users see only their own tickets.
Admins have access to view and update all tickets’ status (e.g., Open, In Progress, Closed).
Real-Time Email Notifications:

Users receive an email (via Nodemailer using Gmail) as soon as an admin updates their ticket.
Security & Performance Enhancements:

Rate Limiter to prevent abuse.
Helmet for HTTP header security.
CORS configured for secure cross-origin requests.
Responsive & Themed UI:

Fully responsive design.
Dark and light mode support.
Styled using Tailwind CSS and Shadcn UI.
Frontend:

Built with React using class-based components.
State management is handled with Redux (organized in the features folder as slices).
Technologies Used
Backend
Node.js & Express: For building RESTful APIs.
MongoDB: As the database for storing users and tickets.
JWT: For secure authentication.
Nodemailer (with Gmail): To send email notifications.
Security: Helmet, Rate Limiter, and CORS.
Frontend
React (Class-Based Components): For building the UI.
Redux: For state management.
Tailwind CSS & Shadcn UI: For modern and responsive styling.
Project Structure
bash
Copy
Edit
/backend
├── controllers       # Controller functions for business logic
├── config            # Nodemailer and database configuration files
├── middleware        # Custom middleware (auth, rate limiter, etc.)
├── models            # Mongoose models (User, Ticket, etc.)
├── routes            # API route definitions
└── templates         # Email template

/frontend
├── components        # Reusable React components
├── pages             # Page components (Login, Signup, Dashboard, etc.)
└── features          # Redux slices and related files for state management
Setup & Installation
Prerequisites
Node.js (v14+ recommended)
MongoDB instance (local or cloud-based)
A Gmail account for Nodemailer
Steps
Clone the repository:

bash
Copy
Edit
git clone 
cd role-based-ticketing-system
Backend Setup:

bash
Copy
Edit
cd backend
npm install
Frontend Setup:

bash
Copy
Edit
cd ../frontend
npm install
Configure Environment Variables:
Create a .env file in the backend folder and add the following:
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
JWT_EXPIRES_IN=_JWT_EXPIREY_DATE


Create a .env file in the backend folder and add the following:
VITE_BACKEND_URL=_YOUR_URL



Backend:

In the /backend folder, run:

bash
Copy
Edit
npm run dev
Frontend:
In the /frontend folder, run:

bash
Copy
Edit
npm run start
API Endpoints
Authentication
POST /api/auth/signup
Register a new user. The first registered user automatically becomes an admin.

POST /api/auth/login
Authenticate a user and return a JWT token.

Tickets
POST /api/ticket/create
Create a new support ticket. (Requires authentication)

GET /get
To get a ticket

User: Retrieves only the tickets created by the authenticated user.
Admin: Retrieves all tickets.
PUT /tickets/:id
Update ticket status (Admins only).

Admin Invitation
POST /admin/generate
Admins can generate a secure invitation code for promoting users to admin.
Invitation codes expire after one day or once used.
Environment Variables
Be sure to set up your environment variables as shown in the Setup & Installation section. Variables include:

The project is deployed on Vercel. To deploy your changes:

Push your commits to GitHub.
Connect your GitHub repository to Vercel.
Set the required environment variables on Vercel.
Deploy the application.
For more details, refer to Vercel's Documentation.

Usage
Authentication:
Use the signup and login pages to register and log in, also has an extra input where users can enter their invitation code either when signing up or signin in.
Dashboard:
User Dashboard: View and create tickets.
Admin Dashboard: View all tickets and update their status.
Invitation Code:
Admins can generate invitation codes to promote other users to admin.
Real-Time Notifications:
Users receive an email notification (via Gmail and Nodemailer) when their ticket is updated.
Note: The frontend is built with class-based components. Redux slices are organized under the features folder for state management, and the UI supports dark/light mode with full responsiveness.







