import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { examApi } from "../../../api/examApi";
import Button from "../../../components/ui/Button";
import FormAlert from "../../../components/ui/FormAlert";
import TextField from "../../../components/ui/TextField";
import { ROUTES } from "../../../constants/routes";
import QuestionFields from "./QuestionFields";
import { EMPTY_QUESTION, examSchema, toExamBody } from "./examSchema";

export default function ExamForm({ courseId }) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: { examName: "", durationMinutes: "30", passingScore: "5", maxAttempts: "3", showAnswers: false, questions: [EMPTY_QUESTION()] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      await examApi.create(toExamBody(courseId, values));
      navigate(`${ROUTES.TEACHER.EXAMS}?courseId=${courseId}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <section className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <TextField id="examName" label="Tên đề thi" required error={errors.examName?.message} {...register("examName")} />
        </div>
        <TextField id="durationMinutes" label="Thời gian làm bài (phút)" inputMode="numeric" required error={errors.durationMinutes?.message} {...register("durationMinutes")} />
        <TextField id="passingScore" label="Điểm đạt" inputMode="decimal" required error={errors.passingScore?.message} {...register("passingScore")} />
        <TextField id="maxAttempts" label="Số lượt làm tối đa" hint="Từ 1 đến 10 lượt" inputMode="numeric" required error={errors.maxAttempts?.message} {...register("maxAttempts")} />
        <label className="flex cursor-pointer items-start gap-3 sm:col-span-3">
          <input type="checkbox" className="mt-0.5 size-4 accent-primary" {...register("showAnswers")} />
          <span>
            <span className="block text-sm font-medium text-ink">Cho học viên xem đáp án đúng sau khi nộp bài</span>
            <span className="block text-xs text-muted">Nếu cho làm lại nhiều lượt thì học viên có thể dùng đáp án đã xem cho các lượt sau. Có thể đổi sau trong danh sách đề thi.</span>
          </span>
        </label>
      </section>
      {fields.map((field, index) => (
        <QuestionFields key={field.id} index={index} register={register} control={control} setValue={setValue} errors={errors} canRemove={fields.length > 1} onRemove={() => remove(index)} />
      ))}
      {errors.questions?.message && <FormAlert message={errors.questions.message} />}
      <FormAlert message={submitError} />
      <div className="flex flex-wrap justify-between gap-3">
        <Button variant="outline" onClick={() => append(EMPTY_QUESTION())}>
          Thêm câu hỏi
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Lưu đề thi
        </Button>
      </div>
    </form>
  );
}
