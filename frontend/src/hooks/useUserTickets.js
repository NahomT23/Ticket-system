import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const initialFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
};

const useUserTickets = (token) => {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ticket/get`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error loading tickets');
      } else {
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast('Error loading tickets');
    } finally {
      setLoadingTickets(false);
    }
  }, [token]);

  const createTicket = useCallback(async () => {
    setCreating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error creating ticket');
      } else {
        toast('Ticket created successfully');
        setFormData(initialFormData);
        setDialogOpen(false);
        loadTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast('Error creating ticket');
    } finally {
      setCreating(false);
    }
  }, [formData, token, loadTickets]);

  return {
    tickets,
    loadingTickets,
    formData,
    setFormData,
    creating,
    createTicket,
    isDialogOpen,
    setDialogOpen,
    loadTickets,
  };
};

export default useUserTickets;
