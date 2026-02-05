import { memo, forwardRef, useState } from 'react';
import {
  PERFORMANCE_EVENTS,
  OTHER_SKILLS,
  CERTIFICATION_TYPES,
  EMPLOYMENT_TYPES,
  TEAM_ASSIGNMENTS,
  EMPLOYEE_ROLES
} from '../../data/sampleEmployeeData';
import './EmployeeCard.css';

const EmployeeCard = forwardRef(function EmployeeCard({
  employee,
  isExpanded,
  daysWorked = 0,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleEmploymentType
}, ref) {
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  const employmentType = EMPLOYMENT_TYPES.find(t => t.value === employee.employmentType);
  const team = TEAM_ASSIGNMENTS.find(t => t.value === employee.team);
  const role = EMPLOYEE_ROLES.find(r => r.value === employee.role);

  // Count active events and skills
  const eventCount = Object.values(employee.events || {}).filter(Boolean).length;
  const skillCount = Object.values(employee.skills || {}).filter(Boolean).length;

  // Check for expiring/expired certifications
  const certStatus = getCertificationStatus(employee.certifications);

  // Format compensation
  const compensation = employee.employmentType === 'full_time'
    ? `$${(employee.annualSalary || 0).toLocaleString()}/yr`
    : `$${employee.dayRate || 0}/day`;

  return (
    <div
      ref={ref}
      className={`employee-card ${isExpanded ? 'expanded' : ''} ${!employee.isActive ? 'inactive' : ''}`}
    >
      {/* Header - Always Visible */}
      <div className="employee-card-header" onClick={() => onToggleExpand(employee.id)}>
        <div className="employee-avatar">
          <img
            src={employee.photoUrl || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=2e7d32&color=fff&size=64`}
            alt={`${employee.firstName} ${employee.lastName}`}
          />
          {!employee.isActive && <span className="inactive-badge">Inactive</span>}
        </div>

        <div className="employee-main-info">
          <h3>{employee.firstName} {employee.lastName}</h3>
          <div className="employee-role">{role?.label || employee.role}</div>
          <div className="employee-location">{employee.homeLocation}</div>
        </div>

        <div className="employee-badges">
          <span
            className="employment-badge"
            style={{ backgroundColor: employmentType?.color || '#757575' }}
          >
            {employmentType?.label || employee.employmentType}
          </span>
          <span
            className="team-badge"
            style={{ backgroundColor: team?.color || '#757575' }}
          >
            {team?.label || employee.team}
          </span>
        </div>

        <div className="employee-quick-stats">
          <div className="stat">
            <span className="stat-value">{daysWorked}</span>
            <span className="stat-label">Days</span>
          </div>
          <div className="stat">
            <span className="stat-value">{compensation}</span>
            <span className="stat-label">Pay</span>
          </div>
        </div>

        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {/* Body - Expanded Details */}
      {isExpanded && (
        <div className="employee-card-body">
          {/* Contact Info */}
          <div className="employee-section">
            <h4>Contact Information</h4>
            <div className="contact-grid">
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <a href={`tel:${employee.phone}`}>{employee.phone}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <a href={`mailto:${employee.email}`}>{employee.email}</a>
              </div>
              {employee.emergencyContact?.name && (
                <div className="contact-item emergency">
                  <span className="contact-icon">🚨</span>
                  <div>
                    <strong>Emergency:</strong> {employee.emergencyContact.name}
                    <br />
                    <a href={`tel:${employee.emergencyContact.phone}`}>
                      {employee.emergencyContact.phone}
                    </a>
                    <span className="relationship">({employee.emergencyContact.relationship})</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employment Details */}
          <div className="employee-section">
            <h4>Employment Details</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">
                  {employee.startDate ? new Date(employee.startDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type</span>
                <span className="detail-value">{employmentType?.label}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Compensation</span>
                <span className="detail-value compensation">{compensation}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team</span>
                <span className="detail-value">{team?.label}</span>
              </div>
            </div>
          </div>

          {/* Skills Checklist - Collapsible */}
          <div className="employee-section skills-section">
            <h4
              className="collapsible-header"
              onClick={(e) => {
                e.stopPropagation();
                setSkillsExpanded(!skillsExpanded);
              }}
            >
              Skills & Events ({eventCount} events, {skillCount} skills)
              <span className={`collapse-icon ${skillsExpanded ? 'expanded' : ''}`}>▼</span>
            </h4>

            {skillsExpanded && (
              <div className="skills-content">
                {/* Performance Events */}
                <div className="skills-group">
                  <h5>Performance Events</h5>
                  <div className="skills-grid">
                    {PERFORMANCE_EVENTS.map(event => (
                      <div
                        key={event.id}
                        className={`skill-item ${employee.events?.[event.id] ? 'active' : 'inactive'}`}
                      >
                        <span className="skill-icon">{event.icon}</span>
                        <span className="skill-label">{event.label}</span>
                        <span className="skill-status">
                          {employee.events?.[event.id] ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Skills */}
                <div className="skills-group">
                  <h5>Other Skills</h5>
                  <div className="skills-grid">
                    {OTHER_SKILLS.map(skill => (
                      <div
                        key={skill.id}
                        className={`skill-item ${employee.skills?.[skill.id] ? 'active' : 'inactive'}`}
                      >
                        <span className="skill-icon">{skill.icon}</span>
                        <span className="skill-label">{skill.label}</span>
                        <span className="skill-status">
                          {employee.skills?.[skill.id] ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="employee-section">
            <h4>
              Certifications
              {certStatus.hasIssues && (
                <span className={`cert-alert ${certStatus.hasExpired ? 'expired' : 'warning'}`}>
                  {certStatus.hasExpired ? '⚠️ Expired' : '⏰ Expiring Soon'}
                </span>
              )}
            </h4>
            <div className="certifications-grid">
              {CERTIFICATION_TYPES.map(cert => {
                const empCert = employee.certifications?.[cert.id];
                const status = empCert?.certified
                  ? getCertDateStatus(empCert.expirationDate)
                  : 'none';

                return (
                  <div
                    key={cert.id}
                    className={`cert-item ${status}`}
                  >
                    <span className="cert-icon">{cert.icon}</span>
                    <div className="cert-info">
                      <span className="cert-label">{cert.label}</span>
                      {empCert?.certified ? (
                        <span className="cert-date">
                          Exp: {empCert.expirationDate
                            ? new Date(empCert.expirationDate).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      ) : (
                        <span className="cert-date not-certified">Not Certified</span>
                      )}
                    </div>
                    <span className="cert-status-icon">
                      {empCert?.certified ? (status === 'expired' ? '❌' : status === 'expiring' ? '⚠️' : '✓') : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="employee-section">
              <h4>Notes</h4>
              <p className="employee-notes">{employee.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="employee-actions">
            <button
              className="btn-action btn-promote"
              onClick={(e) => {
                e.stopPropagation();
                onToggleEmploymentType(employee.id);
              }}
            >
              {employee.employmentType === 'full_time' ? '📉 Demote to Day Rate' : '📈 Promote to Full-Time'}
            </button>
            <button
              className="btn-action btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(employee);
              }}
            >
              ✏️ Edit
            </button>
            <button
              className="btn-action btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(employee);
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Helper to check certification status
function getCertificationStatus(certifications) {
  if (!certifications) return { hasIssues: false, hasExpired: false };

  const today = new Date();
  const sixtyDaysOut = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  let hasExpired = false;
  let hasExpiring = false;

  Object.values(certifications).forEach(cert => {
    if (cert.certified && cert.expirationDate) {
      const expDate = new Date(cert.expirationDate);
      if (expDate < today) hasExpired = true;
      else if (expDate < sixtyDaysOut) hasExpiring = true;
    }
  });

  return { hasIssues: hasExpired || hasExpiring, hasExpired, hasExpiring };
}

function getCertDateStatus(dateStr) {
  if (!dateStr) return 'valid';
  const today = new Date();
  const expDate = new Date(dateStr);
  const sixtyDaysOut = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  if (expDate < today) return 'expired';
  if (expDate < sixtyDaysOut) return 'expiring';
  return 'valid';
}

export default memo(EmployeeCard, (prevProps, nextProps) => {
  return (
    prevProps.employee === nextProps.employee &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.daysWorked === nextProps.daysWorked
  );
});
