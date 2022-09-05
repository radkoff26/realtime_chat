interface CookieOptions {
    path: string
    maxAge: number
}

export default class Cookie {
    static getCookie(key: string): string | undefined {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + key.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    static setCookie(key: string, value: string, maxAge: number) {
        let options: CookieOptions = {
            path: '/',
            maxAge: maxAge
        };

        let updatedCookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);

        updatedCookie += `; path=${options.path}; max-age=${options.maxAge}`

        document.cookie = updatedCookie;
    }

    static deleteCookie(key: string) {
        Cookie.setCookie(key, "", -1)
    }
}