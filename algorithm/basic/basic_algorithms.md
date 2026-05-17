---
outline: [2, 4]   # 当前页面显示 h2~h4
---

# 基础算法

## 快速排序

### 快速排序
给定一个长度为n的整数数列q。
请你使用**快速排序**算法，将该数列从小到大排序，并输出排序后的结果。

```python

def quick_sort(nums: list[int]):

    def _quick_sort(items: list[int], l, r:int):
        mid: int = items[(l+r)//2]
        i, j = l, r
        while i < j:
            while items[i] < mid:
                i += 1
            while items[j] > mid:
                j -= 1
            if i <= j:
                items[i], items[j] = items[j], items[i]
                i += 1
                j -= 1

        if i < r:
            _quick_sort(items, i, r)
        if j > l:
            _quick_sort(items, l, j)

    _quick_sort(nums, 0, len(nums) - 1)

def main() -> None:
    n = int(input())
    nums = list(map(int, input().split()))
    quick_sort(nums)
    print(*nums)

if __name__ == "__main__":
    main()
```

### 第k个数
给定一个长度为n的整数数列q，以及一个整数k。
请找出并输出数列中第k小的数。
```python

def find_k(nums: list[int], ktop: int) -> int:

    def _find_k(l, r, k: int) -> int:
        if l >= r:
            return nums[l]
        mid: int = nums[(l + r) //2]
        i, j = l - 1, r + 1
        while i < j:
            while True:
                i += 1
                if not (nums[i] < mid):
                    break

            while True:
                j -= 1
                if not (nums[j] > mid):
                    break

            if i < j:
                nums[i], nums[j] = nums[j], nums[i]

        left_length = j - l + 1
        if  left_length >= k:
            return _find_k(l, j, k)
        else:
            return _find_k(j + 1, r, k - left_length)


    return _find_k( 0, len(nums) - 1, ktop)

def main() -> None:
    n,k = map(int, input().split())
    nums = list(map(int, input().split()))
    result = find_k(nums, k)
    print(result)

if __name__ == "__main__":
    main()
```

## 归并排序

### 归并排序
给定一个长度为n的整数数列，请你使用「归并排序」算法，将数列按从小到大进行排序。

```python

def mergesort(nums: list[int]):

    def _merge_sort(l, r: int):
        if l == r:
            return
        mid = (l + r) // 2
        _merge_sort(l, mid)
        _merge_sort(mid + 1, r)

        i, j = l, mid + 1
        temp = []
        for k in range(l, r + 1):
            if j > r or (i <= mid and nums[i] <= nums[j]):
                temp.append(nums[i])
                i += 1
            else:
                temp.append(nums[j])
                j += 1

        idx: int = l
        for item in temp:
            nums[idx] = item
            idx += 1

    _merge_sort(0, len(nums) - 1)


def main():
    n = map(int, input())
    nums = list(map(int, input().split()))
    mergesort(nums)
    print(*nums)

if __name__ == "__main__":
    main()
```

### 逆序对的数量
给定一个长度为n的整数序列，求序列中**逆序对**的数量。

**逆序对定义**: 对于序列中任意两个元素a[i]和a[j]，如果i < j且a[i] > a[j]，则称(a[i], a[j])是一个逆序对。

**核心思想**:
归并排序在“合并 (merge)”两个已排序的子数组时，可以方便地计算出跨越这两个子数组的逆序对数量。

一个序列的总逆序对数 =**左半部分内部的逆序对数**+**右半部分内部的逆序对数**+**一个数在左半部分、另一个在右半部分的逆序对数**。

```python

def solve(nums: list[int]) -> int:

    def _merge_sort(l, r: int):
        if l == r:
            return 0
        mid: int = (l + r) // 2
        left_count = _merge_sort(l, mid)
        right_count = _merge_sort(mid + 1, r)

        temp = []
        i, j = l, mid + 1
        count: int = 0
        for k in range(l, r + 1):
            if j > r or (i <= mid and nums[i] <= nums[j]):
                temp.append(nums[i])
                i += 1
            else:
                temp.append(nums[j])
                count += mid - i + 1
                j += 1

        idx: int = l
        for item in temp:
            nums[idx] = item
            idx += 1

        return left_count + right_count + count

    return _merge_sort(0, len(nums) - 1)


def main():
    n = map(int, input())
    nums = list(map(int, input().split()))
    print(solve(nums))

if __name__ == "__main__":
    main()
```


