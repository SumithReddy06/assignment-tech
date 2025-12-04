/**
 * Local DB using localStorage for conversations and activities
 */

const CONVERSATIONS_KEY = 'conversations_db';
const ACTIVITIES_KEY = 'activities_db';

/**
 * Get all conversations from localStorage
 */
export function getAllConversations() {
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading conversations:', error);
    return [];
  }
}

/**
 * Add a new conversation
 */
export function addConversation(query, response, category = 'Analysis') {
  try {
    const conversations = getAllConversations();
    const newConversation = {
      id: Date.now(),
      query,
      response,
      category,
      timestamp: new Date().toISOString(),
      userRole: localStorage.getItem('userRole') || 'Analyst'
    };
    
    conversations.unshift(newConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    return newConversation;
  } catch (error) {
    console.error('Error adding conversation:', error);
    return null;
  }
}

/**
 * Delete a conversation
 */
export function deleteConversation(id) {
  try {
    const conversations = getAllConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

/**
 * Clear all conversations
 */
export function clearAllConversations() {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing conversations:', error);
    return false;
  }
}

/**
 * Get all activities from localStorage
 */
export function getAllActivities() {
  try {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading activities:', error);
    return [];
  }
}

/**
 * Add a new activity
 */
export function addActivity(type, description, metadata = {}) {
  try {
    const activities = getAllActivities();
    const newActivity = {
      id: Date.now(),
      type,
      description,
      timestamp: new Date().toISOString(),
      userRole: localStorage.getItem('userRole') || 'Analyst',
      metadata
    };
    
    activities.unshift(newActivity);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    return newActivity;
  } catch (error) {
    console.error('Error adding activity:', error);
    return null;
  }
}

/**
 * Delete an activity
 */
export function deleteActivity(id) {
  try {
    const activities = getAllActivities();
    const filtered = activities.filter(a => a.id !== id);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting activity:', error);
    return false;
  }
}

/**
 * Clear all activities
 */
export function clearAllActivities() {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing activities:', error);
    return false;
  }
}

/**
 * Get recent conversations (limit: default 50)
 */
export function getRecentConversations(limit = 50) {
  const conversations = getAllConversations();
  return conversations.slice(0, limit);
}

/**
 * Get recent activities (limit: default 50)
 */
export function getRecentActivities(limit = 50) {
  const activities = getAllActivities();
  return activities.slice(0, limit);
}

/**
 * Search conversations by query
 */
export function searchConversations(searchTerm) {
  const conversations = getAllConversations();
  const term = searchTerm.toLowerCase();
  return conversations.filter(c => 
    c.query.toLowerCase().includes(term) || 
    c.response.toLowerCase().includes(term)
  );
}

/**
 * Export conversations as JSON
 */
export function exportConversations() {
  try {
    const conversations = getAllConversations();
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversations_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting conversations:', error);
    return false;
  }
}

/**
 * Export activities as JSON
 */
export function exportActivities() {
  try {
    const activities = getAllActivities();
    const dataStr = JSON.stringify(activities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activities_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting activities:', error);
    return false;
  }
}

/**
 * Get database stats
 */
export function getDBStats() {
  return {
    totalConversations: getAllConversations().length,
    totalActivities: getAllActivities().length,
    storageUsed: new Blob(Object.values(localStorage)).size,
    lastUpdated: new Date().toISOString()
  };
}
