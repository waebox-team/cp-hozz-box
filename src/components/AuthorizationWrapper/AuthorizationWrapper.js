import { isJsonString } from 'utils/helpers';
import { CookieStorage } from '../../utils/cookie-storage';
import { StorageKeys } from '../../constants/storage-keys';

/**
 *
 * WithAuthorization
 *
 */
function AuthorizationWrapper({ children, allowedRoles, disabled = false }) {
  const user = CookieStorage.getCookieData(StorageKeys.UserInfo);

  const userRoles = user?.role || [];
  const hasRole = (allowedRoles || []).some(role => userRoles.includes(role));

  if (user?.level === '1' || hasRole || (!allowedRoles && !userRoles.length)) {
    return children;
  } else {
    if (disabled) {
      return children;
    }
    return null;
  }
}

export default AuthorizationWrapper;
