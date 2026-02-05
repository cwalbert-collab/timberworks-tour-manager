import { useState, useMemo, useCallback, useRef } from 'react';
import EmployeeCard from './EmployeeCard';
import EmployeeForm from './EmployeeForm';
import SkillsMatrix from './SkillsMatrix';
import {
  EMPLOYMENT_TYPES,
  TEAM_ASSIGNMENTS,
  EMPLOYEE_ROLES
} from '../../data/sampleEmployeeData';
import {
  downloadEmployeeCSV,
  importEmployeesFromFile,
  validateEmployeeImport
} from '../../utils/employeeCsvUtils';
import './EmployeeList.css';

// Sort options
const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name A-Z', key: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Name Z-A', key: 'name', direction: 'desc' },
  { value: 'days_desc', label: 'Most Days Worked', key: 'days', direction: 'desc' },
  { value: 'days_asc', label: 'Fewest Days Worked', key: 'days', direction: 'asc' },
  { value: 'start_asc', label: 'Seniority (Oldest First)', key: 'start', direction: 'asc' },
  { value: 'start_desc', label: 'Newest Hires First', key: 'start', direction: 'desc' },
  { value: 'salary_desc', label: 'Highest Pay', key: 'pay', direction: 'desc' },
  { value: 'salary_asc', label: 'Lowest Pay', key: 'pay', direction: 'asc' }
];

// View modes
const VIEW_MODES = [
  { value: 'cards', label: '📇 Cards', icon: '📇' },
  { value: 'matrix', label: '📊 Skills Matrix', icon: '📊' }
];

