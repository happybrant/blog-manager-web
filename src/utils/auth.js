import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const LoginExpire = 'login_expire'

export function getToken() {
  return Cookies.get(TokenKey) == null ? '' : Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getLoginExpire() {
  return Cookies.get(LoginExpire)
}

export function setLoginExpire(loginExpire) {
  return Cookies.set(LoginExpire, loginExpire)
}
