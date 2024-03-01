import * as yup from 'yup';

import { ErrorForm } from 'constants/error';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'constants/common';

export const schemaTest = {
  isIncludedLetter: value => value?.match(/[a-z]/g),
  isIncludedCapitalLetter: value => value?.match(/[A-Z]/g),
  isIncludedNumber: value => value?.match(/[0-9]/g),
  isIncludedSymbol: value => value?.match(/[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/g),
  isValidPassword: value => {
    const passed = [];
    if (value.length >= 10) {
      passed.push('safeLength');
    }
    if (schemaTest.isIncludedLetter(value)) {
      passed.push('isIncludedLetter');
    }
    if (schemaTest.isIncludedCapitalLetter(value)) {
      passed.push('isIncludedCapitalLetter');
    }
    if (schemaTest.isIncludedNumber(value)) {
      passed.push('isIncludedNumber');
    }
    if (schemaTest.isIncludedSymbol(value)) {
      passed.push('isIncludedSymbol');
    }
    return {
      isValid: passed.length === 5,
      passed,
    };
  },
  isValidAlias: value => (!value ? true : value?.match(/^(?!-)([A-Za-z0-9-](?!.*--)){0,62}[A-Za-z0-9]$/g)),
  isValidEmail: value =>
    !value
      ? true
      : value?.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
        ),
  isValidGoogleMapUrl: value => (!value ? true : value?.match(/^(https:\/\/)(goo\.gl|google\.com)\/maps\/([^\s\\]+)$/g)),
  isValidAliasName: value => value.match(/^(?!-)([A-Za-z0-9-](?!.*--)){0,62}[A-Za-z0-9]$/g),
  isValidDomain: value => value.match(/^(((?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9])\.)+((?!-)[A-Za-z0-9-]{1,62}[A-Za-z0-9])(\.)?$/g),
  isValidPassword: value => value.match(PASSWORD_REGEX),
};

// Validate form
export const RegisterFormValidate = yup.object().shape({
  username: yup
    .string()
    .min(5, ErrorForm.MaximumUsernameLength)
    .max(30, ErrorForm.MaximumUsernameLength)
    .nullable()
    .required(ErrorForm.Required),
  email: yup
    .string()
    .max(255, ErrorForm.MaxLength(255))
    .email(ErrorForm.EmailInvalid)
    .matches(EMAIL_REGEX, {
      message: ErrorForm.EmailInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
  password: yup
    .string()
    .min(8, ErrorForm.MaximumPasswordLength)
    .max(20, ErrorForm.MaximumPasswordLength)
    .matches(PASSWORD_REGEX, {
      message: ErrorForm.PasswordInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
  passwordConf: yup
    .string()
    .min(8, ErrorForm.MaximumPasswordLength)
    .max(20, ErrorForm.MaximumPasswordLength)
    .oneOf([yup.ref('password'), null], ErrorForm.PasswordNotSame)
    .matches(PASSWORD_REGEX, {
      message: ErrorForm.PasswordInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
  contactChannel: yup.object().nullable().required(ErrorForm.Required),
  contactUsername: yup.string().nullable().required(ErrorForm.Required),
});

export const LoginFormValidate = yup.object().shape({
  username: yup.string().nullable().required(ErrorForm.Required),
  password: yup.string().nullable().required(ErrorForm.Required),
});

export const ChangePasswordFormValidate = yup.object().shape({
  password: yup
    .string()
    .min(8, ErrorForm.MaximumPasswordLength)
    .max(20, ErrorForm.MaximumPasswordLength)
    .matches(PASSWORD_REGEX, {
      message: ErrorForm.PasswordInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
  newPassword: yup
    .string()
    .min(8, ErrorForm.CodeNumberLength)
    .max(20, ErrorForm.CodeNumberLength)
    .matches(PASSWORD_REGEX, {
      message: ErrorForm.PasswordInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
  passwordConf: yup
    .string()
    .min(8, ErrorForm.MaximumPasswordLength)
    .max(20, ErrorForm.MaximumPasswordLength)
    .oneOf([yup.ref('newPassword'), null], ErrorForm.PasswordNotSame)
    .matches(PASSWORD_REGEX, {
      message: ErrorForm.PasswordInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
});

export const UpdateProfileFormValidate = yup.object().shape({
  fullname: yup
    .string()
    .min(5, ErrorForm.MaximumUsernameLength)
    .max(30, ErrorForm.MaximumUsernameLength)
    .nullable()
    .required(ErrorForm.Required),
  codeNumber: yup
    .string()
    .min(9, ErrorForm.CodeNumberLength)
    .max(12, ErrorForm.CodeNumberLength)
    .matches(PASSWORD_REGEX, {
      message: ErrorForm.PasswordInvalid,
      excludeEmptyString: true,
    })
    .nullable()
    .required(ErrorForm.Required),
  frontSideFile: yup.mixed().required(ErrorForm.Required),
  backSideFile: yup.mixed().required(ErrorForm.Required),
});

export const TicketFormValidate = yup.object().shape({
  subject: yup.string().required(ErrorForm.Required),
  content: yup.string().required(ErrorForm.Required),
  type: yup.object().nullable().required(ErrorForm.Required),
});

export const GetCodeNativeFormValidate = yup.object().shape({
  widget: yup.object(),
  fontSize: yup.object(),
  color: yup.string(),
});

export const SizeFormValidate = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
});

export const ProductFormValidate = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
  price: yup.string().required(ErrorForm.Required),
  sale: yup.string().required(ErrorForm.Required),
  category: yup.object().required(ErrorForm.Required),
  size: yup.object().required(ErrorForm.Required),
  color: yup.array().required(ErrorForm.Required),
  variants: yup.array().of(
    yup.object().shape({
      price: yup.string().required(ErrorForm.Required),
      count: yup.string().required(ErrorForm.Required),
    })
  ),
});
