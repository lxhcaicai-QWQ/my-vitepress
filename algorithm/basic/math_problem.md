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

## 欧拉函数

### 欧拉函数
给定 n 个正整数 aᵢ，分别求出每个数的欧拉函数 φ(aᵢ) 的值。

一个正整数 N 的欧拉函数值可以通过其质因数分解来计算：  
若 N = p₁ᵃ¹ * p₂ᵃ² * ... * pₖᵃᵏ (其中 pᵢ 是不同的质数)  
则**φ(N) = N * (1 - 1/p₁) * (1 - 1/p₂) * ... * (1 - 1/pₖ)**

该算法本质上是在对 N 进行质因数分解的同时，计算欧拉函数值
```python

def main():
    n = int(input())

    def _get_phi(x: int) -> int:
        ans = x
        i = 2
        while i * i <= x:
            if x % i == 0:
                ans = ans // i * (i - 1)
                while x % i == 0:
                    x //= i
            i += 1
        if x > 1:
            ans = ans // x * (x - 1)
        return ans

    for _ in range(n):
        x = int(input())
        print(_get_phi(x))

if __name__ == "__main__":
    main()
```

### 筛法求欧拉函数
给定一个正整数 n，你需要计算 1 到 n 中所有数的欧拉函数之和。

使用**线性筛（欧拉筛）**在 O(n) 时间内预处理出 1 到 n 所有数的欧拉函数值，然后求和。
```python

def main():
    n = int(input())

    phi = [0] * (n + 1)
    primes = []
    def _get_prime(n: int):
        vis = [False] * (n + 1)
        phi[1] = 1
        for i in range(2,n + 1):
            if not vis[i]:
                phi[i] = i - 1
                primes.append(i)

            for x in primes:
                if i * x > n:
                    break
                vis[i * x] = True
                if i % x == 0:
                    phi[i * x] = phi[i] * x
                else:
                    phi[i * x] = phi[i] * (x - 1)

    _get_prime(n)
    print(sum(phi))

if __name__ == "__main__":
    main()
```


## 快速幂

### 快速幂
给定三个整数 a, b, p，求 a*b mod p 的值。

指数 b 的值可能非常大（例如 10<sup>9</sup>），直接循环 b 次进行乘法会超时。

利用指数b的二进制表示，将a^b的计算进行拆分。  
任何一个整数b都可以写成 2 的幂次之和。  

例如：a^13 = a^(8+4+1) = a^8 * a^4 * a^1。
```python

def main():

    def _ksm(a,b,p: int) -> int:
        res = 1
        a %= p
        while b!=0:
            if b&1 == 1:
                res = res * a % p
            a = a * a % p
        return res

    n = int(input())
    for _ in range(n):
        a, b, p = map(int, input())
        print(_ksm(a, b, p))


if __name__ == "__main__":
    main()
```

### 快速幂求逆元
给定n组a和p，其中p是**质数**。
对于每组数据，求a模p的乘法逆元。

- **定理内容:** 若p是一个质数，且整数a不是p的倍数（即a与p互质），则有a^(p-1) ≡ 1 (mod p)。
- **不存在条件:** 如果a是p的倍数，则逆元不存在。
```python
def main():
    def _kms(a,b,p: int) -> int:
        res = 1
        a %=p
        while b!=0:
            if b&1 == 1:
                res = res * a % p
            a = a * a % p
            b >>= 1
        return res

    def _gcd(a, b: int) -> int:
        if b == 0:
            return a
        return _gcd(b, a%b)

    n = int(input())
    for _ in range(n):
        a, b = map(int, input().split())
        if _gcd(a,b) == 1:
            print(_kms(a,b -2, b))
        else:
            print("impossible")

if __name__ == "__main__":
    main()
```

## 求组合数

### 求组合数 I
给定n组询问，每组询问给定两个整数a, b。
求C(a, b) mod (10^9 + 7)的值。

1. **预处理：** 利用组合数递推公式C(i, j) = C(i-1, j) + C(i-1, j-1)，建立一个N*N的二维数组C来存储组合数。
   - **边界条件：** C(i, 0) = 1
   - **递推：** C\[i]\[j] = (C\[i-1]\[j-1] + C\[i-1]\[j]) % p
```python
def main():
    MOD = 10 ** 9 + 7
    N = 2010
    c = [[0] * (N + 1) for _ in range(N + 1)]
    def _calculate():
        for i in range(0, N + 1):
            for j in range(0, i + 1):
                if j == 0:
                    c[i][j] = 1
                else:
                    c[i][j] = (c[i - 1][j - 1] + c[i - 1][j]) % MOD

    _calculate()
    n = int(input())
    for _ in range(n):
        a, b = map(int, input().split())
        print(c[a][b])

if __name__ == "__main__":
    main()
```


