export const ErrorForm = {
  Required: 'Trường này là bắt buộc',
  EmailInvalid: 'Email không đúng định dạng',
  MaximumPhoneLength: 'Số phone bao gồm 10 chữ số',
  MaximumUsernameLength: 'Mật khẩu từ 5 đến 30 ký tự',
  MaximumPasswordLength: 'Mật khẩu từ 8 đến 20 ký tự',
  CodeNumberLength: 'Code number must be from 8 to 20 symbol',
  PasswordInvalid: 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  PasswordNotSame: 'Mật khẩu xác nhận phải giống với mật khẩu mới',
  MinMoney: amount => `Số tiền phải lớn hơn hoặc bằng ${amount}`,
  MaxMoney: amount => `Số tiền phải nhỏ hơn hoặc bằng ${amount}`,
  MaxLength: length => `Bạn được nhập tối đa ${length} ký tự`,
};

export const ErrorApi = {
  WRONG_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu sai',
  THE_USERNAME_OR_EMAIL_EXISTED: 'Tài khoản này đã tồn tại',
  YOUR_INFORMATION_IS_WAITING_APPROVAL_OR_APPROVED: 'Thông tin của bạn đang chờ phê duyệt hoặc được phê duyệt',
  ["Wrong_Password."]: 'Mật khẩu hiện tại chưa đúng',
  THE_WEBSITE_AD_UNIT_IS_INVALID: 'Đơn vị quảng cáo web không hợp lệ',
  THE_WEBSITE_URL_IS_INVALID: 'Địa chỉ website không hợp lệ',
  WEBSITE_ALREADY_EXISTS: 'Trang web này đã tồn tại',
};
