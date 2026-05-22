export const validateRoom = (values) => {
  let errors = {};

  // ✅ Room Number (exactly 3 digits)
  if (!values.roomNumber?.toString().trim()) {
    errors.roomNumber = "Room number is required";
  } else if (!/^[0-9]{3}$/.test(values.roomNumber)) {
    errors.roomNumber = "Room number must be exactly 3 digits";
  }

  // ✅ Capacity
  if (!values.capacity) {
    errors.capacity = "Capacity is required";
  } else if (Number(values.capacity) <= 0) {
    errors.capacity = "Capacity must be greater than 0";
  }

  // ✅ Occupied
  if (values.occupied === "" || values.occupied === null) {
    errors.occupied = "Occupied is required";
  } else if (Number(values.occupied) < 0) {
    errors.occupied = "Occupied cannot be negative";
  } else if (Number(values.occupied) > Number(values.capacity)) {
    errors.occupied = "Occupied cannot exceed capacity";
  }

  // ✅ Status
  if (!values.status) {
    errors.status = "Status is required";
  }

  return errors;
};
