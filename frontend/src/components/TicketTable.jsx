import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Edit2, Trash2 } from 'lucide-react';

class TicketTable extends Component {
  render() {
    const { tickets, isDarkMode, onDeleteClick } = this.props;
    return (
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-0 md:min-w-[600px]">
          <TableHeader className={isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}>
            <TableRow>
              <TableHead className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                Title
              </TableHead>
              <TableHead
                className={`hidden md:table-cell ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Description
              </TableHead>
              <TableHead className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                Status
              </TableHead>
              <TableHead
                className={`hidden md:table-cell ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
              >
                Priority
              </TableHead>
              <TableHead
                className={`hidden md:table-cell ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Created By
              </TableHead>
              <TableHead className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket._id}
                className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                <TableCell className="font-medium max-w-[150px] truncate">
                  <Link
                    to={`/ticket/${ticket._id}`}
                    className={`hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    {ticket.title}
                  </Link>
                </TableCell>
                <TableCell
                  className={`hidden md:table-cell ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}
                >
                  <Link to={`/ticket/${ticket._id}`}>{ticket.description}</Link>
                </TableCell>
                <TableCell className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status.toLowerCase() === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status.toLowerCase() === 'in progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell
                  className={`hidden md:table-cell ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {ticket.priority || 'N/A'}
                </TableCell>
                <TableCell
                  className={`hidden md:table-cell ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {ticket.createdBy ? ticket.createdBy.name || ticket.createdBy.email : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/ticket/update/${ticket._id}`}>
                      <Button
                        variant="outline"
                        className={`${isDarkMode ? 'border-gray-200 text-gray-300' : 'text-gray-600'}`}
                        size="sm"
                      >
                        <span className="block md:hidden">
                          <Edit2 size={16} className={isDarkMode ? 'text-gray-100' : 'text-gray-600'} />
                        </span>
                        <span className="hidden md:inline">Update</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className={`${isDarkMode ? 'border-red-400 text-red-300' : 'text-red-600'}`}
                      size="sm"
                      onClick={() => onDeleteClick(ticket._id)}
                    >
                      <Trash2 size={16} className={isDarkMode ? 'text-red-300' : 'text-red-600'} />
                      <span className="hidden md:inline ml-2">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default TicketTable;
