import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Calendar,
  Clock,
  History,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchRecentConversions, ConversionRecord } from '../services/historyService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToolById?: (toolId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectToolById,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.uid && activeTab === 'history') {
      setHistoryLoading(true);
      fetchRecentConversions(user.uid, 12)
        .then(res => setHistory(res))
        .finally(() => setHistoryLoading(false));
    }
  }, [isOpen, user?.uid, activeTab]);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  const displayName = user.displayName || (user.isAnonymous ? 'Guest User' : 'DocuConvert User');
  const email = user.email || (user.isAnonymous ? 'Anonymous Session' : 'No email associated');
  const creationDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : 'Today';

  const providerId = user.providerData[0]?.providerId || (user.isAnonymous ? 'anonymous' : 'password');
  const providerLabel = providerId === 'google.com' 
    ? 'Google (Gmail)' 
    : providerId === 'github.com'
    ? 'GitHub'
    : providerId === 'anonymous'
    ? 'Guest Session'
    : 'Email & Password';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white text-center relative">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-bold text-2xl shadow-lg ring-4 ring-white/10 overflow-hidden">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={displayName} 
                className="h-full w-full object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h3 className="text-lg font-bold font-['Outfit',sans-serif]">{displayName}</h3>
          <p className="text-xs text-slate-300 font-mono mt-0.5">{email}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Connected via {providerLabel}</span>
          </div>

          {/* Tab Selector */}
          <div className="mt-5 flex rounded-xl bg-white/10 p-1 text-xs font-semibold text-white/80">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
                activeTab === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-white'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Profile Info</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
                activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Conversion History</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {activeTab === 'profile' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Joined
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{creationDate}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Account Tier
                  </span>
                  <p className="text-sm font-semibold text-slate-800">Standard Unlimited</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <h4 className="text-xs font-semibold text-slate-900 mb-1">Authentication Credentials</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><span className="text-slate-400">UID:</span> <span className="font-mono text-[11px]">{user.uid}</span></p>
                  <p><span className="text-slate-400">Method:</span> <span className="font-semibold text-slate-700">{providerLabel}</span></p>
                  <p><span className="text-slate-400">Email Verified:</span> <span className="font-semibold text-emerald-600">{user.emailVerified ? 'Yes' : 'Active'}</span></p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-semibold block text-emerald-800 mb-0.5">Privacy First</span>
                  Files are processed client-side in your browser sandbox without persistent server uploads.
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {historyLoading ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  Loading your recent conversion logs...
                </div>
              ) : history.length > 0 ? (
                history.map(item => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs hover:border-slate-200 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 truncate max-w-[200px]">{item.fileName}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.toolName} • {Math.round(item.fileSize / 1024)} KB
                        </p>
                      </div>
                    </div>
                    {onSelectToolById && (
                      <button
                        onClick={() => {
                          onSelectToolById(item.toolId);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        <span>Re-use</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  <p className="font-medium text-slate-700">No conversions recorded yet</p>
                  <p className="text-slate-400 mt-0.5">Your completed document and image conversions will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              id="profile-logout-btn"
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
