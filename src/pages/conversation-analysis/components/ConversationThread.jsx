import React from 'react';
import Icon from '../../../components/AppIcon';


const ConversationThread = ({ messages, onExportMessage }) => {
  const formatTimestamp = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now - messageDate) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto px-5 py-6 bg-gradient-to-b from-background via-background to-muted/3 scroll-smooth">
      {messages?.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Icon name="MessageCircle" size={32} className="text-primary/70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Analysis</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Begin by typing a question about Amazon product reviews below. Ask about NPS, sentiment, ratings, or customer trends.
          </p>
        </div>
      ) : (
        messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex gap-3 ${message?.role === 'user' ? 'flex-row-reverse' : 'flex-row'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className="flex-shrink-0">
              {message?.role === 'user' ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                  <Icon name="User" size={20} className="text-primary-foreground" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                  <Icon name="Bot" size={20} className="text-accent-foreground" />
                </div>
              )}
            </div>

            <div className={`flex-1 max-w-[75%] ${message?.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div
                className={`rounded-2xl px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                  message?.role === 'user' 
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-none' 
                    : 'bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-bl-none hover:border-border hover:bg-card'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">{message?.content}</p>
                
                {message?.attachments && message?.attachments?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message?.attachments?.map((attachment, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                          message?.role === 'user'
                            ? 'bg-primary-foreground/20'
                            : 'bg-muted/60 text-muted-foreground'
                        }`}
                      >
                        <Icon name="Paperclip" size={14} />
                        <span>{attachment?.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {message?.visualizations && message?.visualizations?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message?.visualizations?.map((viz, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/20 text-success text-xs font-semibold border border-success/30 hover:bg-success/30 transition-colors"
                      >
                        <Icon name="BarChart3" size={14} />
                        <span>{viz?.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs text-muted-foreground">{formatTimestamp(message?.timestamp)}</span>
                
                {message?.role === 'assistant' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onExportMessage(message)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md p-1.5 transition-all duration-200 hover:scale-105"
                      title="Export message as file"
                      aria-label="Export message"
                    >
                      <Icon name="Download" size={16} />
                    </button>
                    <button
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md p-1.5 transition-all duration-200 hover:scale-105"
                      title="Copy message to clipboard"
                      aria-label="Copy message"
                    >
                      <Icon name="Copy" size={16} />
                    </button>
                  </div>
                )}
              </div>

              {message?.traceId && (
                <div className="text-xs text-muted-foreground px-3 py-1.5 font-mono bg-muted/40 rounded-lg border border-border/30 hidden group-hover:block">
                  🔗 {message?.traceId}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConversationThread;