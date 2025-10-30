import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  message: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => (
  <div className="chat-theme flex h-screen flex-col items-center justify-center gap-4">
    <Loader className="h-8 w-8 animate-spin text-blue-400" />
    <p className="text-slate-300">{message}</p>
  </div>
);
