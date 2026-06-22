import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  LandingPage,
  LoginPage,
  OnboardingPage,
  DashboardPage,
  SyllabusAnalyzerPage,
  StudyPlannerPage,
  NotesGeneratorPage,
  SmartRevisionPage,
  MockTestPage,
  ActiveMockTestPage,
  MockTestResultsPage,
  DoubtSolverPage,
  AnalyticsDashboardPage,
  FocusCenterPage,
  SettingsPage,
  SupportPage,
  StudySessionPage
} from './pages';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Onboarding Flow */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Workspace */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/syllabus" element={<SyllabusAnalyzerPage />} />
          <Route path="/planner" element={<StudyPlannerPage />} />
          <Route path="/notes" element={<NotesGeneratorPage />} />
          <Route path="/revision" element={<SmartRevisionPage />} />
          <Route path="/mocktest" element={<MockTestPage />} />
          <Route path="/mocktest/active" element={<ActiveMockTestPage />} />
          <Route path="/mocktest/results" element={<MockTestResultsPage />} />
          <Route path="/chat" element={<DoubtSolverPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/focus" element={<FocusCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/session" element={<StudySessionPage />} />
        </Route>

        {/* Fallback Redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
