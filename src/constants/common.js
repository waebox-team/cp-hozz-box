export const ROOT_API = process.env.REACT_APP_API_HOST;
export const TINY_API_KEY = process.env.REACT_APP_TINY_API_KEY;
export const ROOT_APP = process.env.REACT_APP_HOST;
export const ADVERTISER_PAGE_URL = process.env.REACT_APP_ADVERTISER_URL;

export const MAX_PHONE_NUMBER_DIGIT = 10;
export const defaultPassword = 'CrmEmail2023@';
export const MAX_VIDEO_UPLOAD = 1024 * 1024 * 30;
export const Roles = {
  ADMIN: 'admin',
  GUEST: 'guest',
  USER: 'user',
  MANAGER: 'manager',
};

export const ToastStatus = {
  Success: 'success',
  Error: 'error',
  Warning: 'warning',
  Info: 'info',
};

export const EMAIL_REGEX = /^([a-zA-Z0-9])+(([a-zA-Z0-9_.-])*)+([a-zA-Z0-9])@(([a-zA-Z0-9-])+([a-zA-Z0-9])+\.)([a-zA-Z]{2,})((\.+([a-zA-Z]{2,}))*)$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
export const PHONE_REGEX = /^(0|84|\+84|084)\d{9}$/;
export const LINK_REGEX = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
export const KEY_REGEX = /_/g;
export const CONVERT_UPPERCASE_REGEX = /\b\w/g;
export const URL_REGEX = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export const ContactChannelKey = {
  Facebook: 'facebook',
  Telegram: 'telegram',
  Skype: 'skype',
};

export const ContactChannelOptions = Object.keys(ContactChannelKey).map(key => ({
  label: key,
  value: ContactChannelKey[key],
}));

export const AVAILABLE_AD_UNITS = {
  POP_UNDER: 'POP_UNDER',
  BANNER_300_250: 'BANNER_300_250',
  BANNER_320_50: 'BANNER_320_50',
  BANNER_300_600: 'BANNER_300_600',
  BANNER_160_600: 'BANNER_160_600',
  BANNER_970_90: 'BANNER_970_90',
  BANNER_640_320: 'BANNER_640_320',
  BANNER_320_100: 'BANNER_320_100',
  NATIVE_BANNER: 'NATIVE_BANNER',
  DIRECT_LINK: 'DIRECT_LINK',
  SOCIAL_BAR: 'SOCIAL_BAR',
};

const BANNER_SIZE = {
  BANNER_300_250: '300x250',
  BANNER_320_50: '320x50',
  BANNER_300_600: '300x600',
  BANNER_160_600: '160x600',
  BANNER_970_90: '970x90',
  BANNER_640_320: '640x320',
  BANNER_320_100: '320x100',
};

const FONT_SIZE = {
  inherit: 'inherit',
  9: '9px',
  10: '10px',
  11: '11px',
  12: '12px',
  13: '13px',
  14: '14px',
  15: '15px',
  16: '16px',
  17: '17px',
  18: '18px',
  19: '19px',
  20: '20px',
};

const WIDGET_LAYOUT = {
  '1:1': '1:1',
  '1:2': '1:2',
  '1:3': '1:3',
  '1:4': '1:4',
  '2:1': '2:1',
  '2:2': '2:2',
  '3:1': '3:1',
  '4:1': '4:1',
};

export const BannerSizeOptions = Object.keys(BANNER_SIZE).map(key => ({
  label: key,
  value: BANNER_SIZE[key],
}));

export const FontSizeOptions = Object.keys(FONT_SIZE).map(key => ({
  label: FONT_SIZE[key],
  value: FONT_SIZE[key],
}));

export const WidgetLayoutOptions = Object.keys(WIDGET_LAYOUT).map(key => ({
  label: key,
  value: WIDGET_LAYOUT[key],
}));

