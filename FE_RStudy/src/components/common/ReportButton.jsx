import { useState } from "react";
import { ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import ReportDialog from "./ReportDialog";

const REPORTERS = [ROLES.STUDENT, ROLES.TEACHER];

export default function ReportButton({ target }) {
  const { account } = useAuth();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  if (!REPORTERS.includes(account?.role)) return null;

  const handleOpen = () => {
    setSent(false);
    setOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className="text-sm text-muted transition-colors hover:text-danger hover:underline">
        Báo cáo
      </button>
      <ReportDialog open={open} sent={sent} target={target} onClose={() => setOpen(false)} onSent={() => setSent(true)} />
    </>
  );
}
