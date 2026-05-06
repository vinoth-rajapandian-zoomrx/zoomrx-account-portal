"use client";

import { useEffect, useState } from "react";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { msalInstance, loginRequest } from "@/config/msal";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (inProgress === InteractionStatus.None && !isAuthenticated) {
      instance.loginRedirect(loginRequest);
    }
    if (isAuthenticated) {
      setReady(true);
    }
  }, [instance, inProgress, isAuthenticated]);

  if (!ready) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-[20px] font-semibold mb-2">ZoomRx Knowledge Portal</div>
          <div className="text-[14px] text-text-dim">Authenticating with ZoomRx...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    msalInstance.initialize().then(() => {
      msalInstance.handleRedirectPromise().then(() => {
        setInitialized(true);
      });
    });
  }, []);

  if (!initialized) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center">
        <div className="text-[14px] text-text-dim">Loading...</div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthGuard>{children}</AuthGuard>
    </MsalProvider>
  );
}
