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
