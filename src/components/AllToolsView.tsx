import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ToolDefinition, ToolCategory } from '../types';
import { CATEGORIES } from '../data/tools';
import { ToolIcon } from './ToolIcon';

interface AllToolsViewProps {
  tools: ToolDefinition[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectTool: (tool: ToolDefinition) => void;
  onBackHome: () => void;
}

export const AllToolsView: React.FC<AllToolsViewProps> = ({
  tools,
  selectedCategory,
  onSelectCategory,
  onSelectTool,
  onBackHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => {
    const matchesCategory =
      selectedCategory === 'all' ||
      tool.category === selectedCategory ||
      (selectedCategory === 'document' &&
        (tool.category === 'document' ||
          tool.id.includes('word') ||
          tool.id.includes('excel') ||
          tool.id.includes('ppt')));

    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.acceptedFileTypes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            id="all-tools-back-btn"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-medium text-slate-400">
            Showing {filteredTools.length} of {tools.length} tools
          </span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            All File & Document Tools
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Explore our complete suite of PDF utilities, image compressors, format converters, and security tools.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-tab-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? 'bg-red-700 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, format, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map(tool => (
              <div
                key={tool.id}
                id={`all-tool-card-${tool.id}`}
                onClick={() => onSelectTool(tool)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 hover:border-red-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                      <ToolIcon name={tool.icon} className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Formats badges */}
                  {tool.acceptedFileTypes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tool.acceptedFileTypes.slice(0, 3).map(ext => (
                        <span
                          key={ext}
                          className="rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 border border-slate-100"
                        >
                          {ext.toUpperCase()}
                        </span>
                      ))}
                      {tool.acceptedFileTypes.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono py-0.5">
                          +{tool.acceptedFileTypes.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-red-600 font-medium transition-colors">
                  <span>Open tool</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Filter className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching tools found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search query or select another category tab.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
