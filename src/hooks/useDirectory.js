import { useState, useEffect, useCallback, useMemo } from 'react';
import { sampleVenues, sampleContacts } from '../data/sampleDirectoryData';

const VENUES_STORAGE_KEY = 'lumberjack-tours-venues';
const CONTACTS_STORAGE_KEY = 'lumberjack-tours-contacts';
const ACTIVITIES_STORAGE_KEY = 'lumberjack-tours-activities';

export function useDirectory() {
  const [venues, setVenues] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Load venues
    const storedVenues = localStorage.getItem(VENUES_STORAGE_KEY);
    if (storedVenues) {
      try {
        setVenues(JSON.parse(storedVenues));
      } catch (e) {
        console.error('Failed to parse stored venues:', e);
        setVenues(sampleVenues);
      }
    } else {
      setVenues(sampleVenues);
    }

    // Load contacts
    const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (storedContacts) {
      try {
        setContacts(JSON.parse(storedContacts));
      } catch (e) {
        console.error('Failed to parse stored contacts:', e);
        setContacts(sampleContacts);
      }
    } else {
      setContacts(sampleContacts);
    }

    // Load activities
    const storedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (storedActivities) {
      try {
        setActivities(JSON.parse(storedActivities));
      } catch (e) {
        console.error('Failed to parse stored activities:', e);
        setActivities([]);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save venues to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(venues));
    }
  }, [venues, isLoaded]);

  // Save contacts to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts, isLoaded]);

  // Save activities to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities, isLoaded]);

  // === VENUE OPERATIONS ===

  const addVenue = useCallback((venue) => {
    const newVenue = {
      ...venue,
      id: venue.id || `venue-${Date.now()}`,
      isActive: venue.isActive !== false
    };
    setVenues(prev => [...prev, newVenue]);
    return newVenue;
  }, []);

  const updateVenue = useCallback((updatedVenue) => {
    setVenues(prev =>
      prev.map(venue =>
        venue.id === updatedVenue.id ? updatedVenue : venue
      )
    );
  }, []);

  const deleteVenue = useCallback((venueId) => {
    setVenues(prev => prev.filter(venue => venue.id !== venueId));
    // Also remove contacts associated with this venue
    setContacts(prev => prev.filter(contact => contact.venueId !== venueId));
    // Also remove activities associated with this venue
    setActivities(prev => prev.filter(activity =>
      !(activity.entityType === 'venue' && activity.entityId === venueId)
    ));
  }, []);

  // === CONTACT OPERATIONS ===

  const addContact = useCallback((contact) => {
    const newContact = {
      ...contact,
      id: contact.id || `contact-${Date.now()}`,
      isPrimary: contact.isPrimary || false
    };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, []);

  const updateContact = useCallback((updatedContact) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  }, []);

  const deleteContact = useCallback((contactId) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
    // Also remove activities associated with this contact
    setActivities(prev => prev.filter(activity =>
      !(activity.entityType === 'contact' && activity.entityId === contactId)
    ));
  }, []);

  // === ACTIVITY OPERATIONS ===

  const addActivity = useCallback((activity) => {
    const newActivity = {
      ...activity,
      id: activity.id || `activity-${Date.now()}`,
      createdAt: activity.createdAt || new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]); // Newest first
    return newActivity;
  }, []);

  const updateActivity = useCallback((updatedActivity) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );
  }, []);

  const deleteActivity = useCallback((activityId) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  }, []);

  // Get activities for a specific entity (venue or contact)
  const getEntityActivities = useCallback((entityType, entityId) => {
    return activities
      .filter(activity => activity.entityType === entityType && activity.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
  }, [activities]);

  // === QUERY HELPERS ===

  // Get contacts for a specific venue
  const getVenueContacts = useCallback((venueId) => {
    return contacts.filter(contact => contact.venueId === venueId);
  }, [contacts]);

  // Get venue for a contact
  const getContactVenue = useCallback((venueId) => {
    return venues.find(venue => venue.id === venueId);
  }, [venues]);

  // Get primary contact for a venue
  const getPrimaryContact = useCallback((venueId) => {
    return contacts.find(contact => contact.venueId === venueId && contact.isPrimary);
  }, [contacts]);

  // Get contacts without a venue (independent contacts)
  const getIndependentContacts = useCallback(() => {
    return contacts.filter(contact => !contact.venueId);
  }, [contacts]);

  // Search venues by name, city, or state
  const searchVenues = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return venues.filter(venue =>
      venue.name.toLowerCase().includes(lowerQuery) ||
      venue.city.toLowerCase().includes(lowerQuery) ||
      venue.state.toLowerCase().includes(lowerQuery)
    );
  }, [venues]);

  // Search contacts by name, email, or role
  const searchContacts = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery) ||
      contact.role.toLowerCase().includes(lowerQuery)
    );
  }, [contacts]);

  // === COMPUTED METRICS ===

  const metrics = useMemo(() => {
    const totalVenues = venues.length;
    const activeVenues = venues.filter(v => v.isActive).length;
    const totalContacts = contacts.length;
    const venuesWithContacts = new Set(contacts.map(c => c.venueId).filter(Boolean)).size;

    // Venues by type
    const venuesByType = venues.reduce((acc, venue) => {
      acc[venue.venueType] = (acc[venue.venueType] || 0) + 1;
      return acc;
    }, {});

    // Venues by state
    const venuesByState = venues.reduce((acc, venue) => {
      acc[venue.state] = (acc[venue.state] || 0) + 1;
      return acc;
    }, {});

    return {
      totalVenues,
      activeVenues,
      totalContacts,
      venuesWithContacts,
      venuesByType,
      venuesByState
    };
  }, [venues, contacts]);

  // === IMPORT/EXPORT ===

  const importVenues = useCallback((importedVenues) => {
    setVenues(prev => {
      const existingMap = new Map(prev.map(v => [v.id, v]));
      importedVenues.forEach(venue => {
        existingMap.set(venue.id, venue);
      });
      return Array.from(existingMap.values());
    });
  }, []);

  const importContacts = useCallback((importedContacts) => {
    setContacts(prev => {
      const existingMap = new Map(prev.map(c => [c.id, c]));
      importedContacts.forEach(contact => {
        existingMap.set(contact.id, contact);
      });
      return Array.from(existingMap.values());
    });
  }, []);

  const resetToSampleData = useCallback(() => {
    setVenues(sampleVenues);
    setContacts(sampleContacts);
    setActivities([]); // Clear activities on reset
  }, []);

  return {
    // Data
    venues,
    contacts,
    activities,
    isLoaded,
    metrics,

    // Venue operations
    addVenue,
    updateVenue,
    deleteVenue,

    // Contact operations
    addContact,
    updateContact,
    deleteContact,

    // Activity operations
    addActivity,
    updateActivity,
    deleteActivity,
    getEntityActivities,

    // Query helpers
    getVenueContacts,
    getContactVenue,
    getPrimaryContact,
    getIndependentContacts,
    searchVenues,
    searchContacts,

    // Import/Export
    importVenues,
    importContacts,
    resetToSampleData
  };
}
