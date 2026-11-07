import { ROLES } from "../../constants/roles";

const toNull = (value) => (value === "" ? null : value);

export const toFormValues = (account) => {
  const base = { fullName: account.fullName, phoneNumber: account.phoneNumber ?? "" };
  if (account.role === ROLES.STUDENT) {
    const student = account.student ?? {};
    return {
      ...base,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
      gender: student.gender ?? "",
      address: student.address ?? "",
    };
  }
  if (account.role === ROLES.TEACHER) {
    const teacher = account.teacher ?? {};
    return {
      ...base,
      specialization: teacher.specialization ?? "",
      biography: teacher.biography ?? "",
      teachingExperience: teacher.teachingExperience ?? "",
    };
  }
  return base;
};

export const toPayload = (role, values) => {
  const payload = { fullName: values.fullName, phoneNumber: toNull(values.phoneNumber) };
  if (role === ROLES.STUDENT) {
    payload.dateOfBirth = toNull(values.dateOfBirth);
    payload.gender = toNull(values.gender);
    payload.address = toNull(values.address);
  }
  if (role === ROLES.TEACHER) {
    payload.specialization = values.specialization;
    payload.biography = values.biography;
    payload.teachingExperience = values.teachingExperience;
  }
  return payload;
};
