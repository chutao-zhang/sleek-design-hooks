import * as React from "react";

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

interface IRemoveOptions {
    path?: string;
    domain?: string;
}

type SetCookieFunc = (value: string, options?: ICookieOptions) => void;
type RemoveCookieFunc = (name: string, options?: IRemoveOptions) => void;

function formatOptions(options: ICookieOptions): string {
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

function useCookieValue(name: string) {
    const support = !!(window || document);
    const enabled = support && window.navigator.cookieEnabled;
    const [value, setValue] = React.useState<string | null>(getCookie(name));

    if (!support) {
        throw new Error("Cookie Error: Your browser does not support cookie.");
    }

    if (!enabled) {
        console.error("Cookie Error: Your browser has disabled cookie, please enable it in settings.");
    }

    function setCookie(value: string, options?: ICookieOptions): void {
        if (name?.trim().length > 0) {
            document.cookie = `${name}=${value}; ${options ? formatOptions(options) : ''}`;
            setValue(getCookie(name));
        }
    }

    function getCookie(name: string): string | null {
        return decodeURIComponent(document.cookie).match(new RegExp(`(^| )${name}=([^;]*)(;|$)`))?.[2] || null;
    }

    function removeCookie(name: string, options?: IRemoveOptions): void {
        setCookie(name, { ...options, expires: -1 })
    }

    return [value, setCookie, removeCookie] as [string, SetCookieFunc, RemoveCookieFunc];
}

export default useCookieValue;