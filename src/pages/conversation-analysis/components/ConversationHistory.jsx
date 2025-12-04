import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationHistory = ({ conversations, onLoadConversation, onDeleteConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredConversations = conversations?.filter(conv =>
    conv?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    conv?.preview?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const formatDate = (date) => {
    const now = new Date();
    const convDate = new Date(date);
    const diffInDays = Math.floor((now - convDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return convDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-6 z-30 lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border shadow-lg"
      >
        <Icon name="History" size={20} />
        <span className="text-sm font-medium">History</span>
      </button>
      <div
        className={`fixed lg:relative top-0 right-0 h-full w-80 bg-card border-l border-border z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="History" size={20} color="var(--color-primary)" />
              <h3 className="font-semibold">History</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden w-8 h-8 rounded flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-border">
            <div className="relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {filteredConversations?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="MessageSquare" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations?.map((conversation) => (
                  <div
                    key={conversation?.id}
                    className="group p-3 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => {
                      onLoadConversation(conversation);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium line-clamp-1">{conversation?.title}</h4>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDeleteConversation(conversation?.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Trash2" size={14} color="var(--color-error)" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {conversation?.preview}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(conversation?.date)}</span>
                      <span className="flex items-center gap-1">
                        <Icon name="MessageSquare" size={12} />
                        {conversation?.messageCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="Plus"
              iconPosition="left"
            >
              New Conversation
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ConversationHistory;