## 二分

### 数的范围
给定一个按**升序**排列的整数数组q和若干个查询x。
对于每个查询x，要求输出它在数组中**首次出现**和**最后一次出现**的位置（下标从0开始）。
如果数组中不存在该数，则输出-1 -1。

此题是**二分查找**的经典应用。因为需要寻找区间的左右两个端点，所以需要执行两次二分查找，分别用于寻找左边界和右边界。

```python

def main():
    n, q = map(int, input().split())
    nums = list(map(int, input().split()))


    def _query(item: int) -> tuple[int, int]:
        l, r = 0, len(nums) - 1
        lpos = -1
        while l<=r:
            mid = (l + r) // 2
            if nums[mid] >= k:
                r = mid - 1
                lpos = mid
            else:
                l = mid + 1

        if lpos == -1 or nums[lpos] != item:
            return -1, -1

        l, r = 0, len(nums) - 1
        rpos = -1
        while l<=r:
            mid = (l + r) // 2
            if nums[mid] <= k:
                l = mid + 1
                rpos = mid
            else:
                r = mid - 1

        if rpos == -1 or nums[rpos] != item:
            return -1, -1
        return lpos, rpos

    for _ in range(q):
        k = int(input())
        print(*_query(k))


if __name__ == "__main__":
    main()
```

### 数的三次方根
给定一个浮点数n，求它的三次方根。

这个问题的本质是在一个单调递增的函数f(y) = y³上，寻找一个y使得f(y) = n。由于函数f(y)在整个实数域上都是单调的，所以非常适合使用二分查找算法。
```python
def main() -> None:
    n = float(input())
    l, r = -50.0, 50.0
    while abs(r - l) > 1e-8:
        mid = (l + r) / 2
        if mid ** 3 >= n:
            r = mid
        else:
            l = mid
    print(f"{r:.6f}")

if __name__ == "__main__":
    main()
```

## 高精度

### 高精度加法

给定两个长度可能非常长（最高可达 10^6 位）的非负整数 A 和 B，它们以字符串形式输入。请计算并输出它们的和。


模拟人类进行“竖式加法”的计算过程。从个位开始，逐位对齐相加，并处理好每一位的进位。

- python原生解法
```python
import sys

# 【关键解封操作】将字符串转整数的最大位数限制设置为 0 (即无限制)
sys.set_int_max_str_digits(0)

def main() -> None:
    a = int(input())
    b = int(input())
    result = a + b
    print(result)

if __name__ == "__main__":
    main()
```
- 高精度模拟加法
```python

def _sub(a, b: str) -> str:
    if len(a) < len(b):
        return _sub(b,a)

    # 反转字符串
    a = a[::-1]
    b = b[::-1]

    alen = len(a)
    blen = len(b)

    t: int = 0
    result = []
    for i in range(alen):
        t += int(a[i])
        if i < blen:
            t += int(b[i])

        result.append(t % 10)
        t //= 10

    while t!=0:
        result.append(t % 10)
        t //= 10

    return ''.join(map(str,result[::-1]))

def main() -> None:
    a = str(input())
    b = str(input())

    print(_sub(a,b))

if __name__ == "__main__":
    main()
```

### 高精度减法
给定两个非常大的正整数 A 和 B（以字符串形式表示），计算 A - B 的值。

```python

def compare(a, b:str) -> bool:
    if len(a) != len(b):
        return len(a) > len(b)

    for i in range(len(a)):
        if a[i] != b[i]:
            return a[i] > b[i]
    return True

def sub(a,b:str) -> str:
    a = a[::-1]
    b = b[::-1]
    alen = len(a)
    blen = len(b)

    result = []
    t = 0
    for i in range(alen):
        t = int(a[i]) - t
        if i < blen:
            t -= int(b[i])
        result.append((t + 10) % 10)
        if t < 0:
            t = 1
        else:
            t = 0
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return ''.join(map(str, result[::-1]))

def main() -> None:
    a = str(input())
    b = str(input())
    if compare(a,b):
        print(sub(a,b))
    else:
        print(f"-{sub(b,a)}")

if __name__ == "__main__":
    main()
```

