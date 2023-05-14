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
