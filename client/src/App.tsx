import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import FAQ from "./components/FAQ";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Analysis from "./pages/Analysis";
import Bilan from "./pages/Bilan";
import Results from "./pages/Results";
import Program from "./pages/Program";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/home" component={Home} />
      <Route path="/bilan" component={Bilan} />
      <Route path="/results" component={Results} />
      <Route path="/program" component={Program} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// Design: Dark Mode with Orange Accent
// - Dark background (#0f0f0f) with light text (#e8e8e8)
// - Primary accent: Orange (#ff9500)
// - Secondary: Dark gray (#1a1a1a, #2a2a2a)

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FAQ />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
