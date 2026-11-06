import TextField from "../../components/ui/TextField";

export default function TeacherFields({ register, errors }) {
  return (
    <>
      <TextField id="specialization" label="Chuyên môn" placeholder="Ví dụ: Lập trình Web" required error={errors.specialization?.message} {...register("specialization")} />
      <TextField
        id="teachingExperience"
        label="Kinh nghiệm giảng dạy"
        placeholder="Kinh nghiệm giảng dạy"
        multiline
        required
        error={errors.teachingExperience?.message}
        {...register("teachingExperience")}
      />
      <TextField id="biography" label="Giới thiệu bản thân" placeholder="Giới thiệu bản thân" multiline required error={errors.biography?.message} {...register("biography")} />
    </>
  );
}
