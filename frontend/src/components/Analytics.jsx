import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

class DashboardAnalytics extends Component {
  // Helper function to get counts by status
  getStatusCounts(tickets) {
    const counts = {
      open: 0,
      'in progress': 0,
      completed: 0,
    };

    tickets.forEach(ticket => {
      const status = ticket.status.toLowerCase();
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    return counts;
  }

  // Helper function to get tickets created in the last 7 days
  getTicketsLast7Days(tickets) {
    const countsByDay = {};
    const today = new Date();
    // Create keys for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0]; // format YYYY-MM-DD
      countsByDay[key] = 0;
    }

    tickets.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt);
      const key = createdAt.toISOString().split('T')[0];
      if (key in countsByDay) {
        countsByDay[key]++;
      }
    });

    // Get labels and data arrays
    const labels = Object.keys(countsByDay);
    const data = Object.values(countsByDay);

    return { labels, data };
  }

  render() {
    const { tickets } = this.props;

    if (!tickets || tickets.length === 0) {
      return <p>No tickets found for analytics.</p>;
    }

    const totalTickets = tickets.length;
    const statusCounts = this.getStatusCounts(tickets);
    const { labels: lineLabels, data: lineData } = this.getTicketsLast7Days(tickets);

    // Data for Pie and Bar charts for tickets by status
    const statusLabels = ['Open', 'In Progress', 'Completed'];
    const statusData = [
      statusCounts.open,
      statusCounts['in progress'],
      statusCounts.completed,
    ];

    const pieData = {
      labels: statusLabels,
      datasets: [
        {
          data: statusData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    const barData = {
      labels: statusLabels,
      datasets: [
        {
          label: 'Tickets by Status',
          data: statusData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    const lineChartData = {
      labels: lineLabels,
      datasets: [
        {
          label: 'Tickets Created in Last 7 Days',
          data: lineData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    return (
      <div className="p-8">
        <h1 className="text-3xl mb-6">Dashboard Analytics</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Total Tickets: {totalTickets}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tickets by Status (Pie Chart)</h3>
            <Pie data={pieData} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Tickets by Status (Bar Chart)</h3>
            <Bar data={barData} />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Tickets Created in the Last 7 Days (Line Chart)
          </h3>
          <Line data={lineChartData} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
});

export default connect(mapStateToProps)(DashboardAnalytics);
