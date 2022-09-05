import Cookie from "../Cookie";
import constants from "../../constants";

export default function isUserAuthorized() {
    return Cookie.getCookie(constants.COOKIE.ID) && Cookie.getCookie(constants.COOKIE.PASSWORD)
}