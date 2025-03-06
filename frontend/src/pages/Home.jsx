import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
};

const featureCardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignIn() {
    this.props.navigate('/signin');
  }

  handleSignUp() {
    this.props.navigate('/signup');
  }

  render() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 variants={slideUp} className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Next-Gen Ticket Management
          </motion.h1>
          
          <motion.p variants={slideUp} className="text-xl text-gray-600 mb-8">
            Built with <span className="font-semibold">React + Redux</span> frontend and 
            <span className="font-semibold"> Node.js + MongoDB</span> backend. 
            Enterprise-ready solution featuring JWT authentication and real-time notifications.
          </motion.p>

          <motion.div variants={slideUp} className="flex gap-4 justify-center">
            <button
              onClick={this.handleSignUp}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get Started 
            </button>
            <button
              onClick={this.handleSignIn}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Existing User
            </button>
          </motion.div>

          <motion.div variants={scaleUp} className="mt-16 shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            {/* <img 
              src={home} 
              alt="Dashboard Preview" 
              className="w-full h-auto"
            /> */}
          </motion.div>
        </motion.div>

        {/* Key Features */}
        <IntersectionWrapper className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-16">Built with Modern Tech Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {icon: '🔐', title: 'JWT Auth', desc: 'Secure authentication with refresh tokens'},
              {icon: '📨', title: 'Real-time Emails', desc: 'Nodemailer integration'},
              {icon: '📱', title: 'React UI', desc: 'Responsive components with Tailwind CSS'},
              {icon: '📊', title: 'Redux State', desc: 'Predictable state management'},
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={slideUp}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </IntersectionWrapper>

        {/* Architecture Highlight */}
        <IntersectionWrapper className="mt-32">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={slideUp}>
                <h2 className="text-3xl font-bold mb-6">Full-Stack Architecture</h2>
                <p className="text-gray-600 mb-6">
                  Robust MERN stack implementation with best practices:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"/>
                    REST API with Express.js routes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"/>
                    MongoDB aggregation for analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"/>
                    Redux Toolkit for state management
                  </li>
                </ul>
              </motion.div>
              <motion.div variants={scaleUp} className="bg-gray-50 p-4 rounded-xl">
                <code className="block text-sm font-mono text-gray-800">
                  {`
ticketRouter.post("/create", authorize, createTicket);
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }
`}
                </code>
              </motion.div>
            </div>
          </div>
        </IntersectionWrapper>

        {/* Workflow Section */}
        <IntersectionWrapper className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-16">Streamlined Ticket Lifecycle</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {title: 'Create Ticket', desc: 'Users submit tickets with attachments'},
              {title: 'Admin Review', desc: 'Real-time status updates'},
              {title: 'Resolution', desc: 'Automatic email notifications'},
            ].map((step, i) => (
              <motion.div 
                key={i}
                variants={slideUp}
                className="p-6 bg-white rounded-xl border-l-4 border-blue-600 shadow-sm"
              >
                <div className="text-blue-600 font-bold mb-2">Step {i+1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </IntersectionWrapper>
      </div>

      {/* Footer CTA */}
      {/* <div className="bg-blue-600 mt-32 py-16">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold mb-6"
          >
            Ready to Manage Tickets Like a Pro?
          </motion.h2>
          <button
            onClick={this.handleSignUp}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </div> */}
    </div>
    );
  }
}

// Intersection Observer Wrapper
const IntersectionWrapper = ({ children, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function WithNavigation(props) {
  const navigate = useNavigate();
  return <Home {...props} navigate={navigate} />;
}