import { useState, useEffect } from 'react';
import { VENUE_TYPES } from '../../data/sampleDirectoryData';
import './VenueForm.css';

const INITIAL_STATE = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  latitude: '',
  longitude: '',
  venueType: 'fairgrounds',
  capacity: '',
  indoorOutdoor: 'outdoor',
  notes: '',
  website: '',
  isActive: true
};

export default function VenueForm({ venue, onSave, onCancel }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (venue) {
      setFormData({
        ...INITIAL_STATE,
        ...venue,
        capacity: venue.capacity?.toString() || '',
        latitude: venue.latitude?.toString() || '',
        longitude: venue.longitude?.toString() || ''
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Venue name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    if (formData.latitude && isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'Must be a valid number';
    }
    if (formData.longitude && isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'Must be a valid number';
    }
    if (formData.capacity && isNaN(parseInt(formData.capacity))) {
      newErrors.capacity = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const venueData = {
      ...formData,
      id: venue?.id || `venue-${Date.now()}`,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null
    };

    onSave(venueData);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{venue ? 'Edit Venue' : 'Add New Venue'}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-group">
            <label htmlFor="name">Venue Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="e.g., Pine Valley Fairgrounds"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="venueType">Venue Type</label>
              <select
                id="venueType"
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
              >
                {VENUE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="indoorOutdoor">Indoor/Outdoor</label>
              <select
                id="indoorOutdoor"
                name="indoorOutdoor"
                value={formData.indoorOutdoor}
                onChange={handleChange}
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 1234 Timber Lane"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
                placeholder="e.g., Flagstaff"
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
                placeholder="e.g., AZ"
                maxLength={2}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="e.g., 86001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={errors.capacity ? 'error' : ''}
                placeholder="e.g., 5000"
              />
              {errors.capacity && <span className="error-text">{errors.capacity}</span>}
            </div>
          </div>

          {/* Coordinates */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className={errors.latitude ? 'error' : ''}
                placeholder="e.g., 35.1983"
              />
              {errors.latitude && <span className="error-text">{errors.latitude}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className={errors.longitude ? 'error' : ''}
                placeholder="e.g., -111.6513"
              />
              {errors.longitude && <span className="error-text">{errors.longitude}</span>}
            </div>
          </div>

          {/* Website */}
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special notes about this venue..."
            />
          </div>

          {/* Active Status */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active venue (available for bookings)
            </label>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {venue ? 'Save Changes' : 'Add Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
