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

## 约数

### 试除法求约数
给定一个正整数n，求出它的所有约数，并按从小到大的顺序输出。

约数是成对出现的。如果i是n的约数，那么n / i也一定是n的约数。

```python
def main():
    n = int(input())

    def _get_factor(x: int) -> list[int]:
        res = []
        i = 1
        while i * i <= x:
            if x % i == 0:
                res.append(i)
                if x // i != i:
                    res.append(x // i)
            i += 1

        res.sort()
        return res

    for _ in range(n):
        a = int(input())
        res = _get_factor(a)
        print(*res)
if __name__ == "__main__":
    main()
```

### 约数个数
如何快速计算n个正整数乘积N的约数个数？

约数个数定理
1. **质因数分解：**  
   将N分解成质因数的乘积形式：  
   N = p₁^α¹ * p₂^α² * ... * pₖ^αᵏ
2. **套用公式：**  
   N的约数个数等于所有质因子的**(指数+1)**的乘积：  
   个数 = (α¹ + 1) * (α² + 1) * ... * (αᵏ + 1)
```python
def main():
    n = int(input())
    count_map = {}
    MOD = 10 ** 9 + 7

    def _insert(x, num: int):
        count_map[x] = count_map.get(x, 0) + num

    def get_div(x: int):
        i = 2
        while i * i <= x:
            cnt = 0
            if x % i == 0:
                while x % i == 0:
                    x //= i
                    cnt += 1
                _insert(i, cnt)
            i += 1
        if x > 1:
            _insert(x, 1)

    for _ in range(n):
        a = int(input())
        get_div(a)

    ans = 1
    for item in count_map.values():
        ans = ans * (item + 1) % MOD

    print(ans)


if __name__ == "__main__":
    main()
```

### 约数之和
给定n个正整数aᵢ，求出它们乘积œq的所有正约数之和，并将结果对10^9 + 7取模后输出。

**约数和定理**：  
若一个数N的标准质因数分解为N = p₁^α₁ * p₂^α₂ * ... * pₖ^αₖ，  
则它的约数之和为：  
S = (p₁⁰ + ... + p₁^α₁) * (p₂⁰ + ... + p₂^α₂) * ... * (pₖ⁰ + ... + pₖ^αₖ)
```python
def main():
    n = int(input())
    count_map = {}
    MOD = 10 ** 9 + 7

    def _insert(x, num: int):
        count_map[x] = count_map.get(x, 0) + num

    def get_div(x: int):
        i = 2
        while i * i <= x:
            cnt = 0
            if x % i == 0:
                while x % i == 0:
                    x //= i
                    cnt += 1
                _insert(i, cnt)
            i += 1
        if x > 1:
            _insert(x, 1)

    for _ in range(n):
        a = int(input())
        get_div(a)

    ans = 1
    for (a,b) in count_map.items():
        t = 1
        while b > 0:
            t = (t * a + 1) % MOD
            b -= 1
        ans = ans * t % MOD
    print(ans)


if __name__ == "__main__":
    main()
```

### 最大公约数
给定 n 组正整数 (a, b)，求每一组的最大公约数 (GCD)。

**题解核心：欧几里得算法 (辗转相除法)**
**核心原理：**
- gcd(a, b) = gcd(b, a % b)
- 递归的终止条件是b = 0，此时最大公约数为a。
  代码:
```python
def main():
    n = int(input())

    def _gcd(x, y: int) -> int:
        if y == 0:
            return x
        return _gcd(y, x%y)

    for _ in range(n):
        a, b = map(int, input().split())
        print(_gcd(a,b))

if __name__ == "__main__":
    main()
```