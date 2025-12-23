import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SuccessScreen } from "@/components/SuccessScreen";

type AppState = "welcome" | "form" | "success";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");

  const handleStart = () => setAppState("form");
  const handleSuccess = () => setAppState("success");
  const handleBack = () => setAppState("welcome");

  return (
    <>
      {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {appState === "form" && (
        <ApplicationForm onSuccess={handleSuccess} onBack={handleBack} />
      )}
      {appState === "success" && <SuccessScreen />}
    </>
  );
};

export default Index;