export default function EmployeeList({
  employees,
  employeeDaysWorked,
  certificationAlerts,
  metrics,
  onAdd,
  onUpdate,
  onDelete,
  onToggleEmploymentType,
  onImport
}) {
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState('cards');
  const [expandedId, setExpandedId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Import/Export state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importValidation, setImportValidation] = useState(null);
  const fileInputRef = useRef(null);

  const cardRefs = useRef({});

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    const sortOption = SORT_OPTIONS.find(o => o.value === sortBy) || SORT_OPTIONS[0];

    return employees
      .filter(emp => {
        // Status filter
        if (filterStatus === 'active' && !emp.isActive) return false;
        if (filterStatus === 'inactive' && emp.isActive) return false;

        // Team filter
        if (filterTeam !== 'all' && emp.team !== filterTeam) return false;

        // Employment type filter
        if (filterType !== 'all' && emp.employmentType !== filterType) return false;

        // Role filter
        if (filterRole !== 'all' && emp.role !== filterRole) return false;

        // Search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
          const matchesName = fullName.includes(query);
          const matchesEmail = emp.email?.toLowerCase().includes(query);
          const matchesLocation = emp.homeLocation?.toLowerCase().includes(query);
          const matchesRole = emp.role?.toLowerCase().includes(query);
          if (!matchesName && !matchesEmail && !matchesLocation && !matchesRole) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const direction = sortOption.direction === 'asc' ? 1 : -1;

        switch (sortOption.key) {
          case 'name':
            return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) * direction;
          case 'days':
            return ((employeeDaysWorked.get(a.id) || 0) - (employeeDaysWorked.get(b.id) || 0)) * direction;
          case 'start':
            return ((new Date(a.startDate || 0)) - (new Date(b.startDate || 0))) * direction;
          case 'pay':
            const payA = a.employmentType === 'full_time' ? (a.annualSalary || 0) : (a.dayRate || 0) * 200;
            const payB = b.employmentType === 'full_time' ? (b.annualSalary || 0) : (b.dayRate || 0) * 200;
            return (payA - payB) * direction;
          default:
            return 0;
        }
      });
  }, [employees, searchQuery, filterTeam, filterType, filterRole, filterStatus, sortBy, employeeDaysWorked]);

  // Handlers
  const handleToggleExpand = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const handleEdit = useCallback((employee) => {
    setEditingEmployee(employee);
  }, []);

  const handleDelete = useCallback((employee) => {
    setShowDeleteConfirm(employee);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (showDeleteConfirm) {
      onDelete(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
      if (expandedId === showDeleteConfirm.id) {
        setExpandedId(null);
      }
    }
  }, [showDeleteConfirm, onDelete, expandedId]);

  const handleSave = useCallback((employee) => {
    if (editingEmployee) {
      onUpdate({ ...editingEmployee, ...employee });
      setEditingEmployee(null);
    } else {
      onAdd(employee);
      setShowAddForm(false);
    }
  }, [editingEmployee, onUpdate, onAdd]);

  const handleCloseForm = useCallback(() => {
    setEditingEmployee(null);
    setShowAddForm(false);
  }, []);

  // Export handler
  const handleExport = useCallback(() => {
    downloadEmployeeCSV(employees, employeeDaysWorked);
  }, [employees, employeeDaysWorked]);

  // Import handlers
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportData(null);
    setImportValidation(null);

    try {
      const importedEmployees = await importEmployeesFromFile(file);
      const validation = validateEmployeeImport(importedEmployees, employees);

      setImportData(importedEmployees);
      setImportValidation(validation);
      setShowImportModal(true);
    } catch (err) {
      setImportError(err.message);
      setShowImportModal(true);
    }

    // Reset file input
    e.target.value = '';
  }, [employees]);

  const handleImportConfirm = useCallback((mode) => {
    if (importData && onImport) {
      onImport(importData, mode);
    }
    setShowImportModal(false);
    setImportData(null);
    setImportValidation(null);
    setImportError(null);
  }, [importData, onImport]);

  const handleImportCancel = useCallback(() => {
    setShowImportModal(false);
    setImportData(null);
    setImportValidation(null);
    setImportError(null);
  }, []);

  // Count employees by type for summary
  const fullTimeCount = filteredEmployees.filter(e => e.employmentType === 'full_time').length;
  const dayRateCount = filteredEmployees.filter(e => e.employmentType === 'day_rate').length;

  return (
    <div className="employee-list">
      {/* Header with summary */}
      <div className="list-header">
        <div className="list-title">
          <h2>👥 Team Members</h2>
          <div className="summary-badges">
            <span className="summary-badge total">{filteredEmployees.length} shown</span>
            <span className="summary-badge full-time">{fullTimeCount} Full-Time</span>
            <span className="summary-badge day-rate">{dayRateCount} Day-Rate</span>
            {certificationAlerts.length > 0 && (
              <span className="summary-badge alerts">⚠️ {certificationAlerts.length} Cert Alerts</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={handleExport} title="Export to CSV">
            Export CSV
          </button>
          <button className="btn-import" onClick={handleImportClick} title="Import from CSV">
            Import CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <button className="btn-add-employee" onClick={() => setShowAddForm(true)}>
            + Add Employee
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="list-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, location, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="filter-controls">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Team filter */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Teams</option>
            {TEAM_ASSIGNMENTS.map(team => (
              <option key={team.value} value={team.value}>{team.label}</option>
            ))}
          </select>

          {/* Employment type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {EMPLOYMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Role filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            {EMPLOYEE_ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>

        <div className="sort-view-controls">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* View mode */}
          <div className="view-toggle">
            {VIEW_MODES.map(mode => (
              <button
                key={mode.value}
                className={`view-btn ${viewMode === mode.value ? 'active' : ''}`}
                onClick={() => setViewMode(mode.value)}
                title={mode.label}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="list-content">
        {viewMode === 'cards' ? (
          filteredEmployees.length > 0 ? (
            <div className="employee-cards">
              {filteredEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  ref={el => cardRefs.current[employee.id] = el}
                  employee={employee}
                  isExpanded={expandedId === employee.id}
                  daysWorked={employeeDaysWorked.get(employee.id) || 0}
                  onToggleExpand={handleToggleExpand}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleEmploymentType={onToggleEmploymentType}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No employees found matching your filters.</p>
              <button onClick={() => {
                setSearchQuery('');
                setFilterTeam('all');
                setFilterType('all');
                setFilterRole('all');
                setFilterStatus('active');
              }}>
                Clear Filters
              </button>
            </div>
          )
        ) : (
          <SkillsMatrix employees={filteredEmployees} />
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingEmployee) && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Employee?</h3>
            <p>
              Are you sure you want to delete <strong>{showDeleteConfirm.firstName} {showDeleteConfirm.lastName}</strong>?
            </p>
            <p className="confirm-warning">
              This will also remove all their show assignments. This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="confirm-overlay" onClick={handleImportCancel}>
          <div className="import-modal" onClick={e => e.stopPropagation()}>
            <h3>Import Team Data</h3>

            {importError ? (
              <>
                <div className="import-error">
                  <p><strong>Error reading file:</strong></p>
                  <p>{importError}</p>
                </div>
                <div className="import-actions">
                  <button className="btn-cancel" onClick={handleImportCancel}>
                    Close
                  </button>
                </div>
              </>
            ) : importValidation ? (
              <>
                <div className="import-summary">
                  <p><strong>File parsed successfully!</strong></p>
                  <p className="import-stats">
                    {importValidation.newEmployees.length} new employees to add
                    <br />
                    {importValidation.updatedEmployees.length} existing employees to update
                  </p>
                  {importValidation.errors.length > 0 && (
                    <div className="import-warnings">
                      <p><strong>Warnings:</strong></p>
                      <ul>
                        {importValidation.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="import-options">
                  <p><strong>Choose how to import:</strong></p>

                  <button
                    className="btn-import-option merge"
                    onClick={() => handleImportConfirm('merge')}
                  >
                    <span className="option-title">Merge</span>
                    <span className="option-desc">
                      Add new employees and update existing ones by ID.
                      Employees not in the file will be kept unchanged.
                    </span>
                  </button>

                  <button
                    className="btn-import-option replace"
                    onClick={() => handleImportConfirm('replace')}
                  >
                    <span className="option-title">Replace All</span>
                    <span className="option-desc">
                      Remove all current employees and replace with the imported file.
                      Use this for a complete roster refresh.
                    </span>
                  </button>
                </div>

                <div className="import-actions">
                  <button className="btn-cancel" onClick={handleImportCancel}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p>Processing file...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
