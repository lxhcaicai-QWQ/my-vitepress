
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