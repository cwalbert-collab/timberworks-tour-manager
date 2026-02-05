import { useState, useEffect } from 'react';
import { CONTACT_ROLES, RELATIONSHIP_STRENGTHS } from '../../data/sampleDirectoryData';
import './ContactForm.css';

const INITIAL_STATE = {
  venueId: '',
  firstName: '',
  lastName: '',
  role: 'Event Coordinator',
  relationshipStrength: 'new',
  phone: '',
  email: '',
  isPrimary: false,
  notes: '',
  followUpDate: ''
};

export default function ContactForm({ contact, venues, onSave, onCancel }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        ...INITIAL_STATE,
        ...contact,
        venueId: contact.venueId || ''
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [contact]);

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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const contactData = {
      ...formData,
      id: contact?.id || `contact-${Date.now()}`,
      venueId: formData.venueId || null
    };

    onSave(contactData);
  };

  // Sort venues alphabetically
  const sortedVenues = [...venues].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Venue Association */}
          <div className="form-group">
            <label htmlFor="venueId">Associated Venue</label>
            <select
              id="venueId"
              name="venueId"
              value={formData.venueId}
              onChange={handleChange}
            >
              <option value="">-- Independent (No Venue) --</option>
              {sortedVenues.map(venue => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} ({venue.city}, {venue.state})
                </option>
              ))}
            </select>
            <span className="helper-text">
              Leave blank for independent contacts like agents or suppliers
            </span>
          </div>

          {/* Name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="e.g., Sarah"
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="e.g., Mitchell"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          {/* Role and Relationship Strength */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                {CONTACT_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="relationshipStrength">Relationship Strength</label>
              <select
                id="relationshipStrength"
                name="relationshipStrength"
                value={formData.relationshipStrength}
                onChange={handleChange}
                className="relationship-select"
              >
                {RELATIONSHIP_STRENGTHS.map(strength => (
                  <option key={strength.value} value={strength.value}>
                    {strength.label}
                  </option>
                ))}
              </select>
              <span className="helper-text">
                How strong is your relationship with this contact?
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="email@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
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
              placeholder="Any notes about this contact..."
            />
          </div>

          {/* Follow-up Reminder */}
          <div className="form-group">
            <label htmlFor="followUpDate">Follow-up Reminder</label>
            <div className="follow-up-input">
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={formData.followUpDate || ''}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {formData.followUpDate && (
                <button
                  type="button"
                  className="btn-clear-date"
                  onClick={() => setFormData(prev => ({ ...prev, followUpDate: '' }))}
                  title="Clear reminder"
                >
                  &times;
                </button>
              )}
            </div>
            <span className="helper-text">
              Set a reminder to follow up with this contact
            </span>
          </div>

          {/* Primary Contact */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
              />
              Primary contact for this venue
            </label>
            <span className="helper-text">
              Primary contacts appear first and are highlighted
            </span>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {contact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
