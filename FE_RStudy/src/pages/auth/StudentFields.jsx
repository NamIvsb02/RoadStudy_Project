import FormField from "../../components/ui/FormField";
import TextField from "../../components/ui/TextField";
import { inputClass } from "../../components/ui/inputClass";

const GENDER_OPTIONS = [
  { value: "NAM", label: "Nam" },
  { value: "NU", label: "Nữ" },
  { value: "KHAC", label: "Khác" },
  { value: "KHONG_TIET_LO", label: "Không tiết lộ" },
];

export default function StudentFields({ register, errors }) {
  return (
    <>
      <FormField label="Giới tính" htmlFor="gender" error={errors.gender?.message}>
        <select id="gender" className={inputClass(Boolean(errors.gender))} {...register("gender")}>
          <option value="">Chọn giới tính</option>
          {GENDER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>
      <TextField id="dateOfBirth" type="date" label="Ngày sinh" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
      <TextField id="address" label="Địa chỉ" placeholder="Địa chỉ" autoComplete="street-address" error={errors.address?.message} {...register("address")} />
    </>
  );
}
