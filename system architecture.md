# backend features
- Rate limiting
- Input validation


# Signup/Signin
- Add a "role" dropdown during signup but disable it by default to "user"
- Allow admin code entry, So if they select admin then another input will appear where they will need to enter code


# Admin
- The admin will have a generate invitation code button on his dashboard
- The admin invitation code should be hashed and should expire after a day and new one should be generated everyday
- After one user uses the admin invitation code, the code should regenerate and change for more security, if not it 
  should remain the same until it's expirey day
- The admin invitation code should direcrtly trigger the role in the model and change it to admin so that users 
  don't have to enter the code everytime and also so that it stays secure
- 



# Ticket
- It should have status open, in progress, closed
- It should have priority field for low, medium, high


# Additional Features to add
- Use nodemailer to send email to users when their ticket status changes(when the admin updates it)
- Add socket.io
- Use class based components








#  Frontend #
- Make it have a filter/search system for both status name, description, and priority
- Make it have a button to generate a new invitation code
- Add pagination
- Dashboard Analytics :
  Total number of tickets.
  Tickets by status with a pie chart and bar graph
  Tickets created in the last 7 days with a line chart
- Must be full mobile responsive.
- Status Badges: Color-coded labels like red for closed, and green for opem
- Confirmation Modals: For delete/status-change actions in the admin dashboard