### 求组合数 II
- **输入:** n组a, b。
- **要求:** 对于每组输入，计算 C(a, b) mod (10^9 + 7) 的值。

组合数公式 C(a, b) = a! / (b! * (a-b)!)。在模p意义下，除法需要转换为乘以**乘法逆元**。  
C(a, b) ≡ fact[a] * inv(fact[b]) * inv(fact[a-b]) (mod p)

```python
def main():
    MOD = 10 ** 9 + 7
    N = 10 ** 5 + 10

    def _ksm(a, b: int) -> int:
        a %= MOD
        res = 1
        while b!=0:
            if b & 1 == 1:
                res = res * a % MOD
            a = a * a % MOD
            b >>= 1
        return res

    fac = [1] * N
    inf = [1] * N
    def _init():
        for i in range(1, N):
            fac[i] = fac[i - 1] * i % MOD
            inf[i] = inf[i-1] * _ksm(i, MOD - 2) % MOD

    _init()
    n = int(input())
    for _ in range(n):
        a, b = map(int, input().split())
        print(fac[a] * inf[b] % MOD * inf[a - b] % MOD)

if __name__ == "__main__":
    main()
```


### 求组合数 III
给定整数 a, b, p。 计算组合数 C(a, b) mod p 的值。

**背面 (Back)**
**核心算法：卢卡斯定理 (Lucas's Theorem)**
**适用场景**  
a, b 很大，但模数 p 较小的组合数问题。
**定理公式**  
C(a, b) ≡ C(a/p, b/p) × C(a mod p, b mod p) (mod p)
```python
def main():

    def _ksm(a,b,p: int) -> int:
        a %= p
        res = 1
        while b!=0:
            if b & 1 == 1:
                res = res * a % p
            a = a * a % p
            b >>= 1
        return res

    def cal(a, b, p: int) -> int:
        if b > a:
            return 0
        if b > a - b:
            b = a - b
        x = 1
        y = 1
        j = a
        for i in range(1,b + 1):
            y = y * i % p
            x = x * j % p
            j -= 1

        return x * _ksm(y, p - 2, p) % p

    def _lucas(n, m, p: int) -> int:
        if n < p and m < p:
            return cal(n, m, p)
        else:
            return cal(n % p, m % p, p) * _lucas(n // p, m // p, p) % p

    n = int(input())
    for _ in range(n):
        a, b, p = map(int, input().split())
        print(_lucas(a, b, p))

if __name__ == "__main__":
    main()
```

### 求组合数 IV
给定整数 a, b 和素数 p。求 C(a, b) mod p 的值。
**关键约束 (Key Constraints)**
- a,b范围极大 (可达 10^18)
- p范围较小 (≤ 10^5)

线性筛素数：用欧拉筛求出  1∼a 之间的所有素数。

求每个素数的指数：遍历所有筛出的素数p，利用勒让德定理计算
```python

def main():
    N = 5050
    vis = [False] * N
    prime = []
    def _get_prime(n: int):
        for i in range(2, n + 1):
            if not vis[i]:
                prime.append(i)
            for x in prime:
                if i * x > n:
                    break
                vis[i * x] = True
                if i % x == 0:
                    break

    def get(n, p: int) -> int:
        res = 0
        while n != 0:
            res += n // p
            n //= p
        return res


    a,b = map(int, input().split())
    _get_prime(a)

    ans = 1
    for p in prime:
        count = get(a, p) - get(a - b, p) - get(b, p)
        ans = ans * (p ** count)

    print(ans)


if __name__ == "__main__":
    main()
```

## 容斥原理
### 能被整除的数
给定一个整数n和m个互不相同的质数p₁, p₂, ..., pₘ。
求在1到n的整数中，**至少能被**这m个质数中的**一个**整除的数的个数。

问题等价于求m个集合的并集大小。其中，集合Sᵢ是[1, n]范围内能被质数pᵢ整除的数的集合。

**应用容斥原理：**
- **加上**所有单个质数的倍数个数。
- **减去**所有两个不同质数乘积的倍数个数。
- **加上**所有三个不同质数乘积的倍数个数。
- ... 如此交替，奇加偶减。
```python
def main():
    n,m = map(int, input().split())

    p = list(map(int, input().split()))

    ans = 0
    for i in range(1, 1<<m):
        res = 1
        count = 0
        check = True
        for j in range(m):
            if i >> j & 1 == 1:
                if res * p[j] > n:
                    check = False
                    break
                res *= p[j]
                count += 1

        if check:
            if count % 2 == 1:
                ans += n // res
            else:
                ans -= n // res
    print(ans)

if __name__ == "__main__":
    main()
```