import Cookies from "universal-cookie";

const cookies = new Cookies();
export const logout = () => {
  cookies.set("token", "", { path: "/" });
  window.location.reload();
};
