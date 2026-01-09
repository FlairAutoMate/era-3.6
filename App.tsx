
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/auth/AuthView';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { HomeView } from './components/home/HomeView';
import { ActionsView } from './components/actions/ActionsView';
import { ValuePage } from './components/value/ValuePage';
import { VisionPage } from './components/vision/VisionPage';
import { ProfilePage } from './components/settings/ProfilePage';
import { FDVPage } from './components/fdv/FDVPage';
import { JobsPage } from './components/jobs/JobsPage';
import { PartnersPage } from './components/partners/PartnersPage';
import { PortfolioOverview } from './components/portfolio/PortfolioOverview';
import { AssociationPage } from './components/association/AssociationPage';
import { ProDashboard } from './components/pro/ProDashboard';
import { ProJobsPage } from './components/pro/ProJobsPage';
import { ProNewJobPage } from './components/pro/ProNewJobPage';
import { ProRevenuePage } from './components/pro/ProRevenuePage';
import { ProQuotesPage } from './components/pro/ProQuotesPage';
import { ProQuoteEditPage } from './components/pro/ProQuoteEditPage';
import { ProProjectDetailView } from './components/pro/ProProjectDetailView';
import { ChainAnalyticsDashboard } from './components/chain/ChainAnalyticsDashboard';
import { useAppStore } from './lib/store/useAppStore';
import { UserRole } from './types';

export default function App() {
  const { initializeFromSupabase, userRole, setUserRole } = useAppStore();
  const [currentView, setCurrentView] = useState('landing');
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    initializeFromSupabase();

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMouse) setHasMouse(true);
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = target?.closest('button, a, select, input, [role="button"], .interactive-card, .actor-node');
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { capture: true, passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove, { capture: true });
  }, [hasMouse, initializeFromSupabase]);

  const handleNavigate = (view: string, jobId?: string) => {
    if (jobId) setSelectedJobId(jobId);
    setCurrentView(view);
    // Smooth reset of main container scroll
    const main = document.getElementById('era-main-scroll');
    if (main) main.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleRoleSelection = (role: UserRole) => {
    setPendingRole(role);
    setCurrentView('auth');
  };

  const handleAuthComplete = (isNewUser: boolean) => {
    const role = pendingRole || UserRole.HOMEOWNER;
    setUserRole(role);
    if (isNewUser && role === UserRole.HOMEOWNER) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const renderContent = () => {
    // Pure top-level views (no layout wrapper)
    if (currentView === 'landing') {
      return <LandingPage onLogin={handleRoleSelection} onStartAnalyse={() => {
        setUserRole(UserRole.HOMEOWNER);
        handleNavigate('analyze');
      }} onNavigate={handleNavigate} />;
    }

    if (currentView === 'auth') {
      return <AuthView role={pendingRole || UserRole.HOMEOWNER} onComplete={handleAuthComplete} onBack={() => setCurrentView('landing')} />;
    }

    if (currentView === 'onboarding') {
      return <OnboardingPage onComplete={() => handleNavigate('dashboard')} />;
    }

    if (currentView === 'analyze') {
      return <VisionPage onNavigate={handleNavigate} />;
    }

    // Role-aware routed views inside Layout
    const innerContent = () => {
      switch (currentView) {
        case 'dashboard':
          if (userRole === UserRole.PROFESSIONAL) return <ProDashboard onNavigate={handleNavigate} />;
          if (userRole === UserRole.BOARD_MEMBER) return <AssociationPage />;
          if (userRole === UserRole.CHAIN_ADMIN) return <ChainAnalyticsDashboard />;
          return <HomeView onNavigate={handleNavigate} />;

        case 'value': return <ValuePage />;
        case 'actions': return <ActionsView onNavigate={handleNavigate} />;
        case 'settings': return <ProfilePage onNavigate={handleNavigate} onLogout={() => setCurrentView('landing')} />;
        case 'fdv': return <FDVPage />;
        case 'jobs': return <JobsPage onNavigate={handleNavigate} />;
        case 'partners': return <PartnersPage onNavigate={handleNavigate} />;
        case 'portfolio': return <PortfolioOverview onNavigate={handleNavigate} />;

        // Pro specific views
        case 'pro-jobs': return <ProJobsPage onNavigate={handleNavigate} />;
        case 'pro-new-job': return <ProNewJobPage onNavigate={handleNavigate} />;
        case 'pro-quotes': return <ProQuotesPage />;
        case 'pro-revenue': return <ProRevenuePage />;
        case 'pro-quote-edit': return <ProQuoteEditPage jobId={selectedJobId} onBack={() => handleNavigate('pro-jobs')} onComplete={() => handleNavigate('pro-quotes')} />;
        case 'pro-project-detail': return <ProProjectDetailView jobId={selectedJobId!} onBack={() => handleNavigate('pro-jobs')} />;

        default: return <HomeView onNavigate={handleNavigate} />;
      }
    };

    return (
      <Layout currentView={currentView} onNavigate={handleNavigate}>
        {innerContent()}
      </Layout>
    );
  };

  return (
    <div className={`bg-black min-h-screen ${isHovering ? 'cursor-hover' : ''}`}>
      {renderContent()}

      {hasMouse && (
        <>
          <div
            className="custom-cursor pointer-events-none"
            style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
          />
          <div
            className="custom-cursor-follower pointer-events-none"
            style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
          />
        </>
      )}
    </div>
  );
}
