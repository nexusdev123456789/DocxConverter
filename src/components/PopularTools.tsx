import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ToolDefinition } from '../types';
import { ToolIcon } from './ToolIcon';

interface PopularToolsProps {
  tools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
  onViewAll: () => void;
}

export const PopularTools: React.FC<PopularToolsProps> = ({ tools, onSelectTool, onViewAll }) => {
  const popularTools = tools.filter(t => t.isPopular);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Most Used Everyday</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              Popular Conversion Tools
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The fastest way to convert, compress, and organize your files.
            </p>
          </div>

          <button
            id="popular-view-all-btn"
            onClick={onViewAll}
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition group"
          >
            <span>Explore all tools</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Popular Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {popularTools.map(tool => (
            <div
              key={tool.id}
              id={`popular-tool-card-${tool.id}`}
              onClick={() => onSelectTool(tool)}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 hover:border-red-500/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                    <ToolIcon name={tool.icon} className="h-6 w-6" />
                  </div>
                  {tool.badge && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-red-600 font-medium transition-colors">
                <span>Start conversion</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
