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