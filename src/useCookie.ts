interface ICookieOptions {
    /** number（秒）| Date */
    expires?: number | Date;
    /** 以秒为单位的数值 */
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    priority?: "High" | "Medium" | "Low";
    size?: number;
}

interface ICookieProps extends ICookieOptions {
    name: string;
    value: string;
}

interface IRemoveOptions {
    path?: string;
    domain?: string;
}

interface IRemoveProps extends IRemoveOptions {
    name: string;
}

type NameAliasType = { name: string; alias?: string };

/** cookie字符串转object
 * @param cookieStr cookie字符串
 */
function parseCookies(cookieStr: string) {
    const cookies: Record<string, string> = {};
    const cookiePairs = cookieStr.split('; ').filter(item => item.length > 0);

    for (const cookiePair of cookiePairs) {
        const delimiterIndex = cookiePair.indexOf('=');
        if (delimiterIndex === -1) continue; // 忽略没有等号的项

        const key = decodeURIComponent(cookiePair.slice(0, delimiterIndex));
        const value = decodeURIComponent(cookiePair.slice(delimiterIndex + 1));

        cookies[key] = value;
    }

    return cookiePairs.length === 0 ? null : cookies;
}

function formatCookieOptions(options?: ICookieOptions): string {
    if (!options) {
        return '';
    }

    const parts = [];

    if (options.expires) {
        let expires;
        if (typeof options.expires === 'number') {
            const date = new Date();
            date.setTime(date.getTime() + options.expires * 1000);
            expires = date.toUTCString();
        } else if (options.expires instanceof Date) {
            expires = options.expires.toUTCString();
        }
        if (expires) {
            parts.push(`expires=${expires}`);
        }
    }

    if (options.maxAge) {
        parts.push(`max-age=${options.maxAge}`);
    }

    if (options.domain) {
        parts.push(`domain=${options.domain}`);
    }

    if (options.path) {
        parts.push(`path=${options.path}`);
    }

    if (options.secure) {
        parts.push('secure');
    }

    if (options.httpOnly) {
        parts.push('HttpOnly');
    }

    if (options.sameSite) {
        parts.push(`SameSite=${options.sameSite}`);
    }

    return parts.join('; ');
}

function useCookie() {
    const support = !!(window || document);
    const enabled = support && window.navigator.cookieEnabled;

    if (!support) {
        throw new Error("Cookie Error: Your browser does not support cookie.");
    }

    if (!enabled) {
        console.error("Cookie Error: Your browser has disabled cookie, please enable it in settings.");
    }

    /** 获取cookie */
    function getCookie(): Record<string, string | undefined> | null;
    function getCookie(args: string): string | null;
    function getCookie(args: string[] | NameAliasType[]): Record<string, string | undefined> | null;
    function getCookie(args?: string | string[] | NameAliasType[]): string | Record<string, string | undefined> | null {
        if (!support || !enabled) return null;

        const _cookies = document.cookie;

        if (typeof args === "undefined") {
            return parseCookies(_cookies);
        }

        if (typeof args === "string") {
            return _cookies.match(new RegExp(`(^| )${args}=([^;]*)(;|$)`))?.[2] || null;
        }

        if (Object.prototype.toString.call(args) === "[object Array]") {
            const obj: Record<string, string | undefined> = {};

            args.forEach((item) => {
                if (typeof item === "string") {
                    obj[item] = _cookies.match(
                        new RegExp(`(^| )${item}=([^;]*)(;|$)`)
                    )?.[2];
                }

                if (typeof item === "object" && item !== null) {
                    obj[item.alias || item.name] = _cookies.match(
                        new RegExp(`(^| )${item.name}=([^;]*)(;|$)`)
                    )?.[2];
                }
            });

            return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
        }

        return null;
    }

    /** 设置cookie */
    function setCookie(name: string, value: string, options?: ICookieOptions): void;
    function setCookie(props: ICookieProps | ICookieProps[]): void;
    function setCookie(args: string | ICookieProps | ICookieProps[], value?: string, options?: ICookieOptions): void {
        if (!support || !enabled) return;

        function setSingleCookie(props: ICookieProps): void {
            const { name, value, ...options } = props;
            const formattedOptions = formatCookieOptions(options);
            document.cookie = `${name}=${value}; ${formattedOptions}`;
        }

        if (typeof args === 'string' && value) {
            const cookieProps: ICookieProps = { name: args, value, ...options };
            setCookie([cookieProps]);
        } else if (Array.isArray(args)) {
            const cookies = args.map(cookieProps => {
                setSingleCookie(cookieProps);
            });
        } else if (typeof args === 'object') {
            setSingleCookie(args);
        }
    }

    /** 删除cookie */
    function removeCookie(name: string, options?: IRemoveOptions): void;
    function removeCookie(args: IRemoveProps[]): void;
    function removeCookie(args: string | IRemoveProps[], options?: IRemoveOptions): void {
        if (!support || !enabled) return;

        function removeSingleCookie(name: string, options?: IRemoveOptions): void {
            const { path, domain } = options || {};
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${path ? `; path=${path}` : ''}${domain ? `; domain=${domain}` : ''}`;
        }

        if (typeof args === 'string') {
            removeSingleCookie(args, options);
        } else if (Array.isArray(args)) {
            args.forEach(options => {
                removeSingleCookie(options.name, options);
            });
        }
    }

    /** 清空cookie */
    function clearAllCookies(): void {
        if (!support || !enabled) return;

        const cookies = document.cookie.split("; ");

        for (const cookie of cookies) {
            const [name] = cookie.split("=");
            removeCookie(name);
        }
    }

    return {
        set: setCookie,
        get: getCookie,
        remove: removeCookie,
        clear: clearAllCookies,
    };
}

export default useCookie;
