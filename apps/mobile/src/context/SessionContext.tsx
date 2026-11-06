import { createContext, useContext, useState } from 'react';
import type { OnboardingAnswers } from '@/types/onboarding';

type SessionContextValue = {
  answers: OnboardingAnswers | null;
  setAnswers: (answers: OnboardingAnswers) => void;
  clearAnswers: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswersState] = useState<OnboardingAnswers | null>(null);

  function setAnswers(a: OnboardingAnswers) {
    setAnswersState(a);
  }

  function clearAnswers() {
    setAnswersState(null);
  }

  return (
    <SessionContext.Provider value={{ answers, setAnswers, clearAnswers }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
