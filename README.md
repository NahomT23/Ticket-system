# Role-Based Ticketing System

A full-stack role-based support ticketing system built as a mini-project to showcase backend and frontend skills. The application allows users to create support tickets while admins manage and update them. The project demonstrates secure authentication, role-based access, real-time notifications, and a responsive, modern UI.

---

## Features

### User Authentication & Authorization
- **JWT-based login and signup.**
- Two user roles:
  - **User:** Can create tickets.
  - **Admin:** Manages tickets.
- The first user to sign up automatically becomes the admin.
- Admins can generate a secure invitation code that expires after one day or once used for admin promotion.

### Ticket Management
- Users can create tickets with a **title**, **description**, **priority**, and **status**.
- Users see only their own tickets.
- Admins have access to view and update all tickets’ status (e.g., Open, In Progress, Closed).

### Real-Time Email Notifications
- Users receive an email (via Nodemailer using Gmail) as soon as an admin updates their ticket.

### Security & Performance Enhancements
- **Rate Limiter:** Prevents abuse.
- **Helmet:** Provides HTTP header security.
- **CORS:** Configured for secure cross-origin requests.

### Responsive & Themed UI
- Fully responsive design.
- Dark and light mode support.
- Styled using **Tailwind CSS** and **Shadcn UI**.

### Frontend
- Built with **React** using class-based components.
- State management is handled with **Redux** (organized in the `features` folder as slices).

---

## Technologies Used

### Backend
- **Node.js & Express:** For building RESTful APIs.
- **MongoDB:** As the database for storing users and tickets.
- **JWT:** For secure authentication.
- **Nodemailer (with Gmail):** To send email notifications.
- **Security:** Helmet, Rate Limiter, and CORS.

### Frontend
- **React (Class-Based Components):** For building the UI.
- **Redux:** For state management.
- **Tailwind CSS & Shadcn UI:** For modern and responsive styling.

---

## Project Structure
/backend
├── controllers       # Controller functions for business logic
├── config            # App and database configuration files
├── middleware        # Custom middleware (auth, rate limiter, etc.)
├── models            # Mongoose models (User, Ticket, etc.)
├── routes            # API route definitions
└── templates         # Email templates and other view templates

/frontend
├── components        # Reusable React components
├── pages             # Page components (Login, Signup, Dashboard, etc.)
└── features          # Redux slices and related files for state management

---




## Setup & Installation

### Prerequisites
- **Node.js** (v14+ recommended)
- **MongoDB** instance (local or cloud-based)
- A **Gmail account** for Nodemailer

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/role-based-ticketing-system.git
   cd role-based-ticketing-system
   
2. **Backend Setup:**

   ```bash
   cd backend
   npm install

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   npm install

# Environment Variables

**Create a .env file in the backend folder and add the following**
**For the backend:**

`PORT`
`MONGO_URI`
`JWT_SECRET`
`GMAIL_USER`
`GMAIL_PASS`
`JWT_EXPIRES_IN`


**Create a .env file in the frontend folder and add the following**
**For the frontend:**

`VITE_BACKEND_URL`

## Run the Application Locally:

**Backend:**
1. **In the /backend folder, run:**

   ```bash
   npm run start
   
**Frontend:**
1. **In the /frontend folder, run:**
   
   ```bash
   npm run dev


## API Endpoints:
#### Register a new user. The first registered user automatically becomes an admin.

```http
POST /api/auth/signup
```

#### Authenticate a user and return a JWT token.

```http
POST /api/auth/login
```


#### Create a new support ticket. (Requires authentication)
```http
POST /api/ticket/create
```


#### User: Retrieves only the tickets created by the authenticated user.
#### Admin: Retrieves all tickets.
```http
GET /api/ticket/get
```




#### Update ticket status (Admins only).
```http
PUT /api/ticket/:id
```


#### Admins can generate a secure invitation code for promoting users to admin.
#### Invitation codes expire after one day or once used.

```http
POST /api/admin/generate
```


### Deployment
The project is deployed on Vercel. To deploy your changes:

## 1 Push your commits to GitHub.
## 2 Connect your GitHub repository to Vercel.
## 3 Set the required environment variables on Vercel.
## 4 Deploy the application.

### Usage
## Authentication:
Use the signup and login pages to register and log in. There is an extra input for users to enter their invitation code either during signup or sign-in.

## Dashboard:

User Dashboard: View and create tickets.
Admin Dashboard: View all tickets and update their status.
## Invitation Code:
Admins can generate invitation codes to promote other users to admin.

## Real-Time Notifications:
Users receive an email notification (via Gmail and Nodemailer) when their ticket is updated.

Note: The frontend is built with class-based components. Redux slices are organized under the features folder for state management, and the UI supports dark/light mode with full responsiveness.


