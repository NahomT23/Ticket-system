import React, { Component } from 'react';

class TicketTable extends Component {
  render() {
    const { tickets, isDarkMode } = this.props;
    return (
      <div className="flex-grow">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-left`}>
              <th className="px-4 py-3 border-b-2 border-gray-400 font-semibold">Title</th>
              <th className="px-4 py-3 border-b-2 border-gray-400 font-semibold">Description</th>
              <th className="px-4 py-3 border-b-2 border-gray-400 font-semibold">Status</th>
              <th className="px-4 py-3 border-b-2 border-gray-400 font-semibold">Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr 
                key={ticket._id} 
                className={`${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
              >
                <td className="px-4 py-3 border-b border-gray-300">{ticket.title}</td>
                <td className="px-4 py-3 border-b border-gray-300">{ticket.description}</td>
                <td className="px-4 py-3 border-b border-gray-300 capitalize">{ticket.status}</td>
                <td className="px-4 py-3 border-b border-gray-300 capitalize">{ticket.priority || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TicketTable;