export const AdUnitsOptions = Object.keys(AVAILABLE_AD_UNITS).map(key => ({
  label: key,
  value: AVAILABLE_AD_UNITS[key],
}));

const DIRECT_LINK_CATEGORY = {
  ADULT: 'Adult',
  NON_ADULT: 'Non-adult',
};

export const DirectLinkCategoryOptions = Object.keys(DIRECT_LINK_CATEGORY).map(key => ({
  label: DIRECT_LINK_CATEGORY[key],
  value: key,
}));

const REMOVE_WEBSITE_WITH = {
  EROTIC_ADS: 'EROTIC_ADS',
  SOFTWARE_ADS: 'SOFTWARE_ADS',
  ALERT_ADS: 'ALERT_ADS',
  ADS_WITH_SOUND: 'ADS_WITH_SOUND',
  GAMBLING_ADS: 'GAMBLING_ADS',
};

export const convertEnumToLabelOption = target => {
  return target
    .replace(KEY_REGEX, ' ')
    .toLowerCase()
    .replace(CONVERT_UPPERCASE_REGEX, l => l.toUpperCase());
};

export const RemoveWebsiteOptions = Object.keys(REMOVE_WEBSITE_WITH).map(key => ({
  label: convertEnumToLabelOption(key),
  value: REMOVE_WEBSITE_WITH[key],
}));

export const CountryKey = {
  Vietnam: 'VN',
  Thailan: 'TH',
  Other: 'other',
};

export const CountryOptions = [
  {
    label: 'Việt Nam',
    value: CountryKey.Vietnam,
  },
  {
    label: 'Thái Lan',
    value: CountryKey.Thailan,
  },
  {
    label: 'Khác',
    value: CountryKey.Other,
  },
];

export const TYPE_TICKET = {
  GENERAL_QUESTION: 'GENERAL_QUESTION',
  MY_ACCOUNT: 'MY_ACCOUNT',
  PAYMENTS: 'PAYMENTS',
  REQUEST_MANAGER: 'REQUEST_MANAGER',
  VISA_MASTERCARD: 'VISA_MASTERCARD',
};

export const TypeTicket = Object.keys(TYPE_TICKET).map(key => ({
  label: convertEnumToLabelOption(key),
  value: TYPE_TICKET[key],
}));

export const TYPE_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DETAIL: 'DETAIL',
};

export const TabFeatureProfile = {
  IdentityInfo: 'Identity Info',
  ChangePassword: 'Change Password',
};

export const IS_VERIFIED_INFO = {
  PENDING: 'PENDING',
  WAITING: 'WAITING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const DIRECTION = {
  VERTICAL: 'column',
  HORIZONTAL: 'row',
};

export const GROUP_BY_WEBSITE_ADS = {
  DATE: 'DATE',
  PLACEMENT: 'PLACEMENT',
  COUNTRY: 'COUNTRY',
  DEVICE: 'DEVICE',
  DOMAIN: 'DOMAIN',
  SYSTEM: 'SYSTEM',
};

export const GroupByOptions = Object.keys(GROUP_BY_WEBSITE_ADS).map(key => ({
  label: key,
  value: GROUP_BY_WEBSITE_ADS[key],
}));

export const ModalType = {
  Add: 'add',
  Delete: 'delete',
  ChangeStatus: 'changeStatus',
  EmailBackup: 'emailBackup',
  Import: 'import',
  Preview: 'preview',
  Detail: 'detail',
  ResetPassword: 'resetPassword',
  Assign: 'assign',
  Block: 'block',
};

export const STATUS_PURCHASE_HISTORY = {
  complete: 'complete',
  expired: 'expired',
  open: 'open'
}

export const StatusPurchaseHistoryOptions = Object.keys(STATUS_PURCHASE_HISTORY).map(key => ({
  label: key,
  value: STATUS_PURCHASE_HISTORY[key],
}));

export const FileImageValid = ['png', 'jpeg', 'jpg'];

export const FileExcelValid = ['xls', 'xlsx'];
