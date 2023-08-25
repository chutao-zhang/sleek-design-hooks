<a href="https://github.com/chutao-zhang/sleek-design-hooks/tree/master#readme" target="_blank">Englist</a> | 中文

### 安装

```js
npm install @sleek-design/hooks
```

### 使用

```js
import { useXXX } from "@sleek-design/hooks";
```

### API

##### 1. useDebounce

`useDebounce(func: Function, delay: number = 500): { run: Function, cancel: Function }`

eg.

```js
import { useDebounce } from "@sleek-design/hooks";

function App() {
  const { run: handleChange } = useDebounce(() => {
    console.log("防抖测试");
  }, 500);

  return <input onChange={handleChange} />;
}
```

##### 2. useThrottle

`useThrottle(func: Function, delay: number = 500): { run: Function, cancel: Function }`

eg.

```js
import { useThrottle } from "@sleek-design/hooks";

function App() {
  const { run: handleClick } = useThrottle(() => {
    console.log("节流测试");
  }, 500);

  return <button onClick={handleClick}>连续点击</button>;
}
```

##### 3. useCountdown

```js
useCountdown({
  duration: number; // 毫秒(ms)
  interval?: number; // 毫秒(ms) (默认: 1000)
  onFinish?: () => void;
}): {
  remaining: number; // 毫秒(ms)
  start: () => void;
  pause: () => void;
  reset: () => void;
  stop: () => void;
}; // return
```

eg.

```js
import { useCountdown } from "@sleek-design/hooks";

function App() {
  const { start, pause, reset, stop, remaining } = useCountdown({
    duration: 10 * 1000,
    onFinish: () => {
      console.log("倒计时结束");
    },
  });

  return (
    <div>
      <button onClick={start}>开始</button>
      <button onClick={pause}>暂停</button>
      <button onClick={reset}>重置</button>
      <button onClick={stop}>停止</button>
      <div>{`剩余 ${Math.ceil(remaining / 1000)} 秒`}</div>
    </div>
  );
}
```

##### 4. useCookie

```js
useCookie(): [object, SetCookieFunc, RemoveCookieFunc, ClearCookieFunc];
useCookie(name: string): [object, SetCookieFunc, RemoveCookieFunc, ClearCookieFunc];
useCookie(names: string[]): [object, SetCookieFunc, RemoveCookieFunc, ClearCookieFunc];
```

eg.

```js
import { useCookie } from "@sleek-design/hooks";

function App() {
  const [cookie, setCookie, removeCookie, clearCookie] = useCookie();

  return (
    <div>
      <button onClick={() => setCookie("foo", "bar")}>设置Cookie</button>
      <button onClick={() => removeCookie("foo")}>删除Cookie</button>
      <button onClick={() => clearCookie()}>清空Cookie</button>
      <div>{cookie.name}</div>
    </div>
  );
}
```

##### 5. useCookieValue

`useCookieValue(name: string): [string, SetCookieFunc, RemoveCookieFunc];`

eg.

```js
import { useCookieValue } from "@sleek-design/hooks";

function App() {
  const [value, setCookie, removeCookie] = useCookieValue("foo");
  return (
    <div>
      <button onClick={() => setCookie("bar")}>设置Cookie</button>
      <button onClick={() => removeCookie()}>删除Cookie</button>
      <div>{value}</div>
    </div>
  );
}
```

##### 6. useLocalStorage

```js
// 与useCookie用法相似
```

##### 7. useLocalStorageValue

```js
// 与useCookieValue用法相似
```

##### 8. useSessionStorage

```js
// 与useCookie用法相似
```

##### 9. useSessionStorageValue

```js
// 与useCookieValue用法相似
```
