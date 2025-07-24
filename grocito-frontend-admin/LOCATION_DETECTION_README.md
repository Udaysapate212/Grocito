# Location Detection Feature

This feature provides accurate location detection with pincode fetching for the Grocito Admin Panel. It's designed to help Super Admins filter users based on their current location.

## Features

✅ **Accurate Location Detection**: Uses browser geolocation API to get precise coordinates
✅ **Multiple Geocoding Services**: Supports Google Maps, OpenCage, and Nominatim APIs
✅ **Automatic Fallback**: Falls back to free services if paid APIs are unavailable
✅ **Pincode Validation**: Checks if detected location is in serviceable areas
✅ **Real-time Filtering**: Automatically filters users by detected pincode
✅ **Error Handling**: Comprehensive error handling with user-friendly messages

## How It Works

### For South Nagpur Example:
1. **Click "Detect Location"** in the User Management panel
2. **Allow Location Access** when browser prompts
3. **System detects coordinates** (e.g., 21.0760°N, 79.0877°E for South Nagpur)
4. **Fetches pincode** using geocoding services (e.g., 440010 for South Nagpur)
5. **Displays location info**: "Nagpur, Maharashtra - 440010"
6. **Auto-filters users** by the detected pincode

## API Services Used

### 1. Google Maps Geocoding API (Primary - Most Accurate)
- **Accuracy**: Highest
- **Rate Limits**: Generous with paid plan
- **Setup**: Add `REACT_APP_GOOGLE_MAPS_API_KEY` to `.env`
- **Get API Key**: https://console.cloud.google.com/apis/credentials

### 2. OpenCage Geocoding API (Fallback)
- **Accuracy**: Good
- **Rate Limits**: 2,500 requests/day (free tier)
- **Setup**: Add `REACT_APP_OPENCAGE_API_KEY` to `.env`
- **Get API Key**: https://opencagedata.com/api

### 3. Nominatim (Final Fallback - Free)
- **Accuracy**: Moderate
- **Rate Limits**: 1 request/second
- **Setup**: No API key required
- **Note**: Used automatically if other services fail

## Setup Instructions

### 1. Environment Configuration
Add API keys to `grocito-frontend-admin/.env`:

```env
# Google Maps API Key (Recommended)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OpenCage API Key (Optional fallback)
REACT_APP_OPENCAGE_API_KEY=your_opencage_api_key_here
```

### 2. Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Geocoding API"
4. Create credentials (API Key)
5. Restrict API key to your domain for security
6. Add key to `.env` file

### 3. OpenCage API Setup (Optional)
1. Go to [OpenCage Data](https://opencagedata.com/)
2. Sign up for free account
3. Get your API key from dashboard
4. Add key to `.env` file

## Usage

### For Super Admins:
1. **Access**: Location detection is only available for Super Admin users
2. **Toggle**: Click "Detect Location" button in User Management header
3. **Detect**: Click "Detect My Location" in the expanded panel
4. **Filter**: System automatically filters users by detected pincode
5. **Clear**: Use "Clear Filter" to remove location-based filtering

### For Regular Admins:
- Location detection is not available (they're restricted to their assigned warehouse pincode)

## Serviceable Areas

The system includes validation for serviceable pincodes:

### Currently Configured Areas:
- **Delhi NCR**: 110001-110016
- **Mumbai**: 400001-400016  
- **Pune**: 411001-411008, 412105-412110
- **Nagpur**: 440001-440016, 441904-441908

### Adding New Service Areas:
Edit `locationService.js` → `isServiceableLocation()` method to add more pincodes.

## Error Handling

### Common Errors & Solutions:

#### "Location access denied"
- **Cause**: User denied location permission
- **Solution**: Enable location in browser settings, try again

#### "Location services unavailable"
- **Cause**: GPS/location services disabled
- **Solution**: Enable location services in device settings

#### "Location detection timed out"
- **Cause**: Poor GPS signal or slow network
- **Solution**: Move to better location, try again

#### "Could not determine pincode"
- **Cause**: Location not found in geocoding service
- **Solution**: Try again or enter pincode manually

## Technical Details

### Location Detection Flow:
```
1. Browser Geolocation API → Coordinates (lat, lng)
2. Google Maps Geocoding → Address + Pincode
3. If fails → OpenCage API → Address + Pincode  
4. If fails → Nominatim API → Address + Pincode
5. Validate pincode → Check serviceability
6. Update UI → Show location info + filter users
```

### Accuracy Levels:
- **Google Maps**: ±10-50 meters
- **OpenCage**: ±50-100 meters
- **Nominatim**: ±100-500 meters

### Performance:
- **Detection Time**: 2-5 seconds typically
- **Caching**: 5-minute coordinate cache
- **Rate Limits**: Handled with fallback services

## Security Considerations

1. **API Key Security**: 
   - Restrict Google Maps API key to your domain
   - Don't commit API keys to version control
   - Use environment variables only

2. **Location Privacy**:
   - Location is only used for filtering, not stored
   - User must explicitly allow location access
   - No location data sent to backend

3. **HTTPS Required**:
   - Browser geolocation requires HTTPS in production
   - Ensure your admin panel uses SSL certificate

## Testing

### Test Locations for Nagpur:
- **South Nagpur**: Should detect 440010, 440012, or similar
- **Central Nagpur**: Should detect 440001, 440002
- **East Nagpur**: Should detect 440013, 440014

### Manual Testing:
1. Open browser developer tools
2. Go to Settings → Privacy and Security → Site Settings
3. Find Location settings
4. Test with different permission states

## Troubleshooting

### Location Not Detected:
1. Check browser console for errors
2. Verify HTTPS is enabled (required for geolocation)
3. Test with different browsers
4. Check if location services are enabled

### Wrong Pincode Detected:
1. Try detecting again (GPS accuracy varies)
2. Check if you're near pincode boundaries
3. Verify API keys are working
4. Test with different geocoding services

### API Errors:
1. Check API key validity
2. Verify API quotas/limits
3. Check network connectivity
4. Review browser console for detailed errors

## Future Enhancements

- [ ] Manual location search/selection
- [ ] Location history/favorites
- [ ] Bulk user location updates
- [ ] Location-based analytics
- [ ] Geofencing for delivery areas
- [ ] Integration with warehouse management

## Support

For issues or questions:
1. Check browser console for detailed error messages
2. Verify API key configuration
3. Test with different browsers/devices
4. Review this documentation for troubleshooting steps