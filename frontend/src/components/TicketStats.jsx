import React, { Component } from 'react';
import CountUp from 'react-countup';
import { connect } from 'react-redux';

class TicketStats extends Component {
  render() {
    const { tickets } = this.props;

    if (!tickets || tickets.length === 0) {
      return <p>No tickets found.</p>;
    }

    // Calculate ticket statistics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(ticket => ticket.status.toLowerCase() === 'open').length;
    const inProgressTickets = tickets.filter(ticket => ticket.status.toLowerCase() === 'in progress').length;
    const completedTickets = tickets.filter(ticket => ticket.status.toLowerCase() === 'completed').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Total Tickets</h3>
          <p className="text-2xl">
            <CountUp end={totalTickets} duration={2} /> tickets
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Open Tickets</h3>
          <p className="text-2xl">
            <CountUp end={openTickets} duration={2} /> tickets
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">In Progress Tickets</h3>
          <p className="text-2xl">
            <CountUp end={inProgressTickets} duration={2} /> tickets
          </p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold">Completed Tickets</h3>
          <p className="text-2xl">
            <CountUp end={completedTickets} duration={2} /> tickets
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
});

export default connect(mapStateToProps)(TicketStats);
