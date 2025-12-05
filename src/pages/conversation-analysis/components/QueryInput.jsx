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
    <div className="bg-card border-t border-border">
      {suggestedQueries && suggestedQueries?.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border/30 bg-muted/20">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">💡 Quick Queries</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQueries?.map((suggested, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuery(suggested)}
                className="px-2.5 py-1 rounded-full bg-card border border-border/50 hover:border-primary/50 text-xs text-foreground font-medium transition-all hover:bg-card hover:shadow-sm active:scale-95 duration-200"
              >
                {suggested}
              </button>
            ))}
          </div>
        </div>
      )}
      {attachments?.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-b border-border/30 bg-success/5">
          {attachments?.map((attachment, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-success/15 border border-success/30 text-xs text-success font-medium hover:bg-success/20 transition-colors"
            >
              <Icon name="File" size={12} />
              <span className="max-w-[150px] truncate">{attachment?.name}</span>
              <button
                onClick={() => removeAttachment(idx)}
                className="text-success/70 hover:text-success ml-0.5 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="px-4 py-3 space-y-2.5">
        <div className="flex items-end gap-2">
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
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:shadow-md active:scale-95 duration-200 border border-border/50 hover:border-border"
            title="Attach file"
            aria-label="Attach file"
          >
            <Icon name="Paperclip" size={16} className="text-muted-foreground" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              placeholder="Ask about NPS, sentiment, ratings, customer trends..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 font-medium text-sm"
              rows={1}
              style={{ minHeight: '36px', maxHeight: '100px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e?.target?.scrollHeight, 100) + 'px';
              }}
              disabled={isProcessing}
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={!query?.trim() || isProcessing}
            loading={isProcessing}
            iconName={isProcessing ? "Loader" : "Send"}
            iconPosition="right"
            className="flex-shrink-0 shadow-lg hover:shadow-xl"
          >
            {isProcessing ? 'Processing' : 'Send'}
          </Button>
        </div>

        <div className="flex items-center justify-between px-0.5 text-xs text-muted-foreground/70">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Icon name="Zap" size={12} className="text-warning" />
              <span>AI-Powered</span>
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Icon name="Shield" size={12} className="text-success" />
              <span>Secure</span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QueryInput;