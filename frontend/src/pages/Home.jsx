import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Navigation Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 right-6"
        >
          <button
            onClick={this.handleSignIn}
            className="px-6 py-2 bg-white text-blue-600 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 font-semibold hover:bg-blue-50"
          >
            Sign In
          </button>
        </motion.div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1 
              variants={childVariants}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            >
              Ticket Manager
            </motion.h1>
            
            <motion.p
              variants={childVariants}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Streamline your support process with our powerful ticket management solution
            </motion.p>

            <motion.div variants={childVariants}>
              <button
                onClick={this.handleSignUp}
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* Feature Section */}
          <div className="mt-32 w-full">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {['🚀 Fast Processing', '🔒 Secure Platform', '📈 Analytics'].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureCardVariants}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.split(' ')[0]}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.split(' ').slice(1).join(' ')}</h3>
                  <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Section */}
          <IntersectionWrapper className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {['99% Satisfaction', '1M+ Tickets', '24/7 Support'].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.split(' ')[0]}
                  </div>
                  <div className="text-gray-600">{stat.split(' ')[1]}</div>
                </motion.div>
              ))}
            </div>
          </IntersectionWrapper>
        </div>
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