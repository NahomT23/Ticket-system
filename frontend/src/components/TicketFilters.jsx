import React, { Component } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

class TicketFilters extends Component {
  render() {
    const {
      searchTerm,
      selectedStatus,
      selectedPriority,
      onSearchChange,
      onStatusChange,
      onPriorityChange,
      isDarkMode,
    } = this.props;
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-shrink-0">
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`max-w-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
          />
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <div className="flex gap-2">
            <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value)}>
              <SelectTrigger
                className={`w-[150px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'text-black'}`}
              >
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-800 text-white' : 'text-black'}>
                <SelectItem value="all" className={isDarkMode ? 'text-white' : 'text-black'}>
                  All Statuses
                </SelectItem>
                <SelectItem value="open" className={isDarkMode ? 'text-white' : 'text-black'}>
                  Open
                </SelectItem>
                <SelectItem value="in progress" className={isDarkMode ? 'text-white' : 'text-black'}>
                  In Progress
                </SelectItem>
                <SelectItem value="completed" className={isDarkMode ? 'text-white' : 'text-black'}>
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={(value) => onPriorityChange(value)}>
              <SelectTrigger
                className={`w-[150px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'text-black'}`}
              >
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-800 text-white' : 'text-black'}>
                <SelectItem value="all" className={isDarkMode ? 'text-white' : 'text-black'}>
                  All Priorities
                </SelectItem>
                <SelectItem value="low" className={isDarkMode ? 'text-white' : 'text-black'}>
                  Low
                </SelectItem>
                <SelectItem value="medium" className={isDarkMode ? 'text-white' : 'text-black'}>
                  Medium
                </SelectItem>
                <SelectItem value="high" className={isDarkMode ? 'text-white' : 'text-black'}>
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

export default TicketFilters;
