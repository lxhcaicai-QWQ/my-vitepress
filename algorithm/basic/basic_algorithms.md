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