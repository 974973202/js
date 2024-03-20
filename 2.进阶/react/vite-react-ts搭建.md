### Vite+React+TS+ESLint+Prettier+Husky+Commitlint
1. yarn create vite  选择react、react-ts
2. npm init @eslint/config
  - 安装成功后 ESLint 帮我们创建了 .eslintrc.cjs 配置文件（cjs 是指 CommonJS 格式）
  ```cjs
  module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
    }
    }
  ```
3. yarn add prettier -D
   - 创建 .prettierrc.cjs
   ```cjs
    module.exports = {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        semi: false,
        trailingComma: "none",
        bracketSpacing: true
    }
   ```
4. ESLint + Prettier
  - yarn add eslint-config-prettier eslint-plugin-prettier -D
  ```cjs
        module.exports = {
            "env": {
                "browser": true,
                "es2021": true,
            +   "node": true
            },
            "extends": [
                "eslint:recommended",
                "plugin:react/recommended",
                "plugin:@typescript-eslint/recommended",
        +       "plugin:prettier/recommended",
        +       "plugin:react/jsx-runtime"
            ],
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
                "ecmaFeatures": {
                    "jsx": true
                },
                "ecmaVersion": "latest",
                "sourceType": "module"
            },
            "plugins": [
                "react",
                "@typescript-eslint",
        +       "prettier"
            ],
            "rules": {
        +       "prettier/prettier": "error",
        +       "arrow-body-style": "off",
        +       "prefer-arrow-callback": "off"
            },
            settings: {
                react: {
                    version: 'detect'
                }
            }
        }
  ```
5. package.json 的 script 中添加命令
```json
"script": {
        "lint": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./"
    }
```

6.  Vite 中引入 ESLint 插件以便在开发阶段发现问题
  - yarn add vite-plugin-eslint -D
  - vite.config.ts 引入插件
  ```ts
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import viteEslint from 'vite-plugin-eslint'

    // https://vitejs.dev/config/
    export default defineConfig({
    plugins: [
        react(),
        viteEslint({
            failOnError: false, // 不想再开发阶段因为 ESLint 的错误打断开发
        })
    ]
    })
  ```

7. Husky + lint-staged
  - yarn add husky -D
  - npm pkg set scripts.prepare="husky install"
  - npm run prepare
  - npx husky add .husky/pre-commit "npx lint-staged"
  - yarn add lint-staged -D
  - package.json 添加相关配置
   ```json
   {
    "lint-staged": {
        "*.{js,jsx,tsx,ts}": [
        "npm run lint"
        ]
    }
    }
   ```

8. commitlint
  - yarn add @commitlint/cli @commitlint/config-conventional -D
  - 创建配置文件 .commitlintrc.cjs
  - ...
  - npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"