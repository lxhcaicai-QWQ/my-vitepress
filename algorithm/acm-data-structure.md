# ACM 模式 Python 常用数据结构总结

## 一、栈（Stack）

### 1. 基本操作

```python
stack = []

# 入栈
stack.append(x)

# 出栈
top = stack.pop()

# 查看栈顶（不出栈）
top = stack[-1]

# 判空
is_empty = len(stack) == 0

# 栈大小
size = len(stack)
```

### 2. 单调栈 — 找左侧/右侧第一个更大/更小元素

```python
# 找每个元素左侧第一个比它小的元素，没有则输出 -1
# 输入: 3 4 2 7 5
# 输出: -1 3 -1 2 2
def main():
    n = int(input())
    nums = list(map(int, input().split()))

    stack = []
    for x in nums:
        while stack and stack[-1] >= x:
            stack.pop()
        print(stack[-1] if stack else -1, end=" ")
        stack.append(x)
```

### 3. 单调栈常见变体

```python
# 找每个元素右侧第一个比它大的元素下标
# 输出数组 next_greater，next_greater[i] 为右侧第一个 > a[i] 的下标，没有则为 -1
n = len(a)
next_greater = [-1] * n
stack = []  # 存下标
for i in range(n):
    while stack and a[stack[-1]] < a[i]:
        next_greater[stack.pop()] = i
    stack.append(i)
```

---

## 二、队列（Queue）

### 1. 基本操作

```python
from collections import deque

q = deque()

# 入队
q.append(x)

# 出队
front = q.popleft()

# 查看队头
front = q[0]

# 查看队尾
back = q[-1]

# 判空
is_empty = len(q) == 0
```

### 2. 单调队列 — 滑动窗口最大/最小值

```python
from collections import deque

# 滑动窗口最小值
def sliding_window_min(a, k):
    dq = deque()  # 存下标
    res = []
    for i in range(len(a)):
        # 移除超出窗口的元素
        while dq and dq[0] <= i - k:
            dq.popleft()
        # 维护单调递增（队头为最小值）
        while dq and a[dq[-1]] >= a[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(a[dq[0]])
    return res
```

### 3. 双端队列常用操作

```python
from collections import deque

dq = deque()

# 头部插入/弹出
dq.appendleft(x)
dq.popleft()

# 尾部插入/弹出
dq.append(x)
dq.pop()
```

---

## 三、堆 / 优先队列（Heap / Priority Queue）

### 1. 基本操作（最小堆）

```python
import heapq

heap = []

# 插入元素
heapq.heappush(heap, x)

# 弹出最小元素
min_val = heapq.heappop(heap)

# 查看最小元素（不弹出）
min_val = heap[0]

# 堆化已有列表
heapq.heapify(arr)
```

### 2. 最大堆（取负数）

```python
import heapq

# 插入时取负
heapq.heappush(heap, -x)

# 弹出时再取负恢复
max_val = -heapq.heappop(heap)
```

### 3. 自定义优先级（元组比较）

```python
import heapq

heap = []
# 元组第一个元素为优先级，第二个为实际数据
heapq.heappush(heap, (priority, value))
priority, value = heapq.heappop(heap)

# 示例：Dijkstra 优先队列
# heap 元素: (距离, 节点编号)
heapq.heappush(heap, (0, start))
dist, node = heapq.heappop(heap)
```

### 4. 常见应用

```python
# Top-K 问题：求前 K 大的元素
# 用大小为 K 的最小堆
import heapq

def top_k(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap

# 合并 K 个有序链表/数组
# 每次从堆中取出最小的元素，再推入该元素所在序列的下一个
```

---

## 四、并查集（Disjoint Set Union）

### 1. 基本模板

```python
class DSU:
    def __init__(self, n):
        self.fa = list(range(n + 1))

    def find(self, x):
        # 路径压缩（递归版）
        if self.fa[x] != x:
            self.fa[x] = self.find(self.fa[x])
        return self.fa[x]

    def merge(self, a, b):
        self.fa[self.find(a)] = self.find(b)

    def connected(self, a, b):
        return self.find(a) == self.find(b)
```

### 2. 路径压缩（迭代版，避免递归爆栈）

```python
def find(self, x):
    root = x
    while root != self.fa[root]:
        root = self.fa[root]
    while x != root:
        nxt = self.fa[x]
        self.fa[x] = root
        x = nxt
    return root
```

### 3. 维护集合大小

```python
class DSU:
    def __init__(self, n):
        self.fa = list(range(n + 1))
        self.size = [1] * (n + 1)

    def find(self, x):
        if self.fa[x] != x:
            self.fa[x] = self.find(self.fa[x])
        return self.fa[x]

    def merge(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return
        # 小集合合并到大集合（按秩合并）
        if self.size[a] > self.size[b]:
            a, b = b, a
        self.fa[a] = b
        self.size[b] += self.size[a]
```

### 4. 常见应用场景

