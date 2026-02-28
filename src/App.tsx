import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SplashScreen from "./pages/SplashScreen";
import HomeDashboard from "./pages/HomeDashboard";
import AIInsightPage from "./pages/AIInsightPage";
import EmergencyContactsScreen from "./pages/EmergencyContactsScreen";
import EmergencyAlertScreen from "./pages/EmergencyAlertScreen";
import GuardianSyncScreen from "./pages/GuardianSyncScreen";
import HealthHistoryScreen from "./pages/HealthHistoryScreen";
import ReportsScreen from "./pages/ReportsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import PersonalInfoScreen from "./pages/PersonalInfoScreen";
import MedicalRecordsScreen from "./pages/MedicalRecordsScreen";
import NotificationPrefsScreen from "./pages/NotificationPrefsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <div className="min-h-screen bg-[linear-gradient(45deg,hsl(var(--background)),hsl(var(--muted)),hsl(var(--accent)/20),hsl(var(--background)))] bg-[length:400%_400%] animate-background-pan flex items-center justify-center p-0 sm:p-4 md:p-8">
            <div className="relative mx-auto w-full max-w-[480px] h-[100dvh] sm:h-[850px] bg-background sm:rounded-[3rem] shadow-2xl sm:border-[8px] border-white/90 dark:border-white/10 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 flex flex-col transition-all duration-300 hover:shadow-cyan-500/10">

              {/* Main Content Scroll Area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth">
                <Routes>

                  {/* Public */}
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Admin Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomeDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ai"
                    element={
                      <ProtectedRoute>
                        <AIInsightPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ai"
                    element={
                      <ProtectedRoute>
                        <AIInsightPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/emergency-contacts"
                    element={
                      <ProtectedRoute>
                        <EmergencyContactsScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/emergency-alert"
                    element={
                      <ProtectedRoute>
                        <EmergencyAlertScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/guardian-sync"
                    element={
                      <ProtectedRoute>
                        <GuardianSyncScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/health-history"
                    element={
                      <ProtectedRoute>
                        <HealthHistoryScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <ReportsScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile/personal-info"
                    element={
                      <ProtectedRoute>
                        <PersonalInfoScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile/medical-records"
                    element={
                      <ProtectedRoute>
                        <MedicalRecordsScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile/notifications"
                    element={
                      <ProtectedRoute>
                        <NotificationPrefsScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsScreen />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />

                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;