// trackingHandler.js
import config from '../config';
import axios from 'axios';

export const handleTrackingSave = async (creatorId, trackingInput) => {
  if (!trackingInput.trim()) {
    return { success: false, message: 'Please enter a tracking number' };
  }

  if (trackingInput.length <= 5) {
    return { success: false, message: 'Tracking number must be more than 5 characters' };
  }

  const token = localStorage.getItem('BRAND_TOKEN');
  if (!token) {
    return { success: false, message: 'Authentication token is missing' };
  }


  try {
    const response = await axios.put(
      `${config.BACKEND_URL}/brand/creators/${creatorId}/tracking`,
      {
        trackingNumber: trackingInput,
        courier: 'UPS', // Default courier
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data?.status === 'success') {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data?.message || 'Failed to update tracking information' };
    }
  } catch (error) {
    console.error('Error updating tracking:', error);
    return { success: false, message: 'Failed to update tracking information' };
  } 
};

