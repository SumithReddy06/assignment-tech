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
    <div className="bg-card rounded-lg border border-border h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Recent Conversations</h3>
        <Icon name="MessageSquare" size={16} className="text-primary" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6 text-muted-foreground px-4">
            <Icon name="MessageCircle" size={32} className="mb-2 opacity-40" />
            <p className="text-xs text-center font-medium">No conversations yet</p>
            <p className="text-xs mt-1 text-center opacity-70">Start analyzing to see history</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {conversations?.map((conversation) => (
              <div
                key={conversation?.id}
                className="border-0 p-3 hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
                onClick={() => onSelectConversation(conversation?.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-2">
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
                    className="flex-shrink-0 p-1 hover:bg-background rounded transition-colors"
                    aria-label={expandedId === conversation?.id ? 'Collapse' : 'Expand'}
                  >
                    <Icon
                      name={expandedId === conversation?.id ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                    />
                  </button>
                </div>
                
                {expandedId === conversation?.id && (
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Response:</p>
                    <p className="text-xs text-foreground line-clamp-3">{conversation?.response}</p>
                    {conversation?.category && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;