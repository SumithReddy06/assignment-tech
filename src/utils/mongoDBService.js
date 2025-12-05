/**
 * MongoDB Database Service - Replaces localStorage with backend API
 * Stores conversations and activities in MongoDB via Express API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ==================== CONVERSATIONS ====================

/**
 * Get all conversations from MongoDB
 */
export async function getAllConversations() {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Add a new conversation to MongoDB
 */
export async function addConversation(query, response, category = 'Analysis') {
  try {
    const userRole = localStorage.getItem('userRole') || 'Analyst';
    const payload = {
      query,
      response,
      category,
      userRole
    };

    console.log('📤 Saving conversation:', payload);
    const response_data = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response_data.ok) throw new Error(`Failed to add conversation: ${response_data.status}`);
    const result = await response_data.json();
    console.log('✅ Conversation saved:', result);
    return result;
  } catch (error) {
    console.error('❌ Error adding conversation:', error);
    return null;
  }
}

/**
 * Save full conversation thread with all messages and visualizations
 */
export async function saveFullConversationThread(messages, visualizations, query, response, category = 'Analysis') {
  try {
    const userRole = localStorage.getItem('userRole') || 'Analyst';
    const payload = {
      query,
      response,
      category,
      userRole,
      messages,
      visualizations,
      sessionId: localStorage.getItem('sessionId') || `session_${Date.now()}`
    };

    console.log('📤 Saving full conversation thread with', messages?.length, 'messages');
    const response_data = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response_data.ok) throw new Error(`Failed to save conversation thread: ${response_data.status}`);
    const result = await response_data.json();
    console.log('✅ Full conversation thread saved:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving conversation thread:', error);
    return null;
  }
}

/**
 * Delete a conversation from MongoDB
 */
export async function deleteConversation(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

/**
 * Clear all conversations from MongoDB
 */
export async function clearAllConversations() {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to clear conversations');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error clearing conversations:', error);
    return false;
  }
}

/**
 * Get recent conversations (limit: default 50)
 */
export async function getRecentConversations(limit = 50) {
  try {
    console.log('🔍 Fetching recent conversations from:', `${API_BASE_URL}/conversations/recent/${limit}`);
    const response = await fetch(`${API_BASE_URL}/conversations/recent/${limit}`);
    if (!response.ok) throw new Error(`Failed to fetch recent conversations: ${response.status}`);
    const data = await response.json();
    console.log('✅ Got conversations:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching recent conversations:', error);
    return [];
  }
}

/**
 * Search conversations by query
 */
export async function searchConversations(searchTerm) {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/search/${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error('Failed to search conversations');
    return await response.json();
  } catch (error) {
    console.error('Error searching conversations:', error);
    return [];
  }
}

/**
 * Export conversations as JSON
 */
export async function exportConversations() {
  try {
    const conversations = await getAllConversations();
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

// ==================== ACTIVITIES ====================

/**
 * Get all activities from MongoDB
 */
export async function getAllActivities() {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`);
    if (!response.ok) throw new Error('Failed to fetch activities');
    return await response.json();
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

/**
 * Add a new activity to MongoDB
 */
export async function addActivity(type, description, metadata = {}) {
  try {
    const userRole = localStorage.getItem('userRole') || 'Analyst';
    const payload = {
      type,
      description,
      metadata,
      userRole
    };

    console.log('📤 Logging activity:', payload);
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Failed to add activity: ${response.status}`);
    const result = await response.json();
    console.log('✅ Activity logged:', result);
    return result;
  } catch (error) {
    console.error('❌ Error adding activity:', error);
    return null;
  }
}

/**
 * Delete an activity from MongoDB
 */
export async function deleteActivity(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete activity');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting activity:', error);
    return false;
  }
}

/**
 * Clear all activities from MongoDB
 */
export async function clearAllActivities() {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to clear activities');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error clearing activities:', error);
    return false;
  }
}

/**
 * Get recent activities (limit: default 50)
 */
export async function getRecentActivities(limit = 50) {
  try {
    console.log('🔍 Fetching recent activities from:', `${API_BASE_URL}/activities/recent/${limit}`);
    const response = await fetch(`${API_BASE_URL}/activities/recent/${limit}`);
    if (!response.ok) throw new Error(`Failed to fetch recent activities: ${response.status}`);
    const data = await response.json();
    console.log('✅ Got activities:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching recent activities:', error);
    return [];
  }
}

/**
 * Export activities as JSON
 */
export async function exportActivities() {
  try {
    const activities = await getAllActivities();
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
export async function getDBStats() {
  try {
    const conversations = await getAllConversations();
    const activities = await getAllActivities();
    
    return {
      totalConversations: conversations.length,
      totalActivities: activities.length,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting DB stats:', error);
    return {
      totalConversations: 0,
      totalActivities: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}