### 高精度乘法
给定一个长度最高可达100000位的非负大整数A(以字符串形式给出) 和一个普通的非负整数b(0 ≤ b ≤ 10000)，计算并输出它们的乘积。

模拟小学竖式乘法。将大整数A的每一位从低到高（个位、十位...）依次乘以b，并处理好每一步的**进位**。

```python
def mul(a: str, b: int) -> str:
    a = a[::-1]
    alen = len(a)

    t = 0
    result = []
    for i in range(alen):
        t += int(a[i]) * b
        result.append(t%10)
        t //= 10

    while t != 0:
        result.append(t%10)
        t //= 10
    
    # 避免乘0的情况
    while len(result) > 1 and result[-1] == 0:
        result.pop()

    return ''.join(map(str, result[::-1]))

def main():
    a = str(input())
    num = int(input())
    print(mul(a, num))

if __name__ == "__main__":
    main()
```

### 高精度除法
实现一个高精度整数 A (以字符串表示) 除以一个低精度整数 b 的运算。

算法的核心是模拟手动做长除法的过程，从被除数的最高位开始，逐位向低位计算。过程中，将上一位的余数乘以10，再加上当前位的数字，作为新的被除数，然后进行除法运算。

```python
def div(a: str, num: int) -> tuple[str, int]:
    t = 0
    result = []
    for i in range(len(a)):
        t = t * 10 + int(a[i])
        result.append(t // num)
        t %= num

    result = result[::-1]
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return ''.join(map(str, result[::-1])), t

def main():
    a = str(input())
    num = int(input())
    result, remainer = div(a, num)
    print(result)
    print(remainer)

if __name__ == "__main__":
    main()
```

## 前缀和与差分

### 前缀和
给定一个长度为n的整数序列a，之后进行m次询问。
每次询问给定两个整数l和r，请求出序列a中第l个数到第r个数的和。

**预处理**：用 O(n) 的时间创建一个新的数组S，称为**前缀和数组**。
- **定义**：S[i]存储原数组a中前i个元素的和，即S[i] = a[1] + a[2] + ... + a[i]。
- **查询**：利用前缀和数组，可以在 O(1) 的时间内计算出任意区间[l, r]的和。

```python

def main():
    n, m = map(int, input().split())

    arr = list(map(int, input().split()))
    n = len(arr)
    sums = [0] * (n + 1)
    for i in range(n):
        sums[i + 1] = sums[i] + arr[i]

    def _query(l, r: int):
        return sums[r] - sums[l-1]

    for _ in range(m):
        l, r = map(int, input().split())
        print(_query(l, r))

if __name__ == "__main__":
    main()
```

### 子矩阵的和
输入一个n x m的整数矩阵和q个询问。
每个询问给出子矩阵的左上角坐标(x1, y1)和右下角坐标(x2, y2)。
对于每个询问，求出该子矩阵中所有元素的和。

```python
def main():
    n,m,q = map(int, input().split())
    martix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        martix.append(row)

    prefix = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n):
        for j in range(m):
            prefix[i + 1][j + 1] = prefix[i + 1][j] + prefix[i][j+1] - prefix[i][j] + martix[i][j]

    def _query(x1,y1,x2,y2: int) -> int:
        return prefix[x2][y2] - prefix[x2][y1-1] - prefix[x1-1][y2] + prefix[x1-1][y1-1]

    for _ in range(q):
        x1,y1,x2,y2 = map(int, input().split())
        print(_query(x1,y1,x2,y2))

if __name__ == "__main__":
    main()
```

### 差分
给定一个初始数组a和m次操作。
每次操作的形式为(l, r, c)，要求将数组a在区间[l, r]内的所有元素都加上c。
求执行完所有m次操作后，最终的数组是什么。

正确思路是使用**差分数组**。定义一个差分数组b，使得原数组a是b的前缀和。
- **定义**:b[i] = a[i] - a[i-1](规定a[0] = 0)
- **性质**:a[i] = b[1] + b[2] + ... + b[i]

