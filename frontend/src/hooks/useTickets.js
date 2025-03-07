import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchTickets } from '../features/ticketSlice';
import { useDispatch } from 'react-redux';

const useTickets = (token) => {
  const dispatch = useDispatch();
  const [ticketsLoading, setTicketsLoading] = useState(true);

  const refreshTickets = useCallback(() => {
    setTicketsLoading(true);
    dispatch(fetchTickets()).then(() => {
      setTicketsLoading(false);
    });
  }, [dispatch]);

  const handleDelete = async (ticketId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ticket/delete/${ticketId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Error deleting ticket');
      } else {
        toast('Ticket deleted successfully');
        refreshTickets();
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Error deleting ticket');
    }
  };

  return { ticketsLoading, refreshTickets, handleDelete };
};

export default useTickets;
