export const validateRegister = (values) => {
  let errors = {};

  // Name
  if (!values.name?.trim()) {
    errors.name = "Full name is required";
  } else if (values.name.trim().length < 3) {
    errors.name = "Minimum 3 characters required";
  }

  // Email
  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = "Invalid email format";
  }

  // Mobile
  if (!values.mobile?.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (
    !/^[0-9]{10}$/.test(values.mobile)
  ) {
    errors.mobile =
      "Enter valid 10 digit mobile number";
  }

  // Password
 // Password
if (!values.password?.trim()) {
  errors.password = "Password is required";
}

  // Role
  if (!values.roleId) {
    errors.roleId = "Role is required";
  }

  return errors;
};