```python
def main():
    n, m = map(int, input().split())
    nums = list(map(int, input().split()))

    subs =[0] * (n + 2)
    for i in range(n):
        if i == 0:
            subs[i + 1] = nums[i]
        else:
            subs[i + 1] = nums[i] - nums[i - 1]

    for _ in range(m):
        l, r, c = map(int, input().split())
        subs[l] += c
        subs[r + 1] -= c

    for i in range(n):
        subs[i + 1] += subs[i]
        print(subs[i + 1],end=" ")

if __name__ == "__main__":
    main()
```

### 差分矩阵
给定一个n x m的初始矩阵。接下来有q次操作，每次操作对一个子矩阵(x1, y1)到(x2, y2)内的所有元素都加上一个值c。

二维差分是解决此类问题的关键。其思想是构造一个**差分矩阵b**，使得原矩阵a是差分矩阵b的**二维前缀和**。这样，对原矩阵a的一个子矩阵区域进行修改，就等价于对差分矩阵b的**四个角**进行修改。二维差分是解决此类问题的关键。其思想是构造一个**差分矩阵b**，使得原矩阵a是差分矩阵b的**二维前缀和**。这样，对原矩阵a的一个子矩阵区域进行修改，就等价于对差分矩阵b的**四个角**进行修改。

```python
def main():
    n,m,q = map(int,input().split())

    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)

    subs =[[0] * (m + 2) for _ in range(n + 2)]

    def _insert(x1,y1,x2,y2,c: int):
        subs[x1][y1] += c
        subs[x1][y2 + 1] -=c
        subs[x2 + 1][y1] -=c
        subs[x2 + 1][y2 + 1] += c

    for i in range(1,n + 1):
        for j in range(1,m + 1):
            _insert(i,j,i,j,matrix[i-1][j-1])

    for _ in range(q):
        x1, y1, x2, y2, c = map(int, input().split())
        _insert(x1,y1,x2,y2,c)

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            subs[i][j] += subs[i-1][j] + subs[i][j-1] - subs[i-1][j-1]

    for i in range(1, n + 1):
        print(*subs[i][1:m+1])

if __name__ == "__main__":
    main()
```


## 双指针算法

### 最长连续不重复子序列
给定一个整数数组，找出并返回其中最长的、**连续**的、**不含重复元素**的子序列的长度。
**示例**
- **输入:** [1, 2, 2, 3, 5]
- **输出:** 3
- **解释:** 最长连续不重复子序列是[2, 3, 5]，长度为 3。

在窗口内出现重复元素时向右移动以缩小窗口。始终保持窗口内没有重复元素，并在此过程中记录窗口的最大长度。
```python
from collections import deque

def main():
    n = int(input())

    ans = 1
    keyset = set()
    que = deque()
    for x in list(map(int, input().split())):
        while x in keyset:
            item = que.popleft()
            keyset.remove(item)

        que.append(x)
        keyset.add(x)
        ans = max(ans, len(que))

    print(ans)

if __name__ == "__main__":
    main()
```

### 数组元素的目标和
- **输入**
    - 两个**升序**整数数组A和B。
    - 一个目标值x。
- **目标**
    - 在A和B中各找一个数，使得它们的和恰好等于x。
    - 输出这两个数在各自数组中的下标i和j

利用数组的**单调性**（已排序）。一个指针i指向数组A的开头，另一个指针j指向数组B的结尾，两个指针相向移动，不断缩小搜索范围。
```python
def main():
    n,m,x = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    i, j = 0, len(b) - 1
    while i < len(a):
        while j >=0 and a[i] + b[j] > x:
            j -=1
        if j >= 0 and a[i] + b[j] == x:
            print(i, j)
        i += 1

if __name__ == "__main__":
    main()
```

### 判断子序列
给定两个长度分别为n和m的整数序列a和b，判断序列a是否是序列b的子序列。
**子序列定义**从原序列中删除若干个元素（也可以不删），剩余元素保持原有相对顺序组成的新序列。

采用双指针法分别遍历两个字符串，按顺序在主串中匹配子串的字符，若子串指针能顺利走到末尾则判定为子序列。

(注：核心思路即为贪心匹配，只要遇到相同的字符就同步移动指针，否则只移动主串指针。)
```python
def main():
    n,m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    i = 0
    for x in b:
        if a[i] == x:
            i += 1
        if i == n:
            break

    print("Yes" if i == n else "No")

if __name__ == "__main__":
    main()
```