```python
# 判断图中的连通性
# Kruskal 最小生成树（配合边排序）
# 动态连通性问题

# Kruskal 最小生成树
edges.sort(key=lambda e: e[2])  # 按边权排序
dsu = DSU(n)
ans = 0
for u, v, w in edges:
    if dsu.find(u) != dsu.find(v):
        dsu.merge(u, v)
        ans += w
```

---

## 五、树状数组（Binary Indexed Tree / Fenwick Tree）

### 1. 基本模板（单点修改 + 区间求和）

```python
class BIT:
    def __init__(self, n):
        self.n = n
        self.tr = [0] * (n + 1)

    def _lowbit(self, x):
        return x & -x

    def add(self, i, delta):
        # 单点修改：a[i] += delta
        while i <= self.n:
            self.tr[i] += delta
            i += self._lowbit(i)

    def sum(self, i):
        # 前缀和：a[1] + a[2] + ... + a[i]
        s = 0
        while i > 0:
            s += self.tr[i]
            i -= self._lowbit(i)
        return s

    def range_sum(self, l, r):
        # 区间和
        return self.sum(r) - self.sum(l - 1)
```

### 2. 常见应用

```python
# 求逆序对数量
def count_inversions(a):
    # 离散化
    sorted_vals = sorted(set(a))
    rank = {v: i + 1 for i, v in enumerate(sorted_vals)}

    bit = BIT(len(sorted_vals))
    ans = 0
    for x in reversed(a):
        r = rank[x]
        ans += bit.sum(r - 1)  # 比当前小的数有几个
        bit.add(r, 1)
    return ans
```

---

## 六、线段树（Segment Tree）

### 1. 基本模板（单点修改 + 区间求和）

```python
class SegTree:
    def __init__(self, n):
        self.n = n
        self.tr = [0] * (4 * n)

    def build(self, p, l, r, a):
        if l == r:
            self.tr[p] = a[l]
            return
        mid = (l + r) // 2
        self.build(p * 2, l, mid, a)
        self.build(p * 2 + 1, mid + 1, r, a)
        self.tr[p] = self.tr[p * 2] + self.tr[p * 2 + 1]

    def update(self, p, l, r, pos, val):
        # 单点修改：a[pos] = val
        if l == r:
            self.tr[p] = val
            return
        mid = (l + r) // 2
        if pos <= mid:
            self.update(p * 2, l, mid, pos, val)
        else:
            self.update(p * 2 + 1, mid + 1, r, pos, val)
        self.tr[p] = self.tr[p * 2] + self.tr[p * 2 + 1]

    def query(self, p, l, r, ql, qr):
        # 区间求和
        if ql <= l and r <= qr:
            return self.tr[p]
        mid = (l + r) // 2
        s = 0
        if ql <= mid:
            s += self.query(p * 2, l, mid, ql, qr)
        if qr > mid:
            s += self.query(p * 2 + 1, mid + 1, r, ql, qr)
        return s
```

### 2. 区间修改 + 懒标记（Lazy Propagation）

```python
class SegTreeLazy:
    def __init__(self, n):
        self.n = n
        self.tr = [0] * (4 * n)
        self.lazy = [0] * (4 * n)

    def _push_down(self, p, l, r):
        if self.lazy[p]:
            mid = (l + r) // 2
            self.tr[p * 2] += self.lazy[p] * (mid - l + 1)
            self.tr[p * 2 + 1] += self.lazy[p] * (r - mid)
            self.lazy[p * 2] += self.lazy[p]
            self.lazy[p * 2 + 1] += self.lazy[p]
            self.lazy[p] = 0

    def update_range(self, p, l, r, ul, ur, val):
        if ul <= l and r <= ur:
            self.tr[p] += val * (r - l + 1)
            self.lazy[p] += val
            return
        self._push_down(p, l, r)
        mid = (l + r) // 2
        if ul <= mid:
            self.update_range(p * 2, l, mid, ul, ur, val)
        if ur > mid:
            self.update_range(p * 2 + 1, mid + 1, r, ul, ur, val)
        self.tr[p] = self.tr[p * 2] + self.tr[p * 2 + 1]

    def query(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tr[p]
        self._push_down(p, l, r)
        mid = (l + r) // 2
        s = 0
        if ql <= mid:
            s += self.query(p * 2, l, mid, ql, qr)
        if qr > mid:
            s += self.query(p * 2 + 1, mid + 1, r, ql, qr)
        return s
```

---

## 七、字典树（Trie）

### 1. 字符串 Trie

```python
class Trie:
    def __init__(self):
        self.trie = {}  # 嵌套字典

    def insert(self, word):
        node = self.trie
        for c in word:
            if c not in node:
                node[c] = {}
            node = node[c]
        node['#'] = node.get('#', 0) + 1  # 结束标记 + 计数

    def query(self, word):
        node = self.trie
        for c in word:
            if c not in node:
                return 0
            node = node[c]
        return node.get('#', 0)
```

### 2. 01 Trie — 最大异或对

