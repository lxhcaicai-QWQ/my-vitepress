---
outline: [2, 4]   # 当前页面显示 h2~h4
---

## 背包问题
### 01背包问题
- **已知：**
    - N件物品，一个容量为V的背包。
    - 第i件物品的体积是vᵢ，价值是wᵢ。
- **要求：**
    - 每件物品**最多只能选一次**（放或不放）。
    - 求解在总体积不超过V的前提下，能获得的最大总价值。

```python 
def main():
    n, m = map(int, input().split())
    vw = [list(map(int, input().split())) for _ in range(n)]
    dp = [0] * (m + 1)
    for (v, w) in vw:
        for i in range(m, v - 1, -1):
            dp[i] = max(dp[i], dp[i - v] + w)

    print(dp[m])

if __name__ == "__main__":
    main()
```

### 完全背包问题
有 N 种物品和一个容量为 V 的背包，**每种物品都有无限件可用**。
第 i 种物品的体积是v[i]，价值是w[i]。
**求解**：在不超过背包总容量的情况下，所能获得的最大总价值。


```python 
def main():
    n, m = map(int, input().split())
    vw = [list(map(int, input().split())) for _ in range(n)]
    dp = [0] * (m + 1)
    for (v,w) in vw:
        for i in range(v, m + 1, 1):
            dp[i] = max(dp[i], dp[i - v] + w)

    print(dp[m])

if __name__ == "__main__":
    main()
```

### 多重背包问题
有 N 种物品和一个容量为 V 的背包。
第 i 种物品**最多有sᵢ件**，每件体积是vᵢ，价值是wᵢ。
求解：将哪些物品装入背包，可使这些物品的总体积不超过背包容量，且总价值最大。
**【核心区别】**
与 0/1 背包（每种1件）和完全背包（每种无限件）不同，多重背包的每种物品有**有限的件数sᵢ**。

```python 
def main():
    n, m = map(int, input().split())
    vws = [list(map(int, input().split())) for _ in range(n)]
    dp = [0] * (m + 1)

    for (v,w,s) in vws:
        for _ in range(s):
            for i in range(m, v- 1, -1):
                dp[i] = max(dp[i], dp[i - v] + w)

    print(dp[m])

if __name__ == "__main__":
    main()
```

### 多重背包问题 II
有N种物品和一个容量为V的背包。
第i种物品最多有s_i件，每件体积是v_i，价值是w_i。
求解将哪些物品装入背包，可使这些物品总体积不超过背包容量，且总价值最大。
物品数量s_i的值可能很大，导致朴素解法O(N*V*S)超时。

二进制优化 (推荐)**
- **原理**：任何一个十进制数S都可以被拆分为1, 2, 4, 8, ...等若干个 2 的幂次之和。利用这个思想，我们可以将sᵢ件物品打包。
- **操作**：
    1. 将数量为sᵢ的第 i 种物品，拆分成若干个“新物品包”，其包含的原物品数量分别为1, 2, 4, ..., 2^k以及一个余数r（r = sᵢ - (2^(k+1)-1)）。
    2. 例如：sᵢ = 13时，可拆分为数量为1, 2, 4, 6的四个物品包。这四个包可以组合出1到13之间的任意数量。
    3. 将这些“物品包”作为新物品，进行一次 0/1 背包求解。
```python 
def main():
    n, m = map(int, input().split())
    vws = [list(map(int, input().split())) for _ in range(n)]

    vw = []
    for (v,w,s) in vws:
        j = 1
        while s >= j:
            vw.append([v * j, w * j])
            s -= j
            j *= 2

        if s > 0:
            vw.append([v * s, w * s])

    dp = [0] * (m + 1)

    for (v,w) in vw:
            for i in range(m, v- 1, -1):
                dp[i] = max(dp[i], dp[i - v] + w)

    print(dp[m])

if __name__ == "__main__":
    main()
```

