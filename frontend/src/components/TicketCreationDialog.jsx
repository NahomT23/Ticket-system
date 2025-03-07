import React, { Component } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

class TicketCreationDialog extends Component {
  render() {
    const { 
      isDialogOpen, 
      onOpenChange, 
      onSubmit, 
      formData, 
      onChange, 
      creating, 
      isDarkMode 
    } = this.props;
    return (
      <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            className={`mb-4 ${isDarkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-500' : 'bg-gray-300 text-gray-900 hover:bg-gray-200'}`}
          >
            Create Ticket
          </Button>
        </DialogTrigger>
        <DialogContent className={`sm:max-w-[425px] ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <DialogHeader>
            <DialogTitle>Create Ticket</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new ticket.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <label 
                  className={`block mb-2 px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'text-gray-100' : 'bg-white text-gray-900'}`}
                >
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Priority:</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={onChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => onOpenChange(false)} 
                type="button" 
                className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-gray-900'}`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className={`${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {creating ? 'Creating...' : 'Create Ticket'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default TicketCreationDialog;
