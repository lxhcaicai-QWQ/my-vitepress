# ACM 模式 Python 输入输出总结

## 一、基础读取方法

### 1. `input()` — 读取单行

```python
# 读取一行字符串（含空格）
s = input()

# 读取一个整数
n = int(input())

# 读取一个浮点数
f = float(input())
```

### 2. `input().split()` — 读取一行多个值

```python
# 读取一行，按空格分割为字符串列表
# 输入: hello world
a, b = input().split()  # a="hello", b="world"

# 读取一行整数
# 输入: 1 2 3
a, b, c = map(int, input().split())

# 读取一行整数存为列表
# 输入: 1 2 3 4 5
nums = list(map(int, input().split()))
```

### 3. `sys.stdin` — 快速批量读取

```python
import sys

# 一次性读取全部输入（适合大数据量）
data = sys.stdin.read().split()
# data 是所有 token 的列表，按空白分割

# 按行读取所有行
lines = sys.stdin.readlines()

# 逐行迭代（内存友好）
for line in sys.stdin:
    line = line.strip()
```

### 4. `sys.stdin.readline` — 快速逐行读取

```python
import sys

# 比input()更快，适合大数据量
line = sys.stdin.readline()

# 读取整数
n = int(sys.stdin.readline())

# 读取一行整数列表
nums = list(map(int, sys.stdin.readline().split()))
```

---

## 二、常见输入模式

### 模式 1：已知行数 N，读取 N 行数据

```python
# 输入格式:
# 5
# 1 2 3 4 5
n = int(input())
nums = list(map(int, input().split()))
```

```python
# 输入格式:
# 3
# 1 2
# 3 4
# 5 6
n = int(input())
for _ in range(n):
    a, b = map(int, input().split())
```

### 模式 2：多组数据，每组占一行，读到特定值停止

```python
# 输入格式（读到 0 0 停止）:
# 1 2
# 3 4
# 0 0
while True:
    a, b = map(int, input().split())
    if a == 0 and b == 0:
        break
    print(a + b)
```

### 模式 3：多组数据，读到 EOF 停止

```python
import sys

# 方式一：for line in sys.stdin
for line in sys.stdin:
    a, b = map(int, line.split())
    print(a + b)
```

```python
import sys

# 方式二：try-except
while True:
    try:
        a, b = map(int, input().split())
        print(a + b)
    except EOFError:
        break
```

### 模式 4：第一行给出组数 T，每组数据格式固定

```python
# 输入格式:
# 2
# 3
# 1 2 3
# 4
# 4 5 6 7
T = int(input())
for _ in range(T):
    n = int(input())
    nums = list(map(int, input().split()))
```

### 模式 5：读取矩阵（二维数组）

```python
# 输入格式:
# 3 4
# 1 2 3 4
# 5 6 7 8
# 9 10 11 12
n, m = map(int, input().split())
matrix = []
for _ in range(n):
    row = list(map(int, input().split()))
    matrix.append(row)
```

### 模式 6：读取字符串网格

```python
# 输入格式:
# 3 4
# .X..
# ..X.
# X...
n, m = map(int, input().split())
grid = [input() for _ in range(n)]
```

### 模式 7：行内逗号 / 其他分隔符

```python
# 输入: 1,2,3,4
nums = list(map(int, input().split(',')))
```

### 模式 8：混合类型行

```python
# 输入: alice 90 85
name = input().split()
s = name[0]          # "alice"
a, b = map(int, name[1:])  # 90, 85
```

---

## 三、常见输出模式

### 单个结果

```python
print(result)
```

### 多个值用空格分隔

```python
# 输出: 1 2 3
print(1, 2, 3)

# 列表展开输出
nums = [1, 2, 3]
print(*nums)  # 1 2 3

# join 输出字符串列表
words = ["hello", "world"]
print(" ".join(words))
```

### 保留小数位数

```python
# 保留 2 位小数
print(f"{result:.2f}")

# 方式二
print("%.2f" % result)

# 方式三
print(round(result, 2))
```

### 每行输出一个结果

```python
for x in results:
    print(x)
```

### 用 `*` 解包快速输出

```python
# 输出: YES
print("YES")

# 输出: 1 2 3
print(*[1, 2, 3])
```

---

## 四、性能优化

### 使用 `sys.stdin` + `read()` 加速（推荐大数据量）

```python
import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    nums = list(map(int, data[idx:idx+n]))

    # ... 算法逻辑 ...

    # 用 write 代替 print 提升输出速度
    sys.stdout.write(str(result))

main()
```

> **要点**：`sys.stdin.buffer.read()` 返回 bytes，比 `sys.stdin.read()` 更快。

### 使用 `sys.stdout.write` 批量输出

```python
import sys

out = []
for i in range(100000):
    out.append(str(i))
sys.stdout.write("\n".join(out))
```

---

## 五、完整模板

### 模板 A：标准 input（适合一般数据量）

```python
def solve():
    n = int(input())
    nums = list(map(int, input().split()))
    # 算法逻辑
    print(result)

solve()
```

### 模板 B：快速 IO（适合大数据量）

```python
import sys

def main():
    input = sys.stdin.readline
    n = int(input())
    nums = list(map(int, input().split()))
    # 算法逻辑
    print(result)

main()
```

### 模板 C：全部读入后处理

```python
import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    for _ in range(n):
        a = int(data[idx]); idx += 1
        b = int(data[idx]); idx += 1
    print(result)

main()
```

---

## 六、常见坑与注意事项

| 坑点 | 说明 |
|------|------|
| `input()` 含尾部换行 | `input()` 会自动去掉 `\n`，无需手动 strip |
| `readline()` 含尾部换行 | `sys.stdin.readline()` **不会**去掉 `\n`，需要 `.strip()` |
| 多余空格 / 空行 | 用 `strip()` 处理，或用 `split()` 自动忽略 |
| 输出格式 | 注意题目要求空格、换行位置，多余空格可能判错 |
| Python 递归深度 | `sys.setrecursionlimit(10**6)` |
| 输出浮点精度 | 用 `f"{x:.nf}"` 而非直接 `print` |
| 大数据量超时 | 用 `sys.stdin.buffer.read()` + `sys.stdout.write` |
