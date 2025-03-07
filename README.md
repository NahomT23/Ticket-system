# Role-Based Ticketing System

A full-stack role-based support ticketing system built as a mini-project to showcase backend and frontend skills. The application allows users to create support tickets while admins manage and update them. The project demonstrates secure authentication, role-based access, real-time notifications, and a responsive, modern UI.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Usage](#usage)

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

