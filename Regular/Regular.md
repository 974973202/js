### 正则表达式(Regular Expression)
> 其实就是一门工具，目的是为了字符串模式匹配，从而实现搜索和替换功能
- 特殊字符
> 匹配区间 | 正则表达式 | 记忆方式
> -|-|-
> 换行符 | \n | new line
> 换页符 | \f | form feed
> 回车符 | \r | return
> 空白符 | \s | space
> 制表符 | \t | tab
> 垂直制表符 | \v | vertical tab
> 回退符 | [\b] | backspace,之所以使用[]符号是避免和\b重复
>
> 了换行符之外的任何字符 | . | 句号,除了句子结束符


单个数字, [0-9]
\d
digit


除了[0-9]
\D
not digit


包括下划线在内的单个字符，[A-Za-z0-9_]
\w
word


非单字字符
\W
not word


匹配空白字符,包括空格、制表符、换页符和换行符
\s
space


匹配非空白字符
\S
not space