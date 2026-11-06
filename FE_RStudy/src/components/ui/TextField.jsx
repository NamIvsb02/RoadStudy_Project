import { forwardRef } from "react";
import FormField from "./FormField";
import { inputClass } from "./inputClass";

const TextField = forwardRef(function TextField({ id, label, error, hint, required = false, multiline = false, ...props }, ref) {
  const Tag = multiline ? "textarea" : "input";

  return (
    <FormField label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <Tag id={id} ref={ref} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={inputClass(Boolean(error), multiline)} {...props} />
    </FormField>
  );
});

export default TextField;
