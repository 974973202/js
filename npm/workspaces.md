```json
{
  "workspaces": [
    "a",
    "b"
  ],
  "workspaces": [
    "packages/*"
  ]
}
```

- 在主目录下 要在a项目下装包：
- yarn npm包名 -w/--workspace 本地包名
- yarn chalk -w a  

yarn -ws 或 yarn --workspace装所有的依赖