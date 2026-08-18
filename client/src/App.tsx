import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import type { DailyLog, LogInput, User } from "./types";
import { Landing } from "./components/Landing";
import { Dashboard } from "./components/Dashboard";

const authMessages: Record<string, string> = {
  google_not_configured: "Google sign-in has not been configured.",
  google_token_exchange_failed: "Google could not complete the secure sign-in exchange. Please try again.",
  google_identity_verification_failed: "Google signed you in, but the returned identity could not be verified.",
  google_account_save_failed: "Google signed you in, but your LunaJoy account could not be saved.",
};

function getAuthMessage(code: string) {
  return authMessages[code] ?? "Google sign-in was not completed. Please try again.";
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const authTabReturn = params.has("authComplete") && sessionStorage.getItem("lunajoy:google-auth-tab") === "true";
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (authTabReturn) {
      const authResult = { type: "lunajoy:google-auth", authError: params.get("authError") };
      const channel = new BroadcastChannel("lunajoy:google-auth");
      channel.postMessage(authResult);
      channel.close();
      window.opener?.postMessage(authResult, window.location.origin);
      window.opener?.focus();
      sessionStorage.removeItem("lunajoy:google-auth-tab");
      window.close();
      return;
    }

    const authIssue = params.get("authError");
    if (authIssue) {
      setAuthError(getAuthMessage(authIssue));
      window.history.replaceState({}, "", "/");
    } else if (params.has("authComplete")) {
      window.history.replaceState({}, "", "/");
    }
    api
      .session()
      .then((response) => setUser(response.user))
      .catch(() => undefined)
      .finally(() => setCheckingSession(false));
  }, [authTabReturn]);

  useEffect(() => {
    const finishGoogleAuth = async (data: { type?: string; authError?: string | null }) => {
      if (data.type !== "lunajoy:google-auth") return;
      const authIssue = typeof data.authError === "string" ? data.authError : "";
      if (authIssue) {
        setAuthError(getAuthMessage(authIssue));
        return;
      }

      setAuthError("");
      try {
        const response = await api.session();
        setUser(response.user);
      } catch {
        setAuthError("Google sign-in completed, but the session could not be loaded. Please try again.");
      }
    };

    const handleAuthMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin) void finishGoogleAuth(event.data);
    };
    const channel = new BroadcastChannel("lunajoy:google-auth");
    channel.onmessage = (event) => void finishGoogleAuth(event.data);
    window.addEventListener("message", handleAuthMessage);
    return () => {
      channel.close();
      window.removeEventListener("message", handleAuthMessage);
    };
  }, []);

  const loadLogs = useCallback(async () => {
    if (!user) return;
    setLoadingLogs(true);
    try {
      const response = await api.logs(period);
      setLogs(response.logs);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Could not load your check-ins.");
    } finally {
      setLoadingLogs(false);
    }
  }, [period, user]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (!user) return;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.host}/api/updates`);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as { type: string; log?: DailyLog; date?: string };
      if (message.type === "log.updated" && message.log) {
        setLogs((current) => [...current.filter((log) => log.date !== message.log!.date), message.log!].sort((a, b) => a.date.localeCompare(b.date)));
      }
      if (message.type === "log.deleted" && message.date) {
        setLogs((current) => current.filter((log) => log.date !== message.date));
      }
    };
    return () => socket.close();
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const logout = async () => {
    await api.logout();
    setUser(null);
    setLogs([]);
  };

  const saveLog = async (input: LogInput) => {
    setSaving(true);
    try {
      const existing = logs.some((log) => log.date === input.date);
      const response = await api.saveLog(input);
      setLogs((current) => [...current.filter((log) => log.date !== response.log.date), response.log].sort((a, b) => a.date.localeCompare(b.date)));
      setToast(existing ? "Today’s check-in was updated." : "Your check-in is safely saved.");
    } finally {
      setSaving(false);
    }
  };

  const deleteLog = async (date: string) => {
    setDeleting(true);
    try {
      await api.deleteLog(date);
      setLogs((current) => current.filter((log) => log.date !== date));
      setToast("Today’s check-in was deleted.");
    } finally {
      setDeleting(false);
    }
  };

  if (authTabReturn || checkingSession) return <div className="min-h-screen bg-cream" />;
  if (!user) return <Landing error={authError} />;

  return <Dashboard user={user} logs={logs} period={period} loadingLogs={loadingLogs} saving={saving} deleting={deleting} toast={toast} onPeriodChange={setPeriod} onSave={saveLog} onDelete={deleteLog} onLogout={logout} />;
}

export default App;