```python
def max_xor(nums):
    trie = {}

    def insert(x):
        node = trie
        for i in range(30, -1, -1):
            bit = (x >> i) & 1
            if bit not in node:
                node[bit] = {}
            node = node[bit]

    def query(x):
        node = trie
        res = 0
        for i in range(30, -1, -1):
            bit = (x >> i) & 1
            if (bit ^ 1) in node:
                res |= (1 << i)
                node = node[bit ^ 1]
            else:
                node = node[bit]
        return res

    ans = 0
    for x in nums:
        insert(x)
        ans = max(ans, query(x))
    return ans
```

---

## 八、哈希表（Hash Table）

### 1. 开放寻址法

```python
N = 200003  # 大于数据量的第一个质数
INF = 10 ** 10

hsh = [INF] * N

def find(x):
    t = (x % N + N) % N
    while hsh[t] != INF and hsh[t] != x:
        t += 1
        if t == N:
            t = 0
    return t  # 若 hsh[t]==INF 表示 x 不存在，否则为 x 的位置

# 插入
hsh[find(x)] = x

# 查询
exists = hsh[find(x)] != INF
```

### 2. Python 内置 set / dict（竞赛够用）

```python
# 集合
s = set()
s.add(x)
x in s

# 字典计数
from collections import Counter
cnt = Counter(arr)
cnt[x]  # x 出现的次数

# 字典映射
d = {}
d[key] = value
d.get(key, default)
```

### 3. 字符串哈希（快速判断子串是否相同）

```python
MOD = 2 ** 64
BASE = 131

def string_hash(s):
    n = len(s)
    h = [0] * (n + 1)
    p = [1] * (n + 1)
    for i in range(1, n + 1):
        h[i] = (h[i - 1] * BASE + ord(s[i - 1])) % MOD
        p[i] = p[i - 1] * BASE % MOD

    def get_hash(l, r):
        # 查询 s[l..r] 的哈希值（1-indexed）
        return (h[r] - h[l - 1] * p[r - l + 1]) % MOD

    return get_hash

# 用法
get_hash = string_hash(s)
if get_hash(l1, r1) == get_hash(l2, r2):
    print("Yes")
```

---

## 九、常用 Python 容器技巧

### 1. collections.Counter — 计数器

```python
from collections import Counter

cnt = Counter(arr)

# 某元素出现次数
cnt[x]

# 最常见的 k 个元素
cnt.most_common(k)

# 遍历
for val, freq in cnt.items():
    pass
```

### 2. collections.defaultdict — 带默认值的字典

```python
from collections import defaultdict

# 默认值为 0
d = defaultdict(int)
d[x] += 1

# 默认值为 list
d = defaultdict(list)
d[key].append(value)

# 默认值为 set
d = defaultdict(set)
d[key].add(value)
```

### 3. 嵌套列表 / 矩阵构建

```python
# 一维数组
a = [0] * n

# 二维矩阵（注意不要用 [[0]*m]*n，会共享引用）
matrix = [[0] * m for _ in range(n)]

# 三维
dp = [[[0] * k for _ in range(m)] for _ in range(n)]
```

### 4. 邻接表存图

```python
# 方式一：列表套列表
g = [[] for _ in range(n + 1)]
g[u].append((v, w))

# 方式二：defaultdict
from collections import defaultdict
g = defaultdict(list)
g[u].append((v, w))
```

---

## 十、数据结构选择速查

| 需求 | 数据结构 | 时间复杂度 |
|------|---------|-----------|
| 找左侧/右侧第一个大/小于当前元素 | 单调栈 | O(n) |
| 滑动窗口最大/最小值 | 单调队列 | O(n) |
| 动态维护最值 | 堆 / 优先队列 | 插入/弹出 O(log n) |
| 合并集合 / 判断连通性 | 并查集 | 近乎 O(1) |
| 单点修改 + 区间求和 | 树状数组 | O(log n) |
| 区间修改 + 区间求和 | 线段树（懒标记） | O(log n) |
| 字符串前缀匹配 | Trie | O(len) |
| 求最大异或对 | 01 Trie | O(n log C) |
| 快速判断子串是否相同 | 字符串哈希 | 预处理 O(n)，查询 O(1) |
| 求逆序对 | 树状数组 / 归并排序 | O(n log n) |
| 元素计数 | Counter / dict | O(1) 均摊 |
| 存稀疏图 | 邻接表 | O(V + E) |

---

## 十一、常见坑与注意事项

| 坑点 | 说明 |
|------|------|
| 递归爆栈 | 并查集递归版可能爆栈，大数据量用迭代版或 `sys.setrecursionlimit(10**6)` |
| 线段树数组大小 | 至少开 `4 * n`，否则越界 |
| `[[]] * n` 共享引用 | 二维数组必须用列表推导式创建 |
| 堆是最小堆 | 需要「最大堆」时取负数插入 |
| 树状数组下标从 1 开始 | 输入数据如果是 0-indexed 需要加 1 |
| 字符串哈希冲突 | 用 131 / 13331 进制 + `2^64` 取模，冲突概率极低 |
| 并查集按秩合并 | 配合路径压缩效果最好，近乎 O(1) |
| `defaultdict` 避免 KeyError | 访问不存在的 key 不报错，自动创建默认值 |