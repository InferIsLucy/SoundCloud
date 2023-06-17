import { object, string, ref } from "yup";

export const accountSchema = object({
  confirmPassword: string()
    .required("Mật khẩu không được để trống")
    .oneOf([ref("password")], "Mật khẩu không trùng khớp"),
  password: string()
    .required("Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải dài hơn 8 ký tự ")
    .matches(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Mật khẩu phải chứa ít nhất 1 ký tự viết hoa và 1 chữ số"
    ),
  displayName: string().required("Tên không được để trống"),
  email: string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
});
export const loginSchema = object({
  password: string()
    .required("Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải dài hơn 8 ký tự "),
  email: string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
});

export const isValidAge = (birthDate, ageLimit = 16) => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= ageLimit;
};

export const isStringNullOrEmpty = (str) => {
  return !str || str.trim().length === 0;
};
