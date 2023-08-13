<a href="https://github.com/chutao-zhang/sleek-design-hooks/tree/master#readme" target="_blank">Englist</a> | 中文

### 安装

```js
npm install @sleek-design/hooks
```

### 使用

```js
import { xxx } from "@sleek-design/hooks";
```

### API

##### 1. useDebounce --- `useDebounce(func: Function, delay: number = 500): { run: Function, cancel: Function }`

```js
import { useDebounce } from "@sleek-design/hooks";

function App() {
  const { run: handleChange } = useDebounce(() => {
    console.log("防抖测试");
  }, 500);

  return <input onChange={handleChange} />;
}
```

##### 2. useThrottle --- `useThrottle(func: Function, delay: number = 500): { run: Function, cancel: Function }`

```js
import { useThrottle } from "@sleek-design/hooks";

function App() {
  const { run: handleClick } = useThrottle(() => {
    console.log("节流测试");
  }, 500);

  return <button onClick={handleClick}>连续点击</button>;
}
```
