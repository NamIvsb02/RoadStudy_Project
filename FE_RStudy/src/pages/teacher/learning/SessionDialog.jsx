import { useEffect, useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import TextField from "../../../components/ui/TextField";
import { fadeIn, scaleIn } from "../../../constants/motion";
import { fromInputValue, toInputValue } from "../../learn/sessionFormat";

const schema = z
  .object({
    title: z.string().trim().min(1, "Nhập tiêu đề").max(200, "Tiêu đề tối đa 200 ký tự"),
    startTime: z.string().min(1, "Chọn giờ bắt đầu"),
    endTime: z.string().min(1, "Chọn giờ kết thúc"),
    note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự"),
  })
  .refine((session) => !session.startTime || !session.endTime || session.endTime > session.startTime, { message: "Giờ kết thúc phải sau giờ bắt đầu", path: ["endTime"] });

function SessionForm({ session, onSubmit, onCancel }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: session
      ? { title: session.title, startTime: toInputValue(session.startTime), endTime: toInputValue(session.endTime), note: session.note ?? "" }
      : { title: "", startTime: "", endTime: "", note: "" },
  });

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !isSubmitting) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSubmitting, onCancel]);

  const submit = async (values) => {
    setSubmitError("");
    try {
      await onSubmit({ title: values.title, startTime: fromInputValue(values.startTime), endTime: fromInputValue(values.endTime), note: values.note || null });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField id="title" label="Tiêu đề buổi học" required error={errors.title?.message} {...register("title")} />
      </div>
      <TextField id="startTime" type="datetime-local" label="Bắt đầu" required error={errors.startTime?.message} {...register("startTime")} />
      <TextField id="endTime" type="datetime-local" label="Kết thúc" required error={errors.endTime?.message} {...register("endTime")} />
      <div className="sm:col-span-2">
        <TextField id="note" label="Ghi chú" hint="Không bắt buộc" error={errors.note?.message} {...register("note")} />
      </div>
      <div className="sm:col-span-2">
        <FormAlert message={submitError} />
      </div>
      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {session ? "Lưu thay đổi" : "Thêm buổi học"}
        </Button>
      </div>
    </form>
  );
}

export default function SessionDialog({ dialog, onSubmit, onClose }) {
  const titleId = useId();

  return (
    <AnimatePresence>
      {dialog && (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 flex overflow-y-auto bg-black/40 p-4">
          <motion.div variants={scaleIn} role="dialog" aria-modal="true" aria-labelledby={titleId} className="m-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-card-hover">
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {dialog.session ? "Sửa buổi học" : "Thêm buổi học"}
            </h2>
            <p className="mt-1 text-sm text-muted">Giờ theo múi giờ Việt Nam. Học viên của khóa sẽ nhận thông báo.</p>
            <SessionForm key={dialog.session?.id ?? "new"} session={dialog.session} onSubmit={onSubmit} onCancel={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
