import { CONVERT_UPPERCASE_REGEX, KEY_REGEX, convertEnumToLabelOption } from "constants/common";

export const mappingCustomers = data =>
  data?.map(item => ({
    name: item?.name,
    email: item?.email,
    code: item?.code,
    id: item?._id,
  }));

export const mappingOptionSelect = (data, labelKey = 'name', valueKey = '_id') =>
  data?.map(item => ({
    label: item?.[labelKey],
    value: item?.[valueKey],
  }));

export const mappingChannel = data =>
  data?.map(item => ({
    name: item?.name,
    manager: item?.manager,
    customers: mappingOptionSelect(item?.customers),
    id: item?._id,
    isActive: item?.isActive,
  }));

export const mappingChannelFormData = data => ({
  ...(data?.id && { id: data?.id }),
  name: data?.name,
  customerIds: data?.customers?.map(customerItem => customerItem?.value).join(','),
});

export const mappingCampaign = data =>
  data?.map(item => ({
    id: item?._id,
    name: item?.name,
  }));

export const mappingCampaignFormData = data => ({
  ...(data?.id && { id: data?.id }),
  name: data?.name,
  channelIds: data?.channels?.map(item => item?.value).join(','),
});

export const mappingUsers = data =>
  data?.map(item => ({
    username: item?.username,
    role: item?.role,
    email: item?.email,
    id: item?._id,
  }));

export const mappingTemplate = data => data?.map(item => ({ id: item?._id, name: item?.name, content: item?.content }));

export const mappingOptionsFromArrString = (arrString) => {
  return (arrString).map(remove => ({
      label: convertEnumToLabelOption(remove),
      value: remove,
  }))
}

export const mappingOptionCategoryDirectLinkFormData = (arrString) => {
  return (arrString).map(remove => ({
      label: remove.toLowerCase().replace(CONVERT_UPPERCASE_REGEX, l => l.toUpperCase()),
      value: remove,
  }))
}
