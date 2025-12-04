import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QueryInterface = ({ onSubmitQuery, isProcessing }) => {
  const [query, setQuery] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef?.current?.scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query?.trim() && !isProcessing) {
      onSubmitQuery(query?.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Sparkles" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Analysis Assistant</h2>
          <p className="text-sm text-muted-foreground">Ask questions about product reviews and get instant insights</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e?.target?.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: Show me the NPS curve for Electronics category over the last 6 months..."
            className="w-full min-h-[120px] max-h-[300px] px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            disabled={isProcessing}
            aria-label="Query input"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {query?.length}/500
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Press Shift + Enter for new line</span>
          </div>
          <Button
            type="submit"
            variant="default"
            disabled={!query?.trim() || isProcessing}
            loading={isProcessing}
            iconName="Send"
            iconPosition="right"
          >
            {isProcessing ? 'Analyzing...' : 'Send Query'}
          </Button>
        </div>
      </form>
      {isProcessing && (
        <div className="mt-4 p-4 bg-muted rounded-lg flex items-center gap-3">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Processing your query...</p>
            <p className="text-xs text-muted-foreground">Analyzing review data and generating insights</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryInterface;