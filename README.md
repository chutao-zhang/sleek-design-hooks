Englist | <a href="https://github.com/chutao-zhang/sleek-design-hooks/blob/master/README-zh_CN.md" target="_blank">中文</a>

### Installation

```js
npm install @sleek-design/hooks
```

### Usage

```js
import { xxx } from "@sleek-design/hooks";
```

### API

##### 1. useDebounce --- `useDebounce(func: Function, delay: number = 500): { run: Function, cancel: Function }`

```js
import { useDebounce } from "@sleek-design/hooks";

function App() {
  const { run: handleChange } = useDebounce(() => {
    console.log("useDebounce test.");
  }, 500);

  return <input onChange={handleChange} />;
}
```

##### 2. useThrottle --- `useThrottle(func: Function, delay: number = 500): { run: Function, cancel: Function }`

```js
import { useThrottle } from "@sleek-design/hooks";

function App() {
  const { run: handleClick } = useThrottle(() => {
    console.log("useThrottle test.");
  }, 500);

  return <button onClick={handleClick}>continuous click</button>;
}
```
