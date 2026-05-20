---
outline: [2, 4]   # 当前页面显示 h2~h4
---

## 区间问题

###  区间选点
给定N个闭区间[a, b]，请在数轴上选择**最少**数量的点，使得每个给定的区间内都**至少包含一个**你选择的点。

为了让一个点能覆盖尽可能多的区间，应该把这个点选在区间的**最右端**。
**排序**：将所有区间按**右端点 (b)** 从小到大进行升序排
```python
def main():
    n = int(input())
    lines = [list(map(int,input().split())) for _ in range(n)]
    lines.sort(key = lambda x:x[1])
    ans = 1
    cur = lines[0][1]
    for (l,r) in lines[1:]:
        if l > cur:
            ans += 1
            cur = r
    print(ans)

if __name__ == "__main__":
    main()
```

###  最大不相交区间数量
给定 N 个闭区间[l, r]，请你在这些区间中选择一个子集，使得子集中的区间两两之间互不相交。
求这个子集大小的最大值。

这是一个经典的区间贪心问题。
**核心策略：将所有区间按右端点从小到大排序。**
```python
def main():
    n = int(input())
    lines =  [list(map(int, input().split())) for _ in range(n)]
    lines.sort(key = lambda x: x[1])

    ans = 1
    cur = lines[0][1]
    for (l,r) in lines[1:]:
        if l > cur:
            ans += 1
            cur = r

    print(ans)

if __name__ == "__main__":
    main()
```


###  区间分组
给定 N 个开闭区间[l, r]。
你需要将这些区间分成若干组，使得每组内的区间两两不相交（端点可以重合）。

**题解思路：贪心算法 + 小根堆**
1. **排序**：将所有区间按**左端点l**从小到大排序。
2. **维护分组**：使用一个**小根堆 (Min-Heap)**来维护当前所有分组中，每个组里最后一个区间的**结束时间r**。
    - 堆顶元素heap.top()代表所有组中，那个**最早结束的时间**。
```python
import heapq

def main():
    n = int(input())
    lines =  [list(map(int, input().split())) for _ in range(n)]
    lines.sort(key = lambda x: x[0])

    pq = [lines[0][1]]
    for (l, r) in lines[1:]:
        if pq[0] < l:
            heapq.heappop(pq)
            heapq.heappush(pq, r)
        else:
            heapq.heappush(pq, r)

    print(len(pq))

if __name__ == "__main__":
    main()
```


###  区间覆盖
给定一个目标区间[st, ed]和n个可选区间。
**目标:** 选择**最少**数量的区间，使其能完全覆盖目标区间[st, ed]。

在每一步都做出当前看起来最优的选择：即选择能将覆盖范围向右延伸最远的区间。
**解题步骤:**
1. **排序:**将所有可选区间按**左端点**从小到大排序。
2. **初始化:** 设定当前已覆盖的最远右端点current_end = st，结果count = 0。
3. **循环选择:**
    - 当current_end < ed时，进入循环。
    - 在所有左端点 ≤ current_end的区间中，找到一个**右端点最大**的区间。
    - 用这个最大的右端点来更新current_end，并将count加 1。
```python
def main():
    st, ed = map(int, input().split())
    n = int(input())
    lines = [list(map(int, input().split())) for _ in range(n)]
    lines.sort(key=lambda x: x[0])

    # 特判：目标区间退化为一个点
    if st == ed:
        for l, r in lines:
            if l <= st <= r:
                print(1)
                return
        print(-1)
        return

    cur = st
    i = 0
    ans = 0

    while cur < ed:
        max_r = cur
        while i < n and lines[i][0] <= cur:
            max_r = max(max_r, lines[i][1])
            i += 1

        if cur == max_r:
            print(-1)
            return

        ans += 1
        cur = max_r

    print(ans)

if __name__ == "__main__":
    main()

```

## Huffman树

### 合并果子
有 n 堆果子，每次只能合并两堆。合并的代价是这两堆果子的数量之和。
求将所有果子合并成一堆所需的**最小总代价**。

**核心思想：** **贪心算法**(此为经典的 **哈夫曼树** 模型)
```python
import heapq

def main():
    n = int(input())
    pq = list(map(int, input().split()))

    # 将普通列表原地转化为最小堆
    heapq.heapify(pq)

    ans = 0
    while len(pq) > 1:
        a = heapq.heappop(pq)
        b = heapq.heappop(pq)
        heapq.heappush(pq, a + b)
        ans += a + b
    print(ans)

if __name__ == "__main__":
    main()
```

## 排序不等式

### 排队打水
有 n 个人排队打水，第 i 个人打水需要的时间为 tᵢ。
如何安排排队顺序，才能使所有人的**总等待时间**之和最小？

这是一个经典的**贪心**问题。
**核心思想：让打水时间短的人排在前面。**
**直观理解：**  
打水时间短的人排在前面，可以有效减少后面所有人的等待时间，从而使总和最小。
```python
def main():
    n = int(input())
    a = list(map(int, input().split()))
    a.sort()

    ans = 0
    cur = 1
    for x in a:
        ans += (n - cur) * x
        cur += 1
    print(ans)

if __name__ == "__main__":
    main()
```

## 绝对值不等式

### 货仓选址货仓选址
在一条数轴上有 N 个商店，其坐标分别为x₁, x₂, ..., xₙ。
现要在这条数轴上建立一个货仓，问货仓应建在**何处**，才能使所有商店到货仓的**距离之和最小**？

**核心思想：中位数定理 (Median Theorem)**
当货仓的位置p选在所有商店坐标x的**中位数**上时，距离之和最小。
- **奇数个点：** 中位数是唯一的（排序后最中间的那个数）。
- **偶数个点：** 中位数是排序后中间两个数之间的任意一点（包括端点），选择其中任意一个作为货仓位置，最终的最小距离和都一样。
```python
def main():
    n = int(input())
    a = list(map(int, input().split()))
    a.sort()

    mid = (n - 1) // 2 # 坐标从零开始
    ans = 0
    for x in a:
        ans += abs(x - a[mid])
    print(ans)

if __name__ == "__main__":
    main()
```

## 推公式
### 耍杂技的牛
n 头牛要表演叠罗汉。每头牛有自己的重量 W 和力量 S。
一头牛的**危险系数**定义为：排在它**上方**所有牛的重量之和，减去它自己的力量 S。
求一种排列顺序，使得所有牛中的**最大危险系数**最小。

1. **贪心策略:**  
   将所有牛按照**重量(W)与力量(S)之和**，即W+S，**从小到大**排序。
2. **证明 (邻项交换法):**  
   对于任意相邻的两头牛 i 和 j，假设 i 在 j 上方。若交换它们，使得 j 在 i 上方，只有 i 和 j 的危险系数会改变。可以证明，当W_i + S_i < W_j + S_j时，将 i 放在 j 的上方，得到的最大危险系数一定不劣于交换后的情况。因此该排序策略最优。
```python
def main():
    n = int(input())
    cows = [list(map(int, input().split())) for _ in  range(n)]
    cows.sort(key = lambda x: x[0] + x[1])
    ans = - (10 ** 10)
    res = 0
    for (w,s) in cows:
        ans = max(ans, res - s)
        res += w
    print(ans)

if __name__ == "__main__":
    main()
```