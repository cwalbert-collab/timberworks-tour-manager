import { useState, useEffect, useCallback, useMemo } from 'react';
import { sampleEmployees, getEmptyEmployee } from '../data/sampleEmployeeData';

const EMPLOYEES_STORAGE_KEY = 'lumberjack-tours-employees';
const ASSIGNMENTS_STORAGE_KEY = 'lumberjack-tours-show-assignments';

// Sample show assignments - links employees to shows
const sampleAssignments = [
  // These will be populated when shows are assigned employees
];

export function useEmployees(shows = []) {
  const [employees, setEmployees] = useState([]);
  const [showAssignments, setShowAssignments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Load employees
    const storedEmployees = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch (e) {
        console.error('Failed to parse stored employees:', e);
        setEmployees(sampleEmployees);
      }
    } else {
      setEmployees(sampleEmployees);
    }

    // Load assignments
    const storedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (storedAssignments) {
      try {
        setShowAssignments(JSON.parse(storedAssignments));
      } catch (e) {
        console.error('Failed to parse stored assignments:', e);
        setShowAssignments(sampleAssignments);
      }
    } else {
      setShowAssignments(sampleAssignments);
    }

    setIsLoaded(true);
  }, []);

  // Save employees to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees, isLoaded]);

  // Save assignments to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(showAssignments));
    }
  }, [showAssignments, isLoaded]);

  // ========== EMPLOYEE CRUD ==========

  const addEmployee = useCallback((employee) => {
    const newEmployee = {
      ...getEmptyEmployee(),
      ...employee,
      id: employee.id || `emp-${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback((updatedEmployee) => {
    setEmployees(prev =>
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  }, []);

  const deleteEmployee = useCallback((employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    // Also remove their show assignments
    setShowAssignments(prev => prev.filter(a => a.employeeId !== employeeId));
  }, []);

  // Promote/demote between full-time and day-rate
  const toggleEmploymentType = useCallback((employeeId) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const isFullTime = emp.employmentType === 'full_time';
        return {
          ...emp,
          employmentType: isFullTime ? 'day_rate' : 'full_time',
          // When promoting to full-time, set a default salary based on day rate
          annualSalary: isFullTime ? null : (emp.dayRate ? emp.dayRate * 150 : 40000),
          // When demoting to day-rate, set based on salary
          dayRate: isFullTime ? (emp.annualSalary ? Math.round(emp.annualSalary / 200) : 200) : null
        };
      }
      return emp;
    }));
  }, []);

  // ========== SHOW ASSIGNMENTS ==========

  // Get assignments for a specific show
  const getShowAssignments = useCallback((showId) => {
    return showAssignments.filter(a => a.showId === showId);
  }, [showAssignments]);

  // Get assignments for a specific employee
  const getEmployeeAssignments = useCallback((employeeId) => {
    return showAssignments.filter(a => a.employeeId === employeeId);
  }, [showAssignments]);

  // Assign employee to a show
  const assignEmployeeToShow = useCallback((showId, employeeId, role = 'performer') => {
    // Check if already assigned
    const existing = showAssignments.find(
      a => a.showId === showId && a.employeeId === employeeId
    );
    if (existing) return existing;

    const newAssignment = {
      id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      showId,
      employeeId,
      role,
      createdAt: new Date().toISOString()
    };
    setShowAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  }, [showAssignments]);

  // Remove employee from show
  const removeEmployeeFromShow = useCallback((showId, employeeId) => {
    setShowAssignments(prev =>
      prev.filter(a => !(a.showId === showId && a.employeeId === employeeId))
    );
  }, []);

  // Update all assignments for a show (bulk operation)
  const updateShowAssignments = useCallback((showId, employeeIds) => {
    setShowAssignments(prev => {
      // Remove existing assignments for this show
      const otherAssignments = prev.filter(a => a.showId !== showId);
      // Add new assignments
      const newAssignments = employeeIds.map(employeeId => ({
        id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        showId,
        employeeId,
        role: 'assigned',
        createdAt: new Date().toISOString()
      }));
      return [...otherAssignments, ...newAssignments];
    });
  }, []);

  // ========== COMPUTED METRICS ==========

  // Calculate days worked for each employee
  // Multi-day shows count each day separately
  const employeeDaysWorked = useMemo(() => {
    const daysMap = new Map();

    employees.forEach(emp => {
      daysMap.set(emp.id, 0);
    });

    showAssignments.forEach(assignment => {
      const show = shows.find(s => s.id === assignment.showId);
      if (show) {
        // Calculate number of days for this show
        const startDate = new Date(show.startDate);
        const endDate = show.endDate ? new Date(show.endDate) : startDate;
        const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);

        const currentDays = daysMap.get(assignment.employeeId) || 0;
        daysMap.set(assignment.employeeId, currentDays + days);
      }
    });

    return daysMap;
  }, [employees, showAssignments, shows]);

  // Get certification alerts (expiring within 60 days or expired)
  const certificationAlerts = useMemo(() => {
    const alerts = [];
    const today = new Date();
    const sixtyDaysOut = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

    employees.filter(e => e.isActive).forEach(emp => {
      Object.entries(emp.certifications || {}).forEach(([certType, cert]) => {
        if (cert.certified && cert.expirationDate) {
          const expDate = new Date(cert.expirationDate);
          if (expDate < today) {
            alerts.push({
              employeeId: emp.id,
              employeeName: `${emp.firstName} ${emp.lastName}`,
              certType,
              expirationDate: cert.expirationDate,
              status: 'expired'
            });
          } else if (expDate < sixtyDaysOut) {
            alerts.push({
              employeeId: emp.id,
              employeeName: `${emp.firstName} ${emp.lastName}`,
              certType,
              expirationDate: cert.expirationDate,
              status: 'expiring_soon'
            });
          }
        }
      });
    });

    return alerts.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
  }, [employees]);

  // Overall metrics
  const metrics = useMemo(() => {
    const active = employees.filter(e => e.isActive);
    const fullTime = active.filter(e => e.employmentType === 'full_time');
    const dayRate = active.filter(e => e.employmentType === 'day_rate');

    // Count by team
    const byTeam = {
      red: active.filter(e => e.team === 'red').length,
      blue: active.filter(e => e.team === 'blue').length,
      flex: active.filter(e => e.team === 'flex').length
    };

    // Count by role
    const byRole = active.reduce((acc, e) => {
      acc[e.role] = (acc[e.role] || 0) + 1;
      return acc;
    }, {});

    // Count performers who can do each event
    const eventCapabilities = {};
    active.forEach(emp => {
      Object.entries(emp.events || {}).forEach(([event, canDo]) => {
        if (canDo) {
          eventCapabilities[event] = (eventCapabilities[event] || 0) + 1;
        }
      });
    });

    // Total annual payroll for full-time
    const totalSalaryPayroll = fullTime.reduce((sum, e) => sum + (e.annualSalary || 0), 0);

    return {
      total: employees.length,
      active: active.length,
      inactive: employees.length - active.length,
      fullTime: fullTime.length,
      dayRate: dayRate.length,
      byTeam,
      byRole,
      eventCapabilities,
      totalSalaryPayroll,
      certificationAlerts: certificationAlerts.length
    };
  }, [employees, certificationAlerts]);

  // ========== SEARCH & FILTER HELPERS ==========

  const searchEmployees = useCallback((query) => {
    if (!query) return employees;
    const lower = query.toLowerCase();
    return employees.filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(lower) ||
      emp.email.toLowerCase().includes(lower) ||
      emp.role.toLowerCase().includes(lower) ||
      emp.homeLocation.toLowerCase().includes(lower)
    );
  }, [employees]);

  const getEmployeesByTeam = useCallback((team) => {
    if (team === 'all') return employees.filter(e => e.isActive);
    return employees.filter(e => e.isActive && e.team === team);
  }, [employees]);

  const getEmployeesByType = useCallback((type) => {
    if (type === 'all') return employees.filter(e => e.isActive);
    return employees.filter(e => e.isActive && e.employmentType === type);
  }, [employees]);

  const getEmployeesWithEvent = useCallback((eventId) => {
    return employees.filter(e => e.isActive && e.events?.[eventId]);
  }, [employees]);

  const getEmployeesWithSkill = useCallback((skillId) => {
    return employees.filter(e => e.isActive && e.skills?.[skillId]);
  }, [employees]);

  // Reset functions
  const resetToSampleData = useCallback(() => {
    setEmployees(sampleEmployees);
    setShowAssignments(sampleAssignments);
  }, []);

  const importEmployees = useCallback((importedEmployees, mergeMode = 'merge') => {
    if (mergeMode === 'replace') {
      setEmployees(importedEmployees);
    } else {
      // Merge by ID
      setEmployees(prev => {
        const employeeMap = new Map(prev.map(e => [e.id, e]));
        importedEmployees.forEach(emp => {
          employeeMap.set(emp.id, emp);
        });
        return Array.from(employeeMap.values());
      });
    }
  }, []);

  return {
    // Data
    employees,
    showAssignments,
    isLoaded,

    // CRUD
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmploymentType,

    // Assignments
    getShowAssignments,
    getEmployeeAssignments,
    assignEmployeeToShow,
    removeEmployeeFromShow,
    updateShowAssignments,

    // Computed
    employeeDaysWorked,
    certificationAlerts,
    metrics,

    // Helpers
    searchEmployees,
    getEmployeesByTeam,
    getEmployeesByType,
    getEmployeesWithEvent,
    getEmployeesWithSkill,

    // Reset/Import
    resetToSampleData,
    importEmployees
  };
}
