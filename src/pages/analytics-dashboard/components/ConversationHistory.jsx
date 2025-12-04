import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConversationHistory = ({ conversations, onSelectConversation }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTimestamp = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    } catch (error) {
      return 'just now';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Conversations</h3>
        <Icon name="MessageSquare" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {conversations?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="MessageCircle" size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start analyzing reviews to see history</p>
          </div>
        ) : (
          conversations?.map((conversation) => (
            <div
              key={conversation?.id}
              className="border border-border rounded-lg p-3 hover:bg-muted transition-colors duration-150 cursor-pointer"
              onClick={() => onSelectConversation(conversation?.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {conversation?.query}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(conversation?.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    toggleExpand(conversation?.id);
                  }}
                  className="ml-2 p-1 hover:bg-background rounded"
                  aria-label={expandedId === conversation?.id ? 'Collapse' : 'Expand'}
                >
                  <Icon
                    name={expandedId === conversation?.id ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                  />
                </button>
              </div>
              
              {expandedId === conversation?.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">AI Response:</p>
                  <p className="text-sm text-foreground">{conversation?.response}</p>
                  {conversation?.category && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {conversation?.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {conversation?.reviewCount} reviews analyzed
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;