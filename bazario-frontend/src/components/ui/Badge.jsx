const STATUS_STYLES = {
  approved: "bg-success-light text-success-dark",
  delivered: "bg-success-light text-success-dark",
  active: "bg-success-light text-success-dark",
  pending: "bg-accent-light text-accent-dark",
  processing: "bg-accent-light text-accent-dark",
  shipped: "bg-primary-50 text-primary-dark",
  rejected: "bg-danger-light text-danger-dark",
  cancelled: "bg-danger-light text-danger-dark",
  suspended: "bg-danger-light text-danger-dark",
  hidden: "bg-ink/5 text-ink-soft",
};

export default function Badge({ status, children }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || "bg-ink/5 text-ink-soft";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}
    >
      {children || status?.replace(/_/g, " ")}
    </span>
  );
}
