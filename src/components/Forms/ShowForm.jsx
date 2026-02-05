import { useState, useEffect, useMemo } from 'react';
import { TOURS } from '../../data/sampleData';
import { validateVenue, validateContact } from '../../utils/validation';
import './ShowForm.css';

const emptyShow = {
  tour: TOURS.RED_TEAM,
  venueId: '',
  contactId: '',
  startDate: '',
  endDate: '',
  showTime: '',
  performanceFee: '',
  merchandiseSales: '',
  materialsUsed: '',
  expenses: '',
  notes: ''
};

const emptyVenue = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  latitude: '',
  longitude: '',
  venueType: 'festival',
  capacity: '',
  indoorOutdoor: 'outdoor',
  notes: '',
  website: '',
  isActive: true
};

const emptyContact = {
  firstName: '',
  lastName: '',
  role: 'Event Coordinator',
  phone: '',
  email: '',
  isPrimary: true,
  notes: ''
};

export default function ShowForm({
  show,
  onSave,
  onCancel,
  venues = [],
  contacts = [],
  onAddVenue,
  onAddContact,
  employees = [],
  getShowAssignments,
  onUpdateShowAssignments
}) {
  const [formData, setFormData] = useState(emptyShow);
  const [errors, setErrors] = useState({});
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState([]);

  // Venue/Contact creation modes
  const [venueMode, setVenueMode] = useState('select'); // 'select' or 'create'
  const [contactMode, setContactMode] = useState('select'); // 'select' or 'create'
  const [newVenue, setNewVenue] = useState(emptyVenue);
  const [newContact, setNewContact] = useState(emptyContact);

  const isEditing = !!show?.id;

  // Get selected venue and its contacts
  const selectedVenue = useMemo(() => {
    return venues.find(v => v.id === formData.venueId);
  }, [venues, formData.venueId]);

  const venueContacts = useMemo(() => {
    if (!formData.venueId) return contacts.filter(c => !c.venueId); // Independent contacts only
    return contacts.filter(c => c.venueId === formData.venueId || !c.venueId);
  }, [contacts, formData.venueId]);

  const selectedContact = useMemo(() => {
    return contacts.find(c => c.id === formData.contactId);
  }, [contacts, formData.contactId]);

  // Sort venues alphabetically
  const sortedVenues = useMemo(() => {
    return [...venues].sort((a, b) => a.name.localeCompare(b.name));
  }, [venues]);

  useEffect(() => {
    if (show) {
      setFormData({
        ...emptyShow,
        ...show,
        venueId: show.venueId || '',
        contactId: show.contactId || '',
        performanceFee: show.performanceFee || '',
        merchandiseSales: show.merchandiseSales || '',
        materialsUsed: show.materialsUsed || '',
        expenses: show.expenses || ''
      });
      setVenueMode('select');
      setContactMode('select');
      // Load existing employee assignments
      if (getShowAssignments && show.id) {
        const assignments = getShowAssignments(show.id);
        setAssignedEmployeeIds(assignments.map(a => a.employeeId));
      }
    } else {
      setFormData(emptyShow);
      setNewVenue(emptyVenue);
      setNewContact(emptyContact);
      setAssignedEmployeeIds([]);
    }
  }, [show, getShowAssignments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleVenueSelect = (e) => {
    const venueId = e.target.value;
    if (venueId === '__create__') {
      setVenueMode('create');
      setFormData(prev => ({ ...prev, venueId: '', contactId: '' }));
    } else {
      setVenueMode('select');
      setFormData(prev => ({ ...prev, venueId, contactId: '' }));
      // Auto-select primary contact if available
      const primaryContact = contacts.find(c => c.venueId === venueId && c.isPrimary);
      if (primaryContact) {
        setFormData(prev => ({ ...prev, contactId: primaryContact.id }));
      }
    }
  };

  const handleContactSelect = (e) => {
    const contactId = e.target.value;
    if (contactId === '__create__') {
      setContactMode('create');
      setFormData(prev => ({ ...prev, contactId: '' }));
    } else {
      setContactMode('select');
      setFormData(prev => ({ ...prev, contactId }));
    }
  };

  const handleNewVenueChange = (e) => {
    const { name, value } = e.target;
    setNewVenue(prev => ({ ...prev, [name]: value }));
  };

  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeToggle = (employeeId) => {
    setAssignedEmployeeIds(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Filter active employees, sorted by team and name
  const activeEmployees = useMemo(() => {
    return employees
      .filter(e => e.isActive)
      .sort((a, b) => {
        // Sort by team first (red, blue, flex), then by name
        const teamOrder = { red: 1, blue: 2, flex: 3 };
        const teamDiff = (teamOrder[a.team] || 4) - (teamOrder[b.team] || 4);
        if (teamDiff !== 0) return teamDiff;
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      });
  }, [employees]);

  const validate = () => {
    const newErrors = {};

    // Venue validation
    if (venueMode === 'select' && !formData.venueId) {
      newErrors.venueId = 'Please select a venue or create a new one';
    }
    if (venueMode === 'create') {
      const venueValidation = validateVenue(newVenue, venues);
      if (!venueValidation.isValid) {
        if (venueValidation.errors.name) newErrors.venueName = venueValidation.errors.name;
        if (venueValidation.errors.city) newErrors.venueCity = venueValidation.errors.city;
        if (venueValidation.errors.state) newErrors.venueState = venueValidation.errors.state;
        if (venueValidation.errors.duplicate) newErrors.venueDuplicate = venueValidation.errors.duplicate;
        if (venueValidation.errors.latitude) newErrors.venueLatitude = venueValidation.errors.latitude;
        if (venueValidation.errors.longitude) newErrors.venueLongitude = venueValidation.errors.longitude;
      }
    }

    // Contact validation (if creating new)
    if (contactMode === 'create' && newContact.name) {
      const contactValidation = validateContact(
        { ...newContact, name: `${newContact.firstName} ${newContact.lastName}`.trim() },
        contacts
      );
      if (contactValidation.errors.email) newErrors.contactEmail = contactValidation.errors.email;
      if (contactValidation.errors.phone) newErrors.contactPhone = contactValidation.errors.phone;
    }

    // Show validation
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.performanceFee && formData.performanceFee !== 0) {
      newErrors.performanceFee = 'Performance fee is required';
    }

    // Numeric validation - check for negative values
    if (formData.performanceFee && parseFloat(formData.performanceFee) < 0) {
      newErrors.performanceFee = 'Performance fee cannot be negative';
    }
    if (formData.merchandiseSales && parseFloat(formData.merchandiseSales) < 0) {
      newErrors.merchandiseSales = 'Merchandise sales cannot be negative';
    }
    if (formData.materialsUsed && parseFloat(formData.materialsUsed) < 0) {
      newErrors.materialsUsed = 'Materials used cannot be negative';
    }
    if (formData.expenses && parseFloat(formData.expenses) < 0) {
      newErrors.expenses = 'Expenses cannot be negative';
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    let venueId = formData.venueId;
    let contactId = formData.contactId;

    // Create new venue if needed
    if (venueMode === 'create' && onAddVenue) {
      const createdVenue = onAddVenue({
        ...newVenue,
        latitude: parseFloat(newVenue.latitude) || 0,
        longitude: parseFloat(newVenue.longitude) || 0,
        capacity: parseInt(newVenue.capacity) || 0
      });
      venueId = createdVenue.id;
    }

    // Create new contact if needed
    if (contactMode === 'create' && onAddContact) {
      const createdContact = onAddContact({
        ...newContact,
        venueId: venueId || null
      });
      contactId = createdContact.id;
    }

    // Build the show object
    const showId = show?.id || `show-${Date.now()}`;
    const savedShow = {
      ...formData,
      id: showId,
      venueId,
      contactId: contactId || null,
      endDate: formData.endDate || formData.startDate,
      performanceFee: parseFloat(formData.performanceFee) || 0,
      merchandiseSales: parseFloat(formData.merchandiseSales) || 0,
      materialsUsed: parseFloat(formData.materialsUsed) || 0,
      expenses: parseFloat(formData.expenses) || 0
    };

    // Update employee assignments
    if (onUpdateShowAssignments) {
      onUpdateShowAssignments(showId, assignedEmployeeIds);
    }

    onSave(savedShow);
  };

  return (
    <div className="show-form-overlay">
      <div className="show-form-modal">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Show' : 'Add New Show'}</h2>
          <button type="button" className="close-btn" onClick={onCancel}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="show-form">
          {/* Tour Selection */}
          <div className="form-section">
            <h3>Tour Assignment</h3>
            <div className="form-row">
              <label className="form-field">
                <span>Tour</span>
                <select name="tour" value={formData.tour} onChange={handleChange}>
                  <option value={TOURS.RED_TEAM}>{TOURS.RED_TEAM}</option>
                  <option value={TOURS.BLUE_TEAM}>{TOURS.BLUE_TEAM}</option>
                </select>
              </label>
            </div>
          </div>

          {/* Venue Selection */}
          <div className="form-section">
            <h3>Venue</h3>
            <div className="form-row">
              <label className={`form-field ${errors.venueId ? 'error' : ''}`}>
                <span>Select Venue *</span>
                <select
                  value={venueMode === 'create' ? '__create__' : formData.venueId}
                  onChange={handleVenueSelect}
                >
                  <option value="">-- Select a venue --</option>
                  {sortedVenues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.city}, {venue.state}
                    </option>
                  ))}
                  <option value="__create__">+ Add New Venue...</option>
                </select>
                {errors.venueId && <span className="error-msg">{errors.venueId}</span>}
              </label>
            </div>

            {/* Selected venue info */}
            {venueMode === 'select' && selectedVenue && (
              <div className="venue-info-card">
                <div className="venue-info-header">
                  <strong>{selectedVenue.name}</strong>
                  <span className="venue-type-badge">{selectedVenue.venueType}</span>
                </div>
                <p>{selectedVenue.address}</p>
                <p>{selectedVenue.city}, {selectedVenue.state} {selectedVenue.zip}</p>
                {selectedVenue.capacity > 0 && (
                  <p className="venue-capacity">Capacity: {selectedVenue.capacity.toLocaleString()}</p>
                )}
              </div>
            )}

            {/* New venue form */}
            {venueMode === 'create' && (
              <div className="new-item-form">
                <div className="form-row">
                  <label className={`form-field ${errors.venueName ? 'error' : ''}`}>
                    <span>Venue Name *</span>
                    <input
                      type="text"
                      name="name"
                      value={newVenue.name}
                      onChange={handleNewVenueChange}
                      placeholder="e.g., Pine Valley Fairgrounds"
                    />
                    {errors.venueName && <span className="error-msg">{errors.venueName}</span>}
                  </label>
                </div>
                <div className="form-row">
                  <label className="form-field">
                    <span>Address</span>
                    <input
                      type="text"
                      name="address"
                      value={newVenue.address}
                      onChange={handleNewVenueChange}
                      placeholder="Street address"
                    />
                  </label>
                </div>
                <div className="form-row three-col">
                  <label className={`form-field ${errors.venueCity ? 'error' : ''}`}>
                    <span>City *</span>
                    <input
                      type="text"
                      name="city"
                      value={newVenue.city}
                      onChange={handleNewVenueChange}
                    />
                    {errors.venueCity && <span className="error-msg">{errors.venueCity}</span>}
                  </label>
                  <label className={`form-field ${errors.venueState ? 'error' : ''}`}>
                    <span>State *</span>
                    <input
                      type="text"
                      name="state"
                      value={newVenue.state}
                      onChange={handleNewVenueChange}
                      maxLength={2}
                      placeholder="WI"
                    />
                    {errors.venueState && <span className="error-msg">{errors.venueState}</span>}
                  </label>
                  <label className="form-field">
                    <span>ZIP</span>
                    <input
                      type="text"
                      name="zip"
                      value={newVenue.zip}
                      onChange={handleNewVenueChange}
                    />
                  </label>
                </div>
                <div className="form-row two-col">
                  <label className="form-field">
                    <span>Latitude</span>
                    <input
                      type="number"
                      name="latitude"
                      value={newVenue.latitude}
                      onChange={handleNewVenueChange}
                      step="0.0001"
                      placeholder="e.g., 46.0130"
                    />
                  </label>
                  <label className="form-field">
                    <span>Longitude</span>
                    <input
                      type="number"
                      name="longitude"
                      value={newVenue.longitude}
                      onChange={handleNewVenueChange}
                      step="0.0001"
                      placeholder="e.g., -91.4846"
                    />
                  </label>
                </div>
                <div className="form-row two-col">
                  <label className="form-field">
                    <span>Venue Type</span>
                    <select name="venueType" value={newVenue.venueType} onChange={handleNewVenueChange}>
                      <option value="fairgrounds">Fairgrounds</option>
                      <option value="arena">Arena</option>
                      <option value="amphitheater">Amphitheater</option>
                      <option value="festival">Festival</option>
                      <option value="expo">Expo Center</option>
                      <option value="park">Park</option>
                      <option value="private">Private Event</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>Capacity</span>
                    <input
                      type="number"
                      name="capacity"
                      value={newVenue.capacity}
                      onChange={handleNewVenueChange}
                      min="0"
                      placeholder="e.g., 5000"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="btn-cancel-create"
                  onClick={() => {
                    setVenueMode('select');
                    setNewVenue(emptyVenue);
                  }}
                >
                  Cancel - Select Existing Venue
                </button>
              </div>
            )}
          </div>

          {/* Contact Selection */}
          <div className="form-section">
            <h3>Contact</h3>
            <div className="form-row">
              <label className="form-field">
                <span>Select Contact</span>
                <select
                  value={contactMode === 'create' ? '__create__' : formData.contactId}
                  onChange={handleContactSelect}
                >
                  <option value="">-- No contact selected --</option>
                  {venueContacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} - {contact.role}
                      {contact.isPrimary && ' (Primary)'}
                      {!contact.venueId && ' [Independent]'}
                    </option>
                  ))}
                  <option value="__create__">+ Add New Contact...</option>
                </select>
              </label>
            </div>

            {/* Selected contact info */}
            {contactMode === 'select' && selectedContact && (
              <div className="contact-info-card">
                <strong>{selectedContact.firstName} {selectedContact.lastName}</strong>
                <span className="contact-role">{selectedContact.role}</span>
                {selectedContact.phone && <p>{selectedContact.phone}</p>}
                {selectedContact.email && <p>{selectedContact.email}</p>}
              </div>
            )}

            {/* New contact form */}
            {contactMode === 'create' && (
              <div className="new-item-form">
                <div className="form-row two-col">
                  <label className="form-field">
                    <span>First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={newContact.firstName}
                      onChange={handleNewContactChange}
                    />
                  </label>
                  <label className="form-field">
                    <span>Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={newContact.lastName}
                      onChange={handleNewContactChange}
                    />
                  </label>
                </div>
                <div className="form-row two-col">
                  <label className="form-field">
                    <span>Role</span>
                    <select name="role" value={newContact.role} onChange={handleNewContactChange}>
                      <option value="Event Coordinator">Event Coordinator</option>
                      <option value="Venue Director">Venue Director</option>
                      <option value="Entertainment Director">Entertainment Director</option>
                      <option value="Festival Director">Festival Director</option>
                      <option value="Fair Manager">Fair Manager</option>
                      <option value="Events Manager">Events Manager</option>
                      <option value="Talent Agent">Talent Agent</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={newContact.phone}
                      onChange={handleNewContactChange}
                      placeholder="(555) 555-5555"
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label className="form-field">
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={newContact.email}
                      onChange={handleNewContactChange}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="btn-cancel-create"
                  onClick={() => {
                    setContactMode('select');
                    setNewContact(emptyContact);
                  }}
                >
                  Cancel - Select Existing Contact
                </button>
              </div>
            )}
          </div>

          {/* Employee Assignment */}
          {employees.length > 0 && (
            <div className="form-section">
              <h3>Assigned Crew ({assignedEmployeeIds.length} selected)</h3>
              <p className="section-hint">Select team members working this show. Multi-day shows count each day for their work history.</p>
              <div className="employee-assignment-grid">
                {activeEmployees.map(emp => {
                  const isAssigned = assignedEmployeeIds.includes(emp.id);
                  const teamColors = { red: '#c62828', blue: '#1565c0', flex: '#7b1fa2' };
                  return (
                    <label
                      key={emp.id}
                      className={`employee-assignment-item ${isAssigned ? 'assigned' : ''}`}
                      style={{ borderLeftColor: teamColors[emp.team] || '#757575' }}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleEmployeeToggle(emp.id)}
                      />
                      <div className="employee-assignment-info">
                        <span className="employee-assignment-name">
                          {emp.firstName} {emp.lastName}
                        </span>
                        <span className="employee-assignment-role">
                          {emp.role} • {emp.team.charAt(0).toUpperCase() + emp.team.slice(1)} Team
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Show Details */}
          <div className="form-section">
            <h3>Show Details</h3>
            <div className="form-row two-col">
              <label className={`form-field ${errors.startDate ? 'error' : ''}`}>
                <span>Start Date *</span>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <span className="error-msg">{errors.startDate}</span>}
              </label>
              <label className={`form-field ${errors.endDate ? 'error' : ''}`}>
                <span>End Date</span>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                />
                {errors.endDate && <span className="error-msg">{errors.endDate}</span>}
                <span className="field-hint">Leave blank for single-day shows</span>
              </label>
            </div>
            <div className="form-row two-col">
              <label className="form-field">
                <span>Show Time</span>
                <input
                  type="time"
                  name="showTime"
                  value={formData.showTime}
                  onChange={handleChange}
                />
              </label>
              <label className={`form-field ${errors.performanceFee ? 'error' : ''}`}>
                <span>Performance Fee *</span>
                <input
                  type="number"
                  name="performanceFee"
                  value={formData.performanceFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.performanceFee && <span className="error-msg">{errors.performanceFee}</span>}
              </label>
            </div>
          </div>

          {/* Financials */}
          <div className="form-section">
            <h3>Financials</h3>
            <div className="form-row three-col">
              <label className="form-field">
                <span>Merchandise Sales</span>
                <input
                  type="number"
                  name="merchandiseSales"
                  value={formData.merchandiseSales}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </label>
              <label className="form-field">
                <span>Materials Used</span>
                <input
                  type="number"
                  name="materialsUsed"
                  value={formData.materialsUsed}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </label>
              <label className="form-field">
                <span>Other Expenses</span>
                <input
                  type="number"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h3>Notes</h3>
            <div className="form-row">
              <label className="form-field">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any additional notes about this show booking..."
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Save Changes' : 'Add Show'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
