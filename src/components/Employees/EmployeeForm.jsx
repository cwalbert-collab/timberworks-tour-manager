import { useState, useEffect } from 'react';
import {
  EMPLOYMENT_TYPES,
  TEAM_ASSIGNMENTS,
  EMPLOYEE_ROLES,
  PERFORMANCE_EVENTS,
  OTHER_SKILLS,
  CERTIFICATION_TYPES,
  getEmptyEmployee
} from '../../data/sampleEmployeeData';
import './EmployeeForm.css';

export default function EmployeeForm({ employee, onSave, onClose }) {
  const [formData, setFormData] = useState(getEmptyEmployee());
  const [errors, setErrors] = useState({});

  // Initialize form with employee data or empty
  useEffect(() => {
    if (employee) {
      setFormData({ ...getEmptyEmployee(), ...employee });
    } else {
      setFormData(getEmptyEmployee());
    }
    setErrors({});
  }, [employee]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleEventToggle = (eventId) => {
    setFormData(prev => ({
      ...prev,
      events: { ...prev.events, [eventId]: !prev.events[eventId] }
    }));
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skillId]: !prev.skills[skillId] }
    }));
  };

  const handleCertChange = (certId, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        [certId]: {
          ...prev.certifications[certId],
          [field]: field === 'certified' ? value : value
        }
      }
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (formData.employmentType === 'full_time' && !formData.annualSalary) {
      newErrors.annualSalary = 'Annual salary is required for full-time employees';
    }
    if (formData.employmentType === 'day_rate' && !formData.dayRate) {
      newErrors.dayRate = 'Day rate is required for day-rate employees';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Clean up data before saving
    const cleanedData = {
      ...formData,
      annualSalary: formData.employmentType === 'full_time'
        ? parseFloat(formData.annualSalary) || null
        : null,
      dayRate: formData.employmentType === 'day_rate'
        ? parseFloat(formData.dayRate) || null
        : null,
      // Generate placeholder avatar if none provided
      photoUrl: formData.photoUrl ||
        `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=2e7d32&color=fff&size=128`
    };

    onSave(cleanedData);
  };

  const isEditing = !!employee;

  return (
    <div className="employee-form-overlay" onClick={onClose}>
      <div className="employee-form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row two-col">
              <div className={`form-field ${errors.firstName ? 'error' : ''}`}>
                <span>First Name *</span>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
                {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
              </div>
              <div className={`form-field ${errors.lastName ? 'error' : ''}`}>
                <span>Last Name *</span>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
                {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row two-col">
              <div className={`form-field ${errors.email ? 'error' : ''}`}>
                <span>Email *</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className={`form-field ${errors.phone ? 'error' : ''}`}>
                <span>Phone *</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 555-5555"
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <span>Home Location</span>
                <input
                  type="text"
                  value={formData.homeLocation}
                  onChange={(e) => handleChange('homeLocation', e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <span>Photo URL (optional)</span>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => handleChange('photoUrl', e.target.value)}
                  placeholder="https://... (leave blank for auto-generated avatar)"
                />
                <span className="field-hint">Leave blank to use an auto-generated avatar</span>
              </div>
            </div>
          </div>

          {/* Employment Section */}
          <div className="form-section">
            <h3>Employment</h3>
            <div className="form-row three-col">
              <div className="form-field">
                <span>Employment Type</span>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                >
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <span>Role</span>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  {EMPLOYEE_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <span>Team</span>
                <select
                  value={formData.team}
                  onChange={(e) => handleChange('team', e.target.value)}
                >
                  {TEAM_ASSIGNMENTS.map(team => (
                    <option key={team.value} value={team.value}>{team.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row three-col">
              {formData.employmentType === 'full_time' ? (
                <div className={`form-field ${errors.annualSalary ? 'error' : ''}`}>
                  <span>Annual Salary *</span>
                  <input
                    type="number"
                    value={formData.annualSalary || ''}
                    onChange={(e) => handleChange('annualSalary', e.target.value)}
                    placeholder="45000"
                    step="1000"
                    min="0"
                  />
                  {errors.annualSalary && <span className="error-msg">{errors.annualSalary}</span>}
                </div>
              ) : (
                <div className={`form-field ${errors.dayRate ? 'error' : ''}`}>
                  <span>Day Rate *</span>
                  <input
                    type="number"
                    value={formData.dayRate || ''}
                    onChange={(e) => handleChange('dayRate', e.target.value)}
                    placeholder="250"
                    step="25"
                    min="0"
                  />
                  {errors.dayRate && <span className="error-msg">{errors.dayRate}</span>}
                </div>
              )}
              <div className="form-field">
                <span>Start Date</span>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              <div className="form-field">
                <span>Status</span>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleChange('isActive', e.target.value === 'active')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="form-section">
            <h3>Emergency Contact</h3>
            <div className="form-row three-col">
              <div className="form-field">
                <span>Contact Name</span>
                <input
                  type="text"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="form-field">
                <span>Contact Phone</span>
                <input
                  type="tel"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                  placeholder="(555) 555-5555"
                />
              </div>
              <div className="form-field">
                <span>Relationship</span>
                <input
                  type="text"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                  placeholder="Spouse, Parent, etc."
                />
              </div>
            </div>
          </div>

          {/* Performance Events Section */}
          <div className="form-section">
            <h3>Performance Events</h3>
            <p className="section-hint">Check all events this employee can perform</p>
            <div className="checkbox-grid">
              {PERFORMANCE_EVENTS.map(event => (
                <label key={event.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.events?.[event.id] || false}
                    onChange={() => handleEventToggle(event.id)}
                  />
                  <span className="checkbox-icon">{event.icon}</span>
                  <span className="checkbox-label">{event.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Other Skills Section */}
          <div className="form-section">
            <h3>Other Skills</h3>
            <p className="section-hint">Check all applicable skills</p>
            <div className="checkbox-grid">
              {OTHER_SKILLS.map(skill => (
                <label key={skill.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.skills?.[skill.id] || false}
                    onChange={() => handleSkillToggle(skill.id)}
                  />
                  <span className="checkbox-icon">{skill.icon}</span>
                  <span className="checkbox-label">{skill.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="form-section">
            <h3>Certifications</h3>
            <p className="section-hint">Track certifications and their expiration dates</p>
            <div className="certifications-form-grid">
              {CERTIFICATION_TYPES.map(cert => (
                <div key={cert.id} className="certification-row">
                  <label className="cert-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.certifications?.[cert.id]?.certified || false}
                      onChange={(e) => handleCertChange(cert.id, 'certified', e.target.checked)}
                    />
                    <span className="cert-icon">{cert.icon}</span>
                    <span className="cert-name">{cert.label}</span>
                  </label>
                  {formData.certifications?.[cert.id]?.certified && (
                    <div className="cert-expiration">
                      <span>Expires:</span>
                      <input
                        type="date"
                        value={formData.certifications?.[cert.id]?.expirationDate || ''}
                        onChange={(e) => handleCertChange(cert.id, 'expirationDate', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="form-section">
            <h3>Notes</h3>
            <div className="form-row">
              <div className="form-field">
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional notes about this employee..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
