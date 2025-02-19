const validateSignupData = (data) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const REQUIRED_FIELDS = ["firstName", "email", "password"];

  const receivedFields = Object.keys(data);
  const isValidOperation = receivedFields.every((field) =>
    ALLOWED_FIELDS.includes(field)
  );

  if (!isValidOperation) {
    console.log("Invalid fields in signup request");
    return { valid: false, error: "Invalid fields in signup request" };
  }

  const hasRequiredFields = REQUIRED_FIELDS.every((field) => data[field]);
  if (!hasRequiredFields) {
    return { valid: false, error: "Missing required fields in signup request" };
  }

  return { valid: true };
};

const validateEditProfileData = (data) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "photoUrl",
    "gender"
  ];
  const receivedFields = Object.keys(data);
  const isValidOperation = receivedFields.every((field) =>
    ALLOWED_FIELDS.includes(field)
  );
  
  if (!isValidOperation) {
    return { valid: false, error: "Invalid fields in edit profile request" };
  }
  return { valid: true };
};

module.exports = {validateSignupData, validateEditProfileData};
