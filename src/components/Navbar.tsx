import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  LayoutGrid,
  Info,
  User as UserIcon,
  LogIn,
  LogOut
} from 'lucide-react';
import { ToolDefinition } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: 'home' | 'all-tools' | 'tool';
  selectedTool: ToolDefinition | null;
  onNavigateHome: () => void;
  onNavigateAllTools: (category?: string) => void;
  onOpenTool: (tool: ToolDefinition) => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenProfile: () => void;
  allTools: ToolDefinition[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedTool,
  onNavigateHome,
  onNavigateAllTools,
  onOpenTool,
  onOpenAbout,
  onOpenPrivacy,
  onOpenAuth,
  onOpenProfile,
  allTools,
}) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = searchQuery.trim()
    ? allTools.filter(
        t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Docu<span className="text-red-600">Convert</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                All-in-One File Tools
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              id="nav-home-btn"
              onClick={onNavigateHome}
              className={`rounded-lg px-3.5 py-2 transition-colors hover:text-slate-900 hover:bg-slate-100/80 ${
                currentView === 'home' ? 'text-red-600 bg-red-50 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              id="nav-all-tools-btn"
              onClick={() => onNavigateAllTools()}
              className={`rounded-lg px-3.5 py-2 transition-colors hover:text-slate-900 hover:bg-slate-100/80 ${
                currentView === 'all-tools' ? 'text-red-600 bg-red-50 font-semibold' : ''
              }`}
            >
              All Tools ({allTools.length})
            </button>
            <button
              id="nav-about-btn"
              onClick={onOpenAbout}
              className="rounded-lg px-3.5 py-2 transition-colors hover:text-slate-900 hover:bg-slate-100/80"
            >
              About
            </button>
            <button
              id="nav-privacy-btn"
              onClick={onOpenPrivacy}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors hover:text-slate-900 hover:bg-slate-100/80"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Privacy & Security</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              id="nav-search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Search all file tools"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline-block rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                /
              </kbd>
            </button>

            {/* Popular Action */}
            <button
              id="nav-quick-convert-btn"
              onClick={() => onNavigateAllTools()}
              className="hidden lg:flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-98"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-red-400" />
              <span>Browse Catalog</span>
            </button>

            {/* User Account / Sign In / Sign Up Section */}
            {user ? (
              <button
                id="nav-user-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 pl-2 pr-3 py-1 text-xs font-semibold text-slate-700 hover:border-red-300 hover:bg-red-50/50 transition focus:outline-none focus:ring-2 focus:ring-red-500/20"
                title="Account Settings"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-xs overflow-hidden">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="max-w-[90px] sm:max-w-[120px] truncate">
                  {user.displayName || (user.isAnonymous ? 'Guest' : user.email?.split('@')[0])}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="nav-signin-btn"
                  onClick={() => onOpenAuth('signin')}
                  className="rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  Sign In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 active:scale-98 transition"
                >
                  <Sparkles className="h-3 w-3 text-red-200" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="nav-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1.5 text-sm font-medium">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left ${
                  currentView === 'home' ? 'bg-red-50 text-red-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  onNavigateAllTools();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left ${
                  currentView === 'all-tools' ? 'bg-red-50 text-red-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>All Tools</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {allTools.length}
                </span>
              </button>
              <button
                onClick={() => {
                  onOpenAbout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-slate-700 hover:bg-slate-50"
              >
                <Info className="h-4 w-4 text-slate-400" />
                <span>About Platform</span>
              </button>
              <button
                onClick={() => {
                  onOpenPrivacy();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Privacy & Security Guarantee</span>
              </button>

              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="flex items-center justify-between rounded-xl bg-slate-100 px-3.5 py-2.5 text-left text-sm font-semibold text-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-xs">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900">{user.displayName || 'My Account'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email || 'Guest Session'}</p>
                      </div>
                    </div>
                    <span className="text-xs text-red-600 font-medium">Manage</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signin');
                      }}
                      className="flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signup');
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white shadow-sm"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <span>Search All Tools</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6 pt-16 sm:pt-24"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-slate-200 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search tools (e.g., Word to PDF, Compress, Split)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Popular Conversions
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {allTools.filter(t => t.isPopular).slice(0, 8).map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onOpenTool(tool);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 px-2.5 py-1 text-xs text-slate-700 transition"
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredTools.length > 0 ? (
                <div className="space-y-1">
                  {filteredTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onOpenTool(tool);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-slate-100 transition"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{tool.name}</span>
                        <p className="text-xs text-slate-500 line-clamp-1">{tool.shortDesc}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-slate-400 uppercase tracking-wider rounded bg-slate-100 px-2 py-0.5">
                        {tool.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No tools found for "{searchQuery}". Try "pdf", "image", or "compress".
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Press <kbd className="font-semibold text-slate-700">ESC</kbd> to close</span>
              <span>{allTools.length} total tools available</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
