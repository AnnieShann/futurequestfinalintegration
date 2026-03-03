import { useState, useRef } from 'react';
import SplashScreen from '@/components/SplashScreen';
import OnboardingFlow from '@/components/OnboardingFlow';
import GameMap, { type GameMapHandle } from '@/components/map/GameMap';
import SocialHub from '@/components/social/SocialHub';
import MainNavBar from '@/components/MainNavBar';
import SimulationView from '@/components/map/SimulationView';
import FloodSimulationView from '@/components/map/FloodSimulationView';
import IncidentResponseView from '@/components/map/IncidentResponseView';
import CongratulationsOverlay from '@/components/map/CongratulationsOverlay';
import GuidedTour from '@/components/tour/GuidedTour';
import { shouldShowTour } from '@/components/tour/useTourState';
import { PartyProvider } from '@/contexts/PartyContext';
import { organizations, maya, vibeStatements, type Vibe } from '@/data/mockData';

type Screen = 'splash' | 'onboarding' | 'app';
type AppView = 'map' | 'social';

interface SimResult {
  leadershipStyle: 'aggressive' | 'cautious' | 'strategic';
  xpEarned: number;
  badge: string;
  skills: string[];
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeView, setActiveView] = useState<AppView>('map');
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<{ orgId: string; result: SimResult } | null>(null);
  const [showTour, setShowTour] = useState(shouldShowTour);

  const gameMapRef = useRef<GameMapHandle>(null);

  const handleSimComplete = (result: SimResult) => {
    if (activeSimulation) {
      setSimResult({ orgId: activeSimulation, result });
    }
    setActiveSimulation(null);
  };

  return (
    <div className="h-full w-full bg-background overflow-hidden">
      {screen === 'splash' && (
        <SplashScreen onStart={() => setScreen('onboarding')} />
      )}

      {screen === 'onboarding' && (
        <OnboardingFlow onComplete={({ name, vibe, passions, profilePhoto }) => {
          maya.name = name;
          maya.vibe = vibe;
          maya.statement = vibeStatements[vibe];
          maya.passions = passions;
          if (profilePhoto) maya.photo = profilePhoto;
          setScreen('app');
        }} />
      )}

      {screen === 'app' && (
        <PartyProvider>
          <div className="fixed inset-0">
            <div className={activeView === 'map' ? 'block h-full' : 'hidden'}>
              <GameMap
                ref={gameMapRef}
                onStartSimulation={(orgId) => setActiveSimulation(orgId)}
              />
            </div>
            {activeView === 'social' && <SocialHub />}
            <MainNavBar activeView={activeView} onViewChange={setActiveView} />
            <div id="overlay-root" />
          </div>

          {showTour && (
            <GuidedTour
              onComplete={() => setShowTour(false)}
              onSetActiveView={setActiveView}
              gameMapRef={gameMapRef}
            />
          )}

          {activeSimulation && (() => {
            const simOrg = organizations.find(o => o.id === activeSimulation);
            const simId = simOrg?.simulationId || 'silent-breach';
            if (simId === 'after-the-flood') {
              return (
                <FloodSimulationView
                  onComplete={handleSimComplete}
                  onExit={() => setActiveSimulation(null)}
                />
              );
            }
            if (simId === 'incident-response') {
              return (
                <IncidentResponseView
                  onComplete={handleSimComplete}
                  onExit={() => setActiveSimulation(null)}
                />
              );
            }
            return (
              <SimulationView
                onComplete={handleSimComplete}
                onExit={() => setActiveSimulation(null)}
              />
            );
          })()}

          {simResult && (
            <CongratulationsOverlay
              result={simResult.result}
              orgName={organizations.find(o => o.id === simResult.orgId)?.name || 'Organization'}
              onDismiss={() => setSimResult(null)}
            />
          )}
        </PartyProvider>
      )}
    </div>
  );
};

export default Index;