### 分组背包问题
有N组物品和一个容量为V的背包。
第i组共有S_i件物品，其中每件物品都有自己的体积v_{ij}和价值w_{ij}。
**约束条件**
从每组物品中，**最多只能选择一件**放入背包。

**题解思路：动态规划**
分组背包问题是 0/1 背包问题的扩展。核心思想是将**每一组物品**看作一个决策单元。
```python 
def main():
    n, m = map(int, input().split())

    c = []
    v = []
    w = []
    for _ in range(n):
        c.append(int(input()))
        v.append([])
        w.append([])
        for _ in range (c[-1]):
            a,b = map(int, input().split())
            v[-1].append(a)
            w[-1].append(b)

    dp = [0] * (m +1)
    for i in range(n):
        for j in range(m, -1, -1):
            for k in range(c[i]):
                if j >= v[i][k]:
                    dp[j] = max(dp[j], dp[j-v[i][k]] + w[i][k])

    print(dp[m])

if __name__ == "__main__":
    main()
```

## 线性DP

### 数字三角形
给定一个数字三角形，从顶端出发，每次只能走向下一行的相邻节点（左下或右下）。
求从顶端走到最底层的一条路径，使得路径上数字总和最大。

这是典型的**数字三角形模型**，使用**动态规划 (Dynamic Programming)**解决。
**核心思路：**自底向上递推。从下往上思考，对于每个位置(i, j)，它到达底层的最大路径和，等于它自身的值，加上它下方两个相邻节点(i+1, j)和(i+1, j+1)到达底层最大路径和中的较大者。
```python
def main():
    n = int(input())
    a = [[0] * n  for _ in range(n)]
    dp = [[-10**10] * (n + 1)  for _ in range(n + 1)]
    for i in range(n):
        x = list(map(int, input().split()))
        a[i][: len(a)] = x

    dp[1][1] = a[0][0]
    for i in range(2,n + 1):
        for j in range(1,i + 1):
            dp[i][j] = max(dp[i-1][j], dp[i-1][j-1]) + a[i - 1][j - 1]

    ans = max(dp[n])
    print(ans)

if __name__ == "__main__":
    main()
```

### 最长上升子序列
给定一个长度为 N 的数字序列，请求出该序列中一个**最长的**、**严格递增**的**子序列**的长度。
**子序列：**从原序列中删除若干（可为零）个元素后，不改变剩下元素的相对位置，得到的序列。


```pytho
def main():
    n = int(input())
    nums = list(map(int, input().split()))
    dp =[1] * n

    for i in range(n):
        for j in range(i):
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)

    print(max(dp))

if __name__ == "__main__":
    main()
```

### 最长上升子序列 II
给定一个长度为 N 的数列，求其最长上升子序列 (LIS) 的长度。

维护一个辅助数组q，其中q[k]记录的是**所有长度为k+1的上升子序列中，结尾元素的最小值**。该数组q必然是单调递增的。

遍历原数组的每个数x：
1. 如果x大于q的尾元素，则直接将x添加到q的末尾（q.push_back(x)）。这表示最长上升子序列的长度增加了1。
2. 否则，在q中**二分查找**第一个**大于或等于**x的元素，并将其替换为x。这表示我们找到了一个长度相同但结尾更小（更有潜力）的上升子序列。
```python
def main():
    n = int(input())
    nums = list(map(int, input().split()))

    que = []

    for x in nums:
        if len(que) == 0 or que[-1] < x:
            que.append(x)

        l, r = 0, len(que) - 1
        pos = 0
        while l <= r:
            mid = (l + r) // 2
            if que[mid] >= x:
                r = mid - 1
                pos = mid
            else:
                l = mid + 1
        que[pos] = x

    print(len(que))

if __name__ == "__main__":
    main()
```

### 最长公共子序列
给定两个长度分别为N和M的字符串 A 和 B，求它们的最长公共子序列 (Longest Common Subsequence) 的长度。

