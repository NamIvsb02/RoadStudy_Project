import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import TextField from "../../../components/ui/TextField";
import { EMPTY_COUPON, couponSchema, toBody, toFormValues } from "./couponSchema";

export default function CouponForm({ coupon, onSubmit, onCancel }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(couponSchema), defaultValues: coupon ? toFormValues(coupon) : EMPTY_COUPON });
  const isPercent = watch("discountType") === "PERCENTAGE";
  const codeLocked = Boolean(coupon && coupon.usedCount > 0);

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
      await onSubmit(toBody(values, coupon));
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField
          id="code"
          label="Mã giảm giá"
          placeholder="Ví dụ: GIAM10"
          hint={codeLocked ? "Mã đã có người dùng nên không đổi được" : "Tự động viết hoa"}
          disabled={codeLocked}
          required
          error={errors.code?.message}
          className="uppercase"
          {...register("code")}
        />
      </div>
      <fieldset className="flex flex-wrap gap-4 sm:col-span-2">
        <legend className="mb-1 text-sm font-medium text-ink">Kiểu giảm giá</legend>
        {[
          ["PERCENTAGE", "Theo phần trăm"],
          ["AMOUNT", "Theo số tiền"],
        ].map(([value, label]) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="radio" value={value} className="size-4 accent-primary" {...register("discountType")} />
            {label}
          </label>
        ))}
      </fieldset>
      <TextField id="discountValue" label={isPercent ? "Phần trăm giảm (%)" : "Số tiền giảm (VND)"} inputMode="decimal" required error={errors.discountValue?.message} {...register("discountValue")} />
      <TextField id="usageLimit" label="Số lượt dùng tối đa" inputMode="numeric" required error={errors.usageLimit?.message} {...register("usageLimit")} />
      <TextField id="startDate" type="date" label="Có hiệu lực từ ngày" required error={errors.startDate?.message} {...register("startDate")} />
      <TextField id="endDate" type="date" label="Đến hết ngày" required error={errors.endDate?.message} {...register("endDate")} />
      <div className="sm:col-span-2">
        <FormAlert message={submitError} />
      </div>
      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {coupon ? "Lưu thay đổi" : "Tạo mã"}
        </Button>
      </div>
    </form>
  );
}
