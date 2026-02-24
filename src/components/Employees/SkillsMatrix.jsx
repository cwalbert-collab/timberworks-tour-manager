import { useMemo } from 'react';
import {
  PERFORMANCE_EVENTS,
  OTHER_SKILLS,
  TEAM_ASSIGNMENTS,
  getRoleColor
} from '../../data/sampleEmployeeData';
import './SkillsMatrix.css';

export default function SkillsMatrix({ employees }) {
  // Calculate coverage for each event/skill
  const coverage = useMemo(() => {
    const eventCounts = {};
    const skillCounts = {};

    PERFORMANCE_EVENTS.forEach(e => { eventCounts[e.id] = 0; });
    OTHER_SKILLS.forEach(s => { skillCounts[s.id] = 0; });

    employees.forEach(emp => {
      PERFORMANCE_EVENTS.forEach(event => {
        if (emp.events?.[event.id]) eventCounts[event.id]++;
      });
      OTHER_SKILLS.forEach(skill => {
        if (emp.skills?.[skill.id]) skillCounts[skill.id]++;
      });
    });

    return { events: eventCounts, skills: skillCounts };
  }, [employees]);

  // Identify gaps (events with only 1 or 0 people)
  const eventGaps = PERFORMANCE_EVENTS.filter(e => coverage.events[e.id] <= 1);

  return (
    <div className="skills-matrix">
      {/* Gap Alert */}
      {eventGaps.length > 0 && (
        <div className="gap-alert">
          <h4>⚠️ Coverage Gaps</h4>
          <p>These events have limited coverage (1 or fewer performers):</p>
          <div className="gap-badges">
            {eventGaps.map(event => (
              <span key={event.id} className="gap-badge">
                {event.icon} {event.label} ({coverage.events[event.id]})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Performance Events Matrix */}
      <div className="matrix-section">
        <h3>Performance Events</h3>
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="name-col">Employee</th>
                {PERFORMANCE_EVENTS.map(event => (
                  <th key={event.id} className="skill-col">
                    <div className="skill-header">
                      <span className="skill-icon">{event.icon}</span>
                      <span className="skill-name">{event.label}</span>
                      <span className={`skill-count ${coverage.events[event.id] <= 1 ? 'low' : ''}`}>
                        {coverage.events[event.id]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="name-col">
                    <div className="employee-name-cell">
                      <span
                        className="team-dot"
                        style={{ backgroundColor: getRoleColor(emp) }}
                      />
                      <span className="emp-name">{emp.firstName} {emp.lastName}</span>
                      <span className="emp-role">{emp.role}</span>
                    </div>
                  </td>
                  {PERFORMANCE_EVENTS.map(event => (
                    <td key={event.id} className="skill-col">
                      <span className={`skill-check ${emp.events?.[event.id] ? 'active' : 'inactive'}`}>
                        {emp.events?.[event.id] ? '✓' : '—'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Skills Matrix */}
      <div className="matrix-section">
        <h3>Other Skills</h3>
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="name-col">Employee</th>
                {OTHER_SKILLS.map(skill => (
                  <th key={skill.id} className="skill-col">
                    <div className="skill-header">
                      <span className="skill-icon">{skill.icon}</span>
                      <span className="skill-name">{skill.label}</span>
                      <span className="skill-count">{coverage.skills[skill.id]}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="name-col">
                    <div className="employee-name-cell">
                      <span
                        className="team-dot"
                        style={{ backgroundColor: getRoleColor(emp) }}
                      />
                      <span className="emp-name">{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  {OTHER_SKILLS.map(skill => (
                    <td key={skill.id} className="skill-col">
                      <span className={`skill-check ${emp.skills?.[skill.id] ? 'active' : 'inactive'}`}>
                        {emp.skills?.[skill.id] ? '✓' : '—'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="matrix-summary">
        <div className="summary-card">
          <h4>Team Composition</h4>
          <div className="team-bars">
            {TEAM_ASSIGNMENTS.map(team => {
              const count = employees.filter(e => e.team === team.value).length;
              const pct = employees.length > 0 ? (count / employees.length) * 100 : 0;
              return (
                <div key={team.value} className="team-bar-row">
                  <span className="team-label" style={{ color: team.color }}>
                    {team.label}
                  </span>
                  <div className="team-bar-track">
                    <div
                      className="team-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: team.color }}
                    />
                  </div>
                  <span className="team-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="summary-card">
          <h4>Event Coverage</h4>
          <div className="coverage-grid">
            {PERFORMANCE_EVENTS.map(event => (
              <div
                key={event.id}
                className={`coverage-item ${coverage.events[event.id] <= 1 ? 'low' : coverage.events[event.id] >= 3 ? 'high' : 'medium'}`}
              >
                <span className="coverage-icon">{event.icon}</span>
                <span className="coverage-count">{coverage.events[event.id]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
