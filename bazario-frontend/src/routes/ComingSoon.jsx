import { useAuth } from "@/features/auth/AuthContext";

export default function ComingSoon({ title }) {
  const { user } = useAuth();
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
      <p className="text-sm text-ink-soft">
        Logged in as <span className="font-mono">{user?.email}</span>. This screen is next on
        the build list.
      </p>
    </div>
  );
}
