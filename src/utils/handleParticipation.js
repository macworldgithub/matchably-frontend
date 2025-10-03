// trackingHandler.js
import config from '../config';
import axios from 'axios';

export const handleParticipationAction = async (creatorId, action) => {
    try {
      const token = localStorage.getItem('BRAND_TOKEN');
      const response = await axios.put(`${config.BACKEND_URL}/brand/creators/${creatorId}/participation`, {
        action: action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
      
         return { success: true, message: `Participation ${action === 'approve' ? 'approved' : 'rejected'} successfully` };
    
        } else {
         
          return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error handling participation:', error);
      return { success: false, message: 'Failed to handle participation' };
    } 
  };