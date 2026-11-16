import { useState } from "react";
import { resourceApi } from "../../api/resourceApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../hooks/useAuth";
import ResourceBrowser from "../resource/ResourceBrowser";
import UploadForm from "./resource/UploadForm";

export default function TeacherResourcesPage() {
  const { account } = useAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const reload = () => setReloadKey((key) => key + 1);

  const handleDelete = async () => {
    setDeleting(true);
    setActionError("");
    try {
      await resourceApi.remove(target.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeleting(false);
      setTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <UploadForm onUploaded={reload} />
      {actionError && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {actionError}
        </p>
      )}
      <ResourceBrowser reloadKey={reloadKey} canDelete={(resource) => resource.uploadedBy?.id === account.teacher?.id} onDelete={setTarget} />
      <ConfirmDialog
        open={Boolean(target)}
        title="Xóa tài liệu?"
        message={target?.resourceName}
        confirmLabel="Xóa"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
