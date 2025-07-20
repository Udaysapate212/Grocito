import axios from 'axios';

// This service handles geocoding operations using OpenWeatherMap API
export const geocodingService = {
  // Get user's current location using browser's geolocation API
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied by the user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get location timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  // Convert coordinates to pincode only
  getAddressFromCoordinates: async (latitude, longitude) => {
    console.log('Getting pincode from coordinates:', latitude, longitude);
    
    try {
      // Get pincode from coordinates directly
      console.log('Getting pincode from coordinates...');
      const pincode = await getPincodeFromCoordinates(latitude, longitude);
      console.log('Pincode retrieved:', pincode);
      
      // Return only the pincode information
      const result = {
        pincode: pincode
      };
      
      console.log('Final pincode result:', result);
      return result;
    } catch (error) {
      console.error('Error getting pincode from coordinates:', error);
      throw error;
    }
  },

  // Search for locations by pincode only
  searchLocations: async (pincode) => {
    console.log('Searching locations for pincode:', pincode);
    
    try {
      // Validate if input is a pincode (numeric and appropriate length)
      if (!/^\d{5,6}$/.test(pincode)) {
        console.log('Input is not a valid pincode format');
        throw new Error('Please enter a valid pincode');
      }
      
      // For pincode search, we'll use a mock response since we're focusing only on pincode functionality
      // In a real implementation, you would use a pincode database or API
      console.log('Generating mock data for pincode:', pincode);
      
      // Generate mock location data based on the pincode
      // This would be replaced with actual API calls in production
      const mockLocation = {
        pincode: pincode,
        latitude: 28.6139 + (parseInt(pincode.substring(0, 2)) / 100),
        longitude: 77.2090 + (parseInt(pincode.substring(2, 4)) / 100)
      };
      
      console.log('Generated mock location data:', mockLocation);
      return [mockLocation];
    } catch (error) {
      console.error('Error searching locations by pincode:', error);
      throw error;
    }
  }
};

// Helper function to get pincode from coordinates using multiple APIs
// This is needed because OpenWeatherMap doesn't provide pincode directly
async function getPincodeFromCoordinates(latitude, longitude) {
  // Try multiple geocoding services to get the pincode
  // If one fails, try the next one
  
  // First try BigDataCloud API
  try {
    console.log('Trying BigDataCloud API for pincode...');
    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    console.log('BigDataCloud API response:', response.data);
    
    if (response.data && response.data.postcode) {
      return response.data.postcode;
    }
  } catch (error) {
    console.error('Error getting pincode from BigDataCloud:', error);
  }
  
  // Then try LocationIQ API (requires API key but more reliable)
  try {
    // For demo purposes, we'll use a mock response based on the coordinates
    // In a real app, you would use a proper geocoding service with an API key
    console.log('Using fallback method for pincode...');
    
    // Simple algorithm to generate a pincode based on coordinates
    // This is just for demonstration - not accurate for real use
    const lat = Math.abs(Math.floor(latitude * 100));
    const lng = Math.abs(Math.floor(longitude * 100));
    
    // Generate a 6-digit pincode from the coordinates
    let pincode = String(lat % 1000).padStart(3, '0') + String(lng % 1000).padStart(3, '0');
    
    // Check if the pincode is in our list of valid pincodes
    const validPincodes = ['110001', '110002', '110003', '400001', '400002', '400003', '560001', '560002', '560003'];
    
    // If the generated pincode is not in our list, use the closest one
    if (!validPincodes.includes(pincode)) {
      // For demo purposes, just return a random valid pincode
      pincode = validPincodes[Math.floor(Math.random() * validPincodes.length)];
    }
    
    console.log('Generated pincode:', pincode);
    return pincode;
  } catch (error) {
    console.error('Error in fallback pincode generation:', error);
  }
  
  // If all else fails, return a default pincode
  return '110001'; // Default to Delhi pincode
}