- **子序列**：从原序列中不改变元素的相对顺序，删除任意多个元素后得到的新序列。
  **状态转移方程**
    - 基于A[i]和B[j]是否相等进行分类讨论：
    - **情况一：A[i] == B[j]**
        - f\[i]\[j] = f\[i-1]\[j-1] + 1
        - (当前字符相同，可以作为公共部分，LCS 长度在前一个状态的基础上 +1)
    - **情况二：A[i] != B[j]**
        - f\[i]\[j] = max(f\[i-1]\[j], f\[i]\[j-1])
        - (当前字符不同，LCS 来自于 "A的前i-1个字符与B的前j个字符" 或 "A的前i个字符与B的前j-1个字符" 中的较大者)
```python
def main():
    n, m = map(int, input().split())
    a = input()
    b = input()
    a = " " + a
    b = " " + b

    f = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i] == b[j]:
                f[i][j] = f[i - 1][j - 1] + 1
            else:
                f[i][j] = max(f[i][j-1],f[i-1][j])

    print(f[n][m])

if __name__ == "__main__":
    main()
```

### 最短编辑距离
给定两个字符串 A 和 B，每次操作可以选择以下三种之一：
1. **插入 (Insert)** 一个字符
2. **删除 (Delete)** 一个字符
3. **修改 (Replace)**一个字符
   求将字符串 A 变为字符串 B 所需的**最少操作次数**。


--- 
**状态定义**
- f[i][j] 表示把 a 的前 i 个字符变成 b 的前 j 个字符的最少操作次数。

**初始化**
- f[i][0] = i （把 a 的前 i 个字符全删除）
- f[0][j] = j （在 a 中全插入 b 的前 j 个字符）

对于当前的 a[i] 和 b[j]：
- 若字符相同：不用操作。 f[i][j] = f[i-1][j-1]
- 若字符不同：取增、删、改三种操作的最小值再加 1。 f[i][j] = min(f[i][j-1], f[i-1][j], f[i-1][j-1]) + 1

```python
def main():
    n = int(input())
    a = input()
    m = int(input())
    b = input()

    a = " " + a
    b = " " + b

    f = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        f[i][0] = i
    for j in range(1, m + 1):
        f[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i] == b[j]:
                f[i][j] = f[i - 1][j - 1]
            else:
                f[i][j] = min(f[i - 1][j], f[i][j - 1], f[i - 1][j - 1]) + 1

    print(f[n][m])

if __name__ == "__main__":
    main()
```

### 编辑距离

给定两个字符串 A 和 B，求将字符串 A 变为字符串 B 所需要的**最少**操作次数。
**允许的操作 (每种操作计为1次):**
1. **删除 (Delete):** 删除 A 中的一个字符。
2. **插入 (Insert):** 在 A 中插入一个字符。
3. **修改 (Replace):** 将 A 中的一个字符修改成另一个。

和上面最短编集距离做法一致， 枚举一下，判断一下

```python
def check(a, b: str) -> int:
    n = len(a)
    m = len(b)
    a = " " + a
    b = " " + b
    f = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        f[i][0] = i
    for j in range(1, m + 1):
        f[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i] == b[j]:
                f[i][j] = f[i-1][j-1]
            else:
                f[i][j] = min(f[i-1][j-1], f[i-1][j], f[i][j-1]) + 1
    return f[n][m]

def main():
    n,m = map(int,input().split())
    ss = [input() for _ in range(n)]
    for _ in range(m):
        target, limit= input().split()
        limit = int(limit)

        ans = 0
        for s in ss:
            if check(s, target) <= limit:
                ans += 1

        print(ans)

if __name__ == "__main__":
    main()
```

## 区间DP

### 石子合并
在四周摆放着 N 堆石子。现要将石子有次序地合并成一堆。
- **操作:**每次只能选择**相邻**的两堆石子合并成新的一堆。
- **代价:**每次合并的代价为新的一堆中石子的总数。
- **目标:**求将 N 堆石子合并成一堆的**最小总代价**和**最大总代价**。

