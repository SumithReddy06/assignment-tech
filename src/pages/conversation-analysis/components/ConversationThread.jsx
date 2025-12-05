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
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-muted/3 overflow-hidden">
      {messages?.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Icon name="MessageCircle" size={32} className="text-primary/70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Analysis</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Begin by typing a question about Amazon product reviews below. Ask about NPS, sentiment, ratings, or customer trends.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="flex flex-col gap-3 px-4 py-4">
            {messages?.map((message) => (
              <div
                key={message?.id}
                className={`flex gap-3 ${message?.role === 'user' ? 'flex-row-reverse' : 'flex-row'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className="flex-shrink-0 pt-1">
                  {message?.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                      <Icon name="User" size={16} className="text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-md">
                      <Icon name="Bot" size={16} className="text-accent-foreground" />
                    </div>
                  )}
                </div>

                <div className={`flex-1 max-w-[85%] flex flex-col gap-1.5`}>
                  <div
                    className={`rounded-lg px-4 py-2 shadow-sm transition-all duration-200 ${
                      message?.role === 'user' 
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-none ml-auto' 
                        : 'bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message?.content}</p>
                    
                    {message?.attachments && message?.attachments?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message?.attachments?.map((attachment, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              message?.role === 'user'
                                ? 'bg-primary-foreground/20'
                                : 'bg-muted/60 text-muted-foreground'
                            }`}
                          >
                            <Icon name="Paperclip" size={12} />
                            <span className="truncate">{attachment?.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {message?.visualizations && message?.visualizations?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message?.visualizations?.map((viz, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-success/20 text-success text-xs border border-success/30"
                          >
                            <Icon name="BarChart3" size={12} />
                            <span>{viz?.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs text-muted-foreground">{formatTimestamp(message?.timestamp)}</span>
                    
                    {message?.role === 'assistant' && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => onExportMessage(message)}
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded p-1 transition-all duration-200 hover:scale-110"
                          title="Export message as file"
                          aria-label="Export message"
                        >
                          <Icon name="Download" size={14} />
                        </button>
                        <button
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded p-1 transition-all duration-200 hover:scale-110"
                          title="Copy message to clipboard"
                          aria-label="Copy message"
                        >
                          <Icon name="Copy" size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {message?.traceId && (
                    <div className="text-xs text-muted-foreground px-2 py-1 font-mono bg-muted/40 rounded border border-border/30 hidden group-hover:block max-w-fit">
                      🔗 {message?.traceId}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationThread;