import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PopularTools } from './components/PopularTools';
import { AllToolsView } from './components/AllToolsView';
import { ToolWorkspace } from './components/ToolWorkspace';
import { HowItWorks } from './components/HowItWorks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { AboutModal } from './components/AboutModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { TOOLS } from './data/tools';
import { ToolDefinition } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'all-tools' | 'tool'>('home');
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pendingFile, setPendingFile] = useState<File | undefined>(undefined);

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedTool]);

  const handleOpenTool = (tool: ToolDefinition, file?: File) => {
    setSelectedTool(tool);
    setPendingFile(file);
    setCurrentView('tool');
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedTool(null);
    setPendingFile(undefined);
  };

  const handleNavigateAllTools = (category: string = 'all') => {
    setSelectedCategory(category);
    setCurrentView('all-tools');
    setSelectedTool(null);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        selectedTool={selectedTool}
        onNavigateHome={handleNavigateHome}
        onNavigateAllTools={handleNavigateAllTools}
        onOpenTool={handleOpenTool}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setProfileModalOpen(true)}
        allTools={TOOLS}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              tools={TOOLS}
              onSelectTool={handleOpenTool}
              onExploreAll={() => handleNavigateAllTools('all')}
            />

            <PopularTools
              tools={TOOLS}
              onSelectTool={handleOpenTool}
              onViewAll={() => handleNavigateAllTools('all')}
            />

            <HowItWorks />

            <WhyChooseUs />

            <FaqSection />
          </>
        )}

        {currentView === 'all-tools' && (
          <AllToolsView
            tools={TOOLS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectTool={handleOpenTool}
            onBackHome={handleNavigateHome}
          />
        )}

        {currentView === 'tool' && selectedTool && (
          <ToolWorkspace
            tool={selectedTool}
            initialFile={pendingFile}
            onBack={() => handleNavigateAllTools(selectedTool.category)}
            onSelectOtherTool={(toolId) => {
              const next = TOOLS.find(t => t.id === toolId);
              if (next) handleOpenTool(next);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        tools={TOOLS}
        onSelectTool={handleOpenTool}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onNavigateCategory={handleNavigateAllTools}
      />

      {/* Modals */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
        onSuccess={() => {
          handleNavigateHome();
        }}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSelectToolById={(toolId) => {
          const t = TOOLS.find(x => x.id === toolId);
          if (t) handleOpenTool(t);
        }}
      />
    </div>
  );
}
