import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QueryInput = ({ onSendQuery, isProcessing, suggestedQueries }) => {
  const [query, setQuery] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query?.trim() && !isProcessing) {
      onSendQuery(query, attachments);
      setQuery('');
      setAttachments([]);
    }
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e?.target?.files);
    const newAttachments = files?.map(file => ({
      name: file?.name,
      size: file?.size,
      type: file?.type
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments?.filter((_, idx) => idx !== index));
  };

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery);
  };

  return (
    <div className="border-t border-border bg-gradient-to-b from-card to-background/30">
      {suggestedQueries && suggestedQueries?.length > 0 && (
        <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
          <p className="text-xs text-muted-foreground mb-3 font-bold uppercase tracking-wide">💡 Quick Queries</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries?.map((suggested, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuery(suggested)}
                className="px-3 py-1.5 rounded-full bg-card border border-border/50 hover:border-primary/50 text-xs text-foreground font-medium transition-all hover:bg-card hover:shadow-sm active:scale-95 duration-200"
              >
                {suggested}
              </button>
            ))}
          </div>
        </div>
      )}
      {attachments?.length > 0 && (
        <div className="px-6 py-3 flex flex-wrap gap-2 border-b border-border/30 bg-success/5">
          {attachments?.map((attachment, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/15 border border-success/30 text-xs text-success font-medium hover:bg-success/20 transition-colors"
            >
              <Icon name="File" size={14} />
              <span className="max-w-[150px] truncate">{attachment?.name}</span>
              <button
                onClick={() => removeAttachment(idx)}
                className="text-success/70 hover:text-success ml-1 transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div className="flex items-end gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileAttach}
            className="hidden"
            multiple
            accept=".csv,.json,.xlsx"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef?.current?.click()}
            className="flex-shrink-0 w-11 h-11 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:shadow-md active:scale-95 duration-200 border border-border/50 hover:border-border"
            title="Attach file"
            aria-label="Attach file"
          >
            <Icon name="Paperclip" size={20} className="text-muted-foreground" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              placeholder="Ask about NPS, sentiment, ratings, customer trends..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 font-medium text-sm"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e?.target?.scrollHeight, 120) + 'px';
              }}
              disabled={isProcessing}
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={!query?.trim() || isProcessing}
            loading={isProcessing}
            iconName={isProcessing ? "Loader" : "Send"}
            iconPosition="right"
            className="flex-shrink-0 shadow-lg hover:shadow-xl"
          >
            {isProcessing ? 'Analyzing...' : 'Send'}
          </Button>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Icon name="Zap" size={13} className="text-warning" />
              <span className="font-medium">AI-Powered</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Icon name="Shield" size={13} className="text-success" />
              <span className="font-medium">Secure</span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground/60">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground text-xs font-mono">⇧ Enter</kbd> for newline
          </span>
        </div>
      </form>
    </div>
  );
};

export default QueryInput;