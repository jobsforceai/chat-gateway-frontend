import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="chat-theme flex h-screen items-center justify-center">
    <div className="glass-panel max-w-md rounded-2xl p-8 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
      <h2 className="mt-4 text-xl font-bold text-white">An Error Occurred</h2>
      <p className="mt-2 text-slate-300">{message}</p>
    </div>
  </div>
);
