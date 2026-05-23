export const validateStudent = (values, mode = "add") => {
  let errors = {};

  if (!values.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^[0-9]{10}$/.test(values.phone)) {
    errors.phone = "Enter valid 10-digit phone";
  }

  // Email only add mode me
  if (mode === "add") {
    if (!values.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email format";
    }
  }

  if (!values.roomId) {
    errors.roomId = "Room is required";
  }

  if (!values.joinDate) {
    errors.joinDate = "Join date is required";
  }

  return errors;
};