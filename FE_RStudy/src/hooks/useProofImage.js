import { useEffect, useState } from "react";
import { invoiceApi } from "../api/invoiceApi";

export function useProofImage(invoiceId, reloadKey = 0) {
  const key = `${invoiceId}:${reloadKey}`;
  const [state, setState] = useState({ key: null, url: "", error: "" });

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    invoiceApi
      .getProof(invoiceId)
      .then((res) => {
        const blob = res instanceof Blob ? res : res.data;
        objectUrl = URL.createObjectURL(blob);
        if (active) setState({ key, url: objectUrl, error: "" });
      })
      .catch((err) => {
        if (active) setState({ key, url: "", error: err.message || "Không tải được ảnh minh chứng" });
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [invoiceId, key]);

  const ready = state.key === key;
  return { url: ready ? state.url : "", error: ready ? state.error : "", loading: !ready };
}
