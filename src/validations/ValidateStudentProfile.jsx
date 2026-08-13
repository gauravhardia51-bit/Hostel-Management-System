export const ValidateStudentProfile = (values) => {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(values.phone)) {
    errors.phone = "Enter a valid 10-digit phone number";
  }

  return errors;
};
