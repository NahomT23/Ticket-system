import React, { Component } from 'react';
import CountUp from 'react-countup';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';

class TicketStats extends Component {
  render() {
    const { tickets, isDarkMode } = this.props;

    if (!tickets || tickets.length === 0) {
      return <p>No tickets found.</p>;
    }

    // Calculate ticket statistics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(ticket => ticket.status.toLowerCase() === 'open').length;
    const inProgressTickets = tickets.filter(ticket => ticket.status.toLowerCase() === 'in progress').length;
    const completedTickets = tickets.filter(ticket => ticket.status.toLowerCase() === 'completed').length;

    // Animation variant for each card
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    const statsData = [
      { title: 'Total Tickets', count: totalTickets },
      { title: 'Open Tickets', count: openTickets },
      { title: 'In Progress Tickets', count: inProgressTickets },
      { title: 'Completed Tickets', count: completedTickets },
    ];

    return (
      <InView triggerOnce>
        {({ inView, ref }) => (
          <motion.div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                transition={{ duration: 0.5 }}
                className={`p-4 shadow rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-2xl">
                  <CountUp end={stat.count} duration={2} /> tickets
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </InView>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
});

export default connect(mapStateToProps)(TicketStats);