**状态转移方程:**
- 枚举区间长度len从 2 到N。
- 枚举区间左端点i，则右端点j = i + len - 1。
- 枚举该区间的**最后一次合并**的分割点k(i <= k < j)。
- **最小代价:** f\[i]\[j] = min(f\[i]\[k] + f\[k+1]\[j]) + (s[j] - s[i-1])
- **最大代价:** g\[i]\[j] = max(g\[i]\[k] + g\[k+1]\[j]) + (s[j] - s[i-1])

```python
N = 10 ** 10
def main():
    n = int(input())
    nums = list(map(int, input().split()))
    sums = [0] * (n + 1)
    for i in range(1, n + 1):
        sums[i] = sums[i - 1] + nums[i - 1]

    f = [[N] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        f[i][i] = 0
    for length in range(1, n + 1):
        for i in range(1, n - (length - 1) + 1):
            j = i + length - 1
            for k in range(i, j):
                f[i][j] = min(f[i][j], f[i][k] + f[k + 1][j] + sums[j] - sums[i - 1])
    print(f[1][n])
if __name__ == "__main__":
    main()
```

## 计数类DP

### 整数划分
将一个正整数n表示成一系列正整数之和，求一共有多少种不同的表示方法？
**注意：**拆分方案中的数字顺序不同，视为同一种方案。

**示例：**  
n = 4的划分方案有 5 种：  
{4}, {3,1}, {2,2}, {2,1,1}, {1,1,1,1}

**模型转化**:
    - **物品**:1, 2, 3, ..., n这n个正整数。
    - **背包容量**:n。
    - **物品属性**: 每个物品i的体积为i，可以无限次使用。
    - **目标**: 求恰好装满容量为n的背包的**方案总数**。
```python
def main():
    n = int(input())
    f = [0] * (n + 1)
    f[0] = 1
    MOD = 10 ** 9 + 7
    for i in range(1, n + 1):
        for j in range(i, n + 1):
            f[j] += f[j - i]
            f[j] %= MOD

    print(f[n])

if __name__ == "__main__":
    main()
```

## 状态压缩DP

### 最短Hamilton路径
给定一个n个点的带权无向完全图 (n ≤ 20)，点从0到n-1编号。
求一条从点0出发，经过**每个点恰好一次**，最终到达点n-1的最短路径长度。

**题解思路：状态压缩DP**
由于n很小，这是使用状态压缩DP的典型信号。
1. **核心思路：**  
   用一个整数的二进制位来表示点的访问状态（即“状态压缩”），然后进行动态规划。
2. **状态定义：**
   f\[i]\[j]表示:
    - i: 一个二进制数 (bitmask)，表示已经访问过的点的集合。若i的第k位为1，则表示点k已被访问。
    - j: 当前路径的终点是点j。
    - f\[i]\[j]的值：满足上述条件的所有路径中的**最短长度**。
3. **状态转移方程：**  
   f\[i]\[j] = min( f\[i ^ (1<<j)]\[k] + w\[k]\[j] )
    - **解释**：要计算到达状态(i, j)的最短路径，我们可以枚举上一个点k。这个点k必须在不包含j的点集i ^ (1<<j)中。路径长度就是“到达状态(i ^ (1<<j), k)的最短路” 加上 “从k到j的距离w\[k]\[j]”。我们取所有可能的k中的最小值。
```python
MAX_INF = 10**18
def main():
    n = int(input())
    dis = [list(map(int, input().split())) for _ in range(n)]

    f = [[MAX_INF] * (n + 1) for _ in range(1 << n)]
    f[1][0] = 0
    for i in range(1, 1 << n):
        for j in range(n):
            if i >> j & 1 == 1:
                for k in range(n):
                    if ((i ^ (1<<j)) >> k & 1) ==1:
                        f[i][j] = min(f[i ^ (1 << j)][k] + dis[k][j], f[i][j])

    print(f[(1<<n) - 1][n - 1])
if __name__ == "__main__":
    main()
```