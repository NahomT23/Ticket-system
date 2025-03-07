import { useState } from 'react';
import { toast } from 'react-toastify';

const useInvitationCode = (token) => {
  const [invitationCode, setInvitationCode] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);

  const generateCode = async () => {
    setLoadingCode(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast(data.message || 'Error generating invitation code');
      } else {
        setInvitationCode(data.data.code);
        toast('Invitation code generated');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast('Error generating invitation code');
    } finally {
      setLoadingCode(false);
    }
  };

  return { invitationCode, loadingCode, generateCode };
};

export default useInvitationCode;
