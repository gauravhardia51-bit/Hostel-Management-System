import { useState } from "react";

export default function useFormValidation(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // ✅ Handle input change (live validation)
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);

    // 🔥 validate on change
    const validationErrors = validateFn(updatedValues);
    setErrors(validationErrors);
  };

  // ✅ Validate all fields (on submit)
  const validateAll = () => {
    console.log("Validating form with values: ", values);
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // ✅ Reset form
  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validateAll,
    resetForm,
    setValues,
  };
}
