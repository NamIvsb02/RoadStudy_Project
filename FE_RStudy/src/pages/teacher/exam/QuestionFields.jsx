import { useFieldArray } from "react-hook-form";
import Button from "../../../components/ui/Button";
import TextField from "../../../components/ui/TextField";

export default function QuestionFields({ index, register, control, setValue, errors, canRemove, onRemove }) {
  const path = `questions.${index}`;
  const error = errors.questions?.[index];
  const { fields, append, remove } = useFieldArray({ control, name: `${path}.options` });

  const handleRemoveOption = (optionIndex) => {
    remove(optionIndex);
    setValue(`${path}.correctIndex`, "0");
  };

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-primary">Câu {index + 1}</legend>
      <TextField id={`${path}.content`} label="Nội dung câu hỏi" multiline rows={3} required error={error?.content?.message} {...register(`${path}.content`)} />
      <div className="max-w-40">
        <TextField id={`${path}.score`} label="Điểm" inputMode="decimal" required error={error?.score?.message} {...register(`${path}.score`)} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">Đáp án (chọn một đáp án đúng)</p>
        {fields.map((field, optionIndex) => (
          <div key={field.id} className="flex items-start gap-3">
            <input
              type="radio"
              value={String(optionIndex)}
              aria-label={`Đáp án ${String.fromCharCode(65 + optionIndex)} là đáp án đúng`}
              className="mt-3 size-4 accent-primary"
              {...register(`${path}.correctIndex`)}
            />
            <span className="mt-2.5 w-4 font-semibold text-primary">{String.fromCharCode(65 + optionIndex)}</span>
            <div className="flex-1">
              <TextField
                id={`${path}.options.${optionIndex}`}
                aria-label={`Nội dung đáp án ${String.fromCharCode(65 + optionIndex)}`}
                error={error?.options?.[optionIndex]?.content?.message}
                {...register(`${path}.options.${optionIndex}.content`)}
              />
            </div>
            {fields.length > 2 && (
              <Button variant="ghost" className="h-10 px-3" onClick={() => handleRemoveOption(optionIndex)}>
                Xóa
              </Button>
            )}
          </div>
        ))}
        {(error?.options?.message || error?.options?.root?.message || error?.correctIndex?.message) && (
          <p role="alert" className="text-sm text-danger">
            {error.options?.message || error.options?.root?.message || error.correctIndex.message}
          </p>
        )}
        {fields.length < 10 && (
          <Button variant="outline" className="self-start" onClick={() => append({ content: "" })}>
            Thêm đáp án
          </Button>
        )}
      </div>
      {canRemove && (
        <Button variant="secondary" className="self-end" onClick={onRemove}>
          Xóa câu hỏi này
        </Button>
      )}
    </fieldset>
  );
}
