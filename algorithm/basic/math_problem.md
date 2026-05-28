---
outline: [2, 4]   # 当前页面显示 h2~h4
---


## 质数

### 试除法判定质数
给定n个正整数，对于每个数x，判断它是否为质数。

**核心思想：试除法 (Trial Division)**
判断一个数x是否为质数，只需检查它是否能被2到√x之间的任何整数整除。
- **原理：**如果x存在一个大于√x的约数d，那么它必然也存在一个小于√x的约数x/d。因此，我们只需检查较小的那一半约数即可。
```python

def main():
    n = int(input())

    def _check(x: int) -> bool:
        if x < 2:
            return False
        i = 2
        while i*i <= x:
            if x % i == 0:
                return False
            i += 1
        return True

    for _ in range(n):
        a = int(input())
        if _check(a):
            print("Yes")
        else:
            print("No")

if __name__ == "__main__":
    main()
```

### 分解质因数
对给定的每个正整数x，将其分解为质因数的乘积。
对每个x，按p k的格式输出其所有质因子p及其对应的指数k，要求p按升序排列。

任何一个合数N，必然存在一个小于或等于sqrt(N)的质因子。这保证了我们只需遍历到sqrt(N)就能找到所有质因子。

```python

def main():
    n = int(input())

    def _solve(x: int):
        i = 2
        while i * i <= x:
            if x%i == 0:
                cnt = 0
                while x % i ==0:
                    cnt += 1
                    x /= i
                print(i, cnt)
            i += 1
        if x > 1:
            print(int(x), 1)
        print()

    for _ in range(n):
        a = int(input())
        _solve(a)

if __name__ == "__main__":
    main()
```

### 筛质数
**问题：**给定一个正整数 n，求 1~n 中质数的个数。

**时间复杂度：****O(n)**
**核心思想：**  
确保每个合数只被它的**最小质因子**筛掉一次。
**步骤简介：**
1. 从小到大遍历 2 到 n 的所有数i。
2. 如果i未被标记，则i是一个质数，计入答案。
3. 遍历已找到的所有质数p：
    - 将i * p标记为合数。
    - **关键优化：** 如果i % p == 0，则立刻break。
        - **原因：** 此时p是i的最小质因子。对于比p更大的质数p_j，i * p_j的最小质因子仍然是p。这个数会在之后被筛掉，现在跳出循环可避免重复，保证了线性时间。
```python

def main():
    n = int(input())

    def _prime(m: int) -> list[int]:
        primes = []
        vis = [False] * (n + 1)
        for i in range(2, n + 1):
            if not vis[i]:
                primes.append(i)
            for p  in primes:
                if i * p > n:
                    break
                vis[i * p] = True
                if i % p == 0:
                    break
        return primes

    lst = _prime(n)

    print(len(lst))

if __name__ == "__main__":
    main()
```

