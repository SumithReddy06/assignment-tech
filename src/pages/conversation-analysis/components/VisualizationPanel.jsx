import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const VisualizationPanel = ({ visualizations, onExportVisualization }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const renderChart = (visualization) => {
    const safeNumber = (n) => (typeof n === 'number' ? n : parseFloat(n) || 0);
    const totalValues = (data) => (data || []).reduce((sum, d) => sum + (safeNumber(d?.value) || safeNumber(d?.rating) || safeNumber(d?.satisfied) || 0), 0);
    switch (visualization?.type) {
      case 'NPS Curve':
      case 'NPS Score':
        // Calculate percentages for NPS visualization
        const validNpsData = visualization?.data?.filter(item => item?.value > 0) || [];
        const totalNPS = validNpsData.reduce((sum, item) => sum + (item?.value || 0), 0) || 1;
        
        // Ensure we have valid data to display
        if (validNpsData.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground bg-muted/20 rounded-lg border border-border/30 p-6">
              <Icon name="AlertCircle" size={40} className="mb-4 opacity-50" />
              <p className="font-semibold text-foreground mb-2">No Data Available</p>
              <p className="text-sm">NPS data is empty or invalid</p>
            </div>
          );
        }

        const npsDataWithPercent = validNpsData.map(item => ({
          ...item,
          percent: ((item?.value / totalNPS) * 100).toFixed(1)
        }));
        
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={npsDataWithPercent}
                cx="50%"
                cy="45%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${percent}%`}
                outerRadius={90}
                innerRadius={0}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {npsDataWithPercent?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                formatter={(value, name, props) => {
                  const percent = ((value / totalNPS) * 100).toFixed(1);
                  return [`Count: ${value} | Percentage: ${percent}%`, 'Value'];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'Satisfaction Metrics':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={visualization?.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="satisfied" fill="var(--color-success)" />
              <Bar dataKey="neutral" fill="var(--color-warning)" />
              <Bar dataKey="dissatisfied" fill="var(--color-error)" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'Sentiment Distribution':
        {
          const data = visualization?.data || [];
          const total = totalValues(data);
          if (data.length === 0 || total <= 0) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Icon name="AlertCircle" size={40} className="mb-4 opacity-50" />
                <p className="font-semibold text-foreground mb-2">No Data</p>
                <p className="text-xs">No non-zero sentiment values to chart</p>
              </div>
            );
          }

          return (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          );
        }

      case 'Category Ratings':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={visualization?.data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="rating" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'Country Stats':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={visualization?.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="rating" fill="var(--color-success)" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'Rating Analysis':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={visualization?.data} layout="vertical" margin={{ top: 20, right: 30, left: 200, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-foreground)" />
              <YAxis dataKey="product" type="category" stroke="var(--color-foreground)" width={180} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="rating" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground bg-muted/20 rounded-lg border border-border/30 p-6">
            <Icon name="AlertCircle" size={40} className="mb-4 opacity-50" />
            <p className="font-semibold text-foreground mb-2">Unknown Chart Type</p>
            <p className="text-sm">{visualization?.type || 'No type specified'}</p>
            <p className="text-xs mt-3">Data points: {visualization?.data?.length || 0}</p>
          </div>
        );
    }
  };

  if (!visualizations || visualizations?.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-card to-background/50">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center mb-6 mx-auto ring-2 ring-accent/20">
            <Icon name="BarChart3" size={40} className="text-accent/70" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Visualizations Yet</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Start a conversation on the left to generate real-time charts and data visualizations.
          </p>
          <div className="space-y-2 text-left bg-muted/30 rounded-lg p-4 border border-border/40">
            <p className="text-xs font-semibold text-foreground mb-3">💡 Try asking about:</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                <span>NPS scores and customer segments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                <span>Sentiment analysis across categories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                <span>Product ratings by category</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                <span>Geographic distribution patterns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const currentVisualization = visualizations?.[activeTab];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/3">
      <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/8 via-background to-accent/8 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <Icon name="BarChart3" size={20} color="var(--color-primary-foreground)" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Visualizations</h3>
              <p className="text-xs text-muted-foreground">Real-time data analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 p-1.5 shadow-sm">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              disabled={zoomLevel <= 50}
              className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-all hover:shadow-sm active:scale-95 ${zoomLevel <= 50 ? 'opacity-40 cursor-not-allowed' : ''}`}
              title="Zoom out"
              aria-label="Zoom out"
            >
              <Icon name="ZoomOut" size={16} />
            </button>
            <span className="text-xs text-foreground w-12 text-center font-bold px-2 py-1 bg-muted/40 rounded-md">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              disabled={zoomLevel >= 150}
              className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-all hover:shadow-sm active:scale-95 ${zoomLevel >= 150 ? 'opacity-40 cursor-not-allowed' : ''}`}
              title="Zoom in"
              aria-label="Zoom in"
            >
              <Icon name="ZoomIn" size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {visualizations?.length > 1 && (
        <div className="flex gap-2 px-6 py-3 border-b border-border/30 bg-muted/20 overflow-x-auto">
          {visualizations?.map((viz, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm active:scale-95 ${
                activeTab === idx
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md border-0'
                  : 'bg-card/80 text-muted-foreground hover:text-foreground hover:bg-card border border-border/40'
              }`}
            >
              {viz?.type}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-8 w-full">
        <div className="bg-gradient-to-b from-card to-card/50 rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                {currentVisualization?.type}
              </h4>
              <p className="text-sm text-muted-foreground">{currentVisualization?.data?.length || 0} data points analyzed</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExportVisualization(currentVisualization)}
              className="hover:shadow-md"
            >
              Export
            </Button>
          </div>

          <div className="bg-card/80 rounded-lg border border-border/30 p-6 shadow-sm w-full" style={{ minHeight: '420px' }}>
            <div
              style={{
                height: '400px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Apply zoom scaling by transforming an inner wrapper. We compute width to keep the visual size consistent when scaling. */}
              {(() => {
                const scale = Math.max(0.5, Math.min(1.5, zoomLevel / 100));
                const innerWidth = `${100 / scale}%`;
                return (
                  <div style={{ transform: `scale(${scale})`, transformOrigin: 'center top', width: innerWidth }}>
                    {renderChart(currentVisualization)}
                  </div>
                );
              })()}
            </div>
          </div>

          {currentVisualization?.type === 'NPS Score' && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              {currentVisualization?.data?.map((item, idx) => {
                const total = currentVisualization?.data?.reduce((sum, d) => sum + d.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={idx} className="p-5 rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/20 hover:border-border hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-bold text-sm text-foreground">{item.name}</span>
                    </div>
                    <div className="mb-3">
                      <div className="text-3xl font-bold text-foreground mb-1">{item.value}</div>
                      <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[idx % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-foreground bg-muted/30 rounded-lg px-2 py-1 text-center">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentVisualization?.summary && (
            <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-info/10 via-info/5 to-accent/10 border border-info/20 hover:border-info/40 transition-all group">
              <p className="text-sm font-bold mb-3 flex items-center gap-2 text-info group-hover:text-info/80 transition-colors">
                <Icon name="Lightbulb" size={18} className="flex-shrink-0" />
                Key Insights
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {currentVisualization?.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;