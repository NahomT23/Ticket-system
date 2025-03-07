import React, { Component } from "react";
import { motion } from "framer-motion";
import { InView } from "react-intersection-observer";
import { Pie, Bar, Line } from "react-chartjs-2";
import { connect } from "react-redux";
import "chart.js/auto";

class DashboardAnalytics extends Component {
  render() {
    const { tickets, isDarkMode } = this.props;

    if (!tickets || tickets.length === 0) {
      return <p>No tickets found for analytics.</p>;
    }

    // Compute status counts
    const totalTickets = tickets.length;
    const statusCounts = { open: 0, "in progress": 0, completed: 0 };
    tickets.forEach((ticket) => {
      const status = ticket.status.toLowerCase();
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    // Compute counts by day for the last 7 days
    const countsByDay = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split("T")[0];
      countsByDay[key] = 0;
    }
    tickets.forEach((ticket) => {
      const createdAt = new Date(ticket.createdAt);
      const key = createdAt.toISOString().split("T")[0];
      if (key in countsByDay) {
        countsByDay[key]++;
      }
    });
    const lineLabels = Object.keys(countsByDay);
    const lineDataArr = Object.values(countsByDay);

    // Data for charts
    const statusLabels = ["Open", "In Progress", "Completed"];
    const statusData = [
      statusCounts.open,
      statusCounts["in progress"],
      statusCounts.completed,
    ];

    const pieData = {
      labels: statusLabels,
      datasets: [
        {
          data: statusData,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    const barData = {
      labels: statusLabels,
      datasets: [
        {
          label: "Tickets by Status",
          data: statusData,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    const lineChartData = {
      labels: lineLabels,
      datasets: [
        {
          label: "Tickets Created (Last 7 Days)",
          data: lineDataArr,
          borderColor: isDarkMode ? "#90cdf4" : "#3182ce",
          backgroundColor: isDarkMode
            ? "rgba(144,205,244,0.2)"
            : "rgba(49,130,206,0.2)",
          fill: true,
        },
      ],
    };

    // Chart options for Bar & Line charts
    const barLineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: isDarkMode ? "#f7fafc" : "#1a202c" } },
      },
      scales: {
        x: {
          ticks: { color: isDarkMode ? "#f7fafc" : "#1a202c" },
          grid: { color: isDarkMode ? "#4a5568" : "#e2e8f0" },
        },
        y: {
          ticks: { color: isDarkMode ? "#f7fafc" : "#1a202c" },
          grid: { color: isDarkMode ? "#4a5568" : "#e2e8f0" },
        },
      },
    };

    // Options for the Pie chart
    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: isDarkMode ? "#f7fafc" : "#1a202c" } },
      },
    };

    return (
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <div ref={ref} className="mt-8">
            <h3
              className="text-2xl font-semibold mb-4"
              style={{ color: isDarkMode ? "#cbd5e0" : "#2d3748" }}
            >
              Analytics
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Bar Chart */}
              <div
                className={`p-4 rounded-lg shadow ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h4
                  className="text-lg font-medium mb-2"
                  style={{ color: isDarkMode ? "#cbd5e0" : "#2d3748" }}
                >
                  Tickets by Status (Bar Chart)
                </h4>
                <div className="relative h-48">
                  <Bar data={barData} options={barLineOptions} />
                </div>
              </div>
              {/* Line Chart */}
              <div
                className={`p-4 rounded-lg shadow ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h4
                  className="text-lg font-medium mb-2"
                  style={{ color: isDarkMode ? "#cbd5e0" : "#2d3748" }}
                >
                  Tickets Created (Line Chart)
                </h4>
                <div className="relative h-48">
                  <Line data={lineChartData} options={barLineOptions} />
                </div>
              </div>
              {/* Pie Chart */}
              <div
                className={`p-4 rounded-lg shadow ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h4
                  className="text-lg font-medium mb-2"
                  style={{ color: isDarkMode ? "#cbd5e0" : "#2d3748" }}
                >
                  Tickets by Status (Pie Chart)
                </h4>
                <div className="relative h-48">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </InView>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
  isDarkMode: state.theme.isDarkMode,
});

export default connect(mapStateToProps)(DashboardAnalytics);
