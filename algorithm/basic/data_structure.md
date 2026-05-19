---
outline: [2, 4]   # 当前页面显示 h2~h4
---

## 栈

### 模拟栈
实现一个栈，支持以下四种基本操作：
1. push x– 将元素 x 压入栈顶。
2. pop– 弹出栈顶元素。
3. empty– 判断栈是否为空。
4. query– 查询栈顶元素的值。

```python
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def query(self) -> int:
        return self.items[-1]

    def pop(self) -> None:
        return self.items.pop()

    def is_empty(self) -> bool:
        return len(self.items) == 0

def main():
    n = int(input())
    stack = Stack()
    for i in range(n):
        command = input().split()
        if command[0] == "query":
            print(stack.query())
        elif command[0] == "push":
            stack.push(int(command[1]))
        elif command[0] == "pop":
            stack.pop()
        elif command[0] == "empty":
            print("YES" if stack.is_empty() else "NO")
        else:
            pass

if __name__ == "__main__":
    main()
```


## 单调栈

### 单调栈
给定一个数组，对每个元素x，找出其左侧第一个比它小的数。如果不存在，则输出 -1。

使用一个**单调栈**（在本题中，栈内元素从底到顶**单调递增**）。
```python
def main():
    n = int(input())
    nums = list(map(int, input().split()))

    stack = []
    for x in nums:
        while stack and stack[-1] >= x:
            stack.pop()
        if not stack:
            print(-1, end=" ")
        else:
            print(stack[-1], end=" ")
        stack.append(x)

if __name__ == "__main__":
    main()
```

## 单调队列
### 滑动窗口
给定一个长度为n的数组和一个大小为k的窗口。窗口从数组的最左侧依次向右滑动一格，直到最右侧。
分别输出在每个窗口位置时，窗口内的**最小值**和**最大值**。

使用一个双端队列（deque）来维护一个具有“单调性”和“时效性”的候选序列。

1. **维护窗口：**遍历数组，首先检查队头元素的**索引**是否已滑出当前窗口 (i - k)。如果是，则从队头出队。
2. **维护单调性：**从队尾开始，将所有**值**大于等于当前元素a[i]的元素全部出队。这保证了队列中元素值的单调递增。
3. **入队：**将当前元素的**索引**i从队尾入队。
```python
import collections
import sys


def main():
    input = sys.stdin.readline
    n, k = map(int, input().split())

    deque = collections.deque()
    a = list(map(int, input().split()))
    for i in range(len(a)):
        while deque and i - deque[0] >= k:
            deque.popleft()
        while deque and a[deque[-1]] >= a[i]:
            deque.pop()
        deque.append(i)
        if i >= k - 1:
            print(a[deque[0]], end=" ")

    print()
    deque.clear()
    for i in range(len(a)):
        while deque and i - deque[0] >= k:
            deque.popleft()
        while deque and a[deque[-1]] <= a[i]:
            deque.pop()
        deque.append(i)
        if i >= k - 1:
            print(a[deque[0]], end=" ")

if __name__ == "__main__":
    main()
```

## 队列

### 模拟队列
实现一个队列，支持以下四种操作：
1. push x：将元素x加入队尾。
2. pop：将队头元素弹出。
3. empty：判断队列是否为空。
4. query：查询队头元素的值。
```python
class Queue:
    def __init__(self, n: int):
        self.items = [0] * n
        self.lpos = 0
        self.rpos = 0

    def push(self, item: int):
        self.items[self.rpos] = item
        self.rpos += 1

    def pop(self):
        self.lpos += 1

    def query(self) -> int:
        return self.items[self.lpos]

    def is_empty(self) -> bool:
        return self.lpos == self.rpos

def main():
    n = int(input())
    que = Queue(n)
    for _ in range(n):
        command = input().split()
        if command[0] == "push":
            que.push(int(command[1]))
        elif command[0] == "pop":
            que.pop()
        elif command[0] == "query":
            print(que.query())
        elif command[0] == "empty":
            print("YES" if que.is_empty() else "NO")
        else:
            pass

if __name__ == "__main__":
    main()
```
## Trie

### Trie字符串统计
维护一个字符串集合，支持两种操作：
1. I s：插入一个字符串s。
2. Q s：查询字符串s出现了多少次。

**数据结构**：使用**Trie树**。树的每条边代表一个字符，从根到一个节点的路径构成一个字符串前缀。
插入：顺着字符往下走，没节点就新建，走到字符串末尾时计数 +1。
查询：顺着字符往下找，中途找不到就返 0，顺利走到末尾就返计数值。
```python
N = 100005
tot = 0

def main():
    n = int(input())

    trie = [[0] * 26]
    cnt = [0]

    def _insert(ss: str):
        global tot
        p = 0
        for c in ss:
            ch: int = ord(c) - ord('a')
            if trie[p][ch] == 0:
                trie.append([0] * 26)
                cnt.append(0)
                tot += 1
                trie[p][ch] = tot
            p = trie[p][ch]

        cnt[p] += 1

    def _query(ss: str) -> int:
        p = 0
        for c in ss:
            ch: int = ord(c) - ord('a')
            p = trie[p][ch]
            if p == 0:
                return 0
        return cnt[p]

    for _ in range(n):
        command, ss = input().split()
        if command == "Q":
            print(_query(ss))
        elif command == "I":
            _insert(ss)

if __name__ == "__main__":
    main()
```
### 最大异或对
给定 N 个非负整数，从这些数中找出两个数，使它们的**异或（XOR）值**最大。
**输入：** 包含 N 个非负整数的数组。  
**输出：** 最大的异或值。

**贪心策略** 要使异或和a ^ b最大，需要其二进制表示下的高位（Most Significant Bit）尽可能为 1。
**Trie 查询：**遍历数组中的每个数x。对于x的每一位（从高到低），在 Trie 中贪心寻找与之**相反**的位。
```python
tot = 0
def main():

    trie = [[0] * 32]

    def _insert(x: int) -> None:
        global tot
        p = 0
        for i in range(31, -1, -1):
            j = x >> i & 1
            if trie[p][j] == 0:
                trie.append([0] * 32)
                tot += 1
                trie[p][j] = tot
            p = trie[p][j]

    def _query(x: int) -> int:
        res = 0
        p = 0
        for i in range(31, -1, -1):
            j = x >> i & 1
            if trie[p][j ^ 1] != 0:
                res |= 1 << i
                p = trie[p][j ^ 1]
            else:
                p = trie[p][j]

        return res

    n = int(input())
    ans = 0
    for x in list(map(int, input().split())):
        _insert(x)
        ans = max(ans, _query(x))

    print(ans)

if __name__ == "__main__":
    main()
```

## 并查集

### 合并集合
有n个元素，每个元素各自属于一个独立的集合。
支持m次以下两种操作：
1. M a b：合并元素a和b所在的两个集合。
2. Q a b：询问元素a和b是否属于同一个集合。

```python
def main():
    n, m = map(int, input().split())

    fa = [i for i in range(n + 1)]

    """
        def _find(x: int) -> int:
            if x == fa[x]:
                return x
            fa[x] = _find(fa[x])
            return fa[x]
    """
    # （迭代，永不爆栈）
    def _find(x: int) -> int:
        root = x
        while root != fa[root]:
            root = fa[root]
        while x != root:
            nxt = fa[x]
            fa[x] = root
            x = nxt
        return root

    for _ in range(m):
        command = input().split()
        a = _find(int(command[1]))
        b = _find(int(command[2]))
        if command[0] == 'M':
            if a == b:
                continue
            fa[a] = b
        elif command[0] == 'Q':
            print("Yes" if a == b else "No")

if __name__ == "__main__":
    main()
```

### 连通块中点的数量
维护一个数据结构，支持以下三种操作：
1. C a b：连接点a和点b。
2. Q1 a b：查询点a和点b是否连通。
3. Q2 a：查询点a所在连通块中点的数量

使用并查集（Disjoint Set Union）算法，并额外维护每个集合的大小。
```python

def main():
    n, m = map(int, input().split())

    fa = [i for i in range(n + 1)]
    cnt = [1] * (n + 1)
    cnt[0] = 0

    def _find(x: int) -> int:
        root = x
        while root != fa[root]:
            root = fa[root]
        while x != root:
            nxt = fa[x]
            fa[x] = root
            x = nxt
        return root

    def _merge(a, b: int):
        fa[a] = b
        cnt[b] += cnt[a]

    for _ in  range(m):
        command = input().split()
        if command[0] == 'C':
            a = _find(int(command[1]))
            b = _find(int(command[2]))
            if a != b:
                _merge(a, b)

        elif command[0] == 'Q1':
            a = _find(int(command[1]))
            b = _find(int(command[2]))
            print("Yes" if a == b else "No")

        elif command[0] == "Q2":
            a = _find(int(command[1]))
            print(cnt[a])

if __name__ == "__main__":
    main()
```

## 哈希表

### 模拟散列表
实现一个支持以下两种操作的数据结构：
1. I x: 插入一个整数x。
2. Q x: 查询整数x是否存在。

**核心方法：拉链法 (Separate Chaining)**
1. **哈希函数 (Hash Function):**
    - 将大范围的数x映射到较小的数组下标k。
    - 公式:k = (x % N + N) % N
```python
N = 10 ** 5 + 1
INF = 10**10
def main():

    hsh = [INF] * N
    def _find(x: int) -> int:
        t = (x + N) % N
        while hsh[t] != INF and hsh[t] != x:
            t += 1
            if t == N:
                t = 0
        return t

    n = int(input())
    for _ in range(n):
        command = input().split()
        if command[0] == "I":
            x = int(command[1])
            hsh[_find(x)] = x
        elif command[0] == "Q":
            x = int(command[1])
            print("No" if hsh[_find(x)] == INF else "Yes")

if __name__ == "__main__":
    main()
```

### 字符串哈希
给定一个字符串S和多次询问。每次询问给出两个区间[l1, r1]和[l2, r2]，要求快速判断这两个区间对应的子字符串是否完全相同。

将任意子字符串映射为一个唯一的整数（哈希值），通过比较哈希值来判断子字符串是否相等。这是一种以极高概率保证正确性的随机化算法。
**步骤 (Steps)**
1. **预处理 (Preprocessing) - O(N)**
    - **定义进制:** 将字符串看作一个P进制数（P通常取质数 131 或 13331）。
    - **计算前缀哈希:** 计算字符串所有前缀S[1..i]的哈希值h[i]。
    - **计算P的幂:** 预处理P的各次幂p[i] = P^i。
2. **查询 (Query) - O(1)**
    - 利用前缀哈希和P的幂，可以计算出任意子串S[l..r]的哈希值。
    - **核心公式:** hash(l, r) = h[r] - h[l-1] * p[r-l+1]
    - **判断:** 比较hash(l1, r1)和hash(l2, r2)是否相等即可。
```python
def main():
    n, m = map(int, input().split())
    ss = input()

    MOD = 2 ** 64
    p = [1] * (n + 1)
    f = [0] * (n + 1)
    for i in range(1, n + 1):
        f[i] = (f[i - 1] * 131 + ord(ss[i - 1])) % MOD
        p[i] = p[i - 1] * 131 % MOD

    def _get(l, r: int) -> int:
        return (f[r] - f[l -1] * p[r - l + 1]) % MOD

    for _ in range(m):
        l1,r1,l2,r2 = map(int, input().split())
        print(
            "Yes" if _get(l1,r1) == _get(l2,r2) else "No"
        )

if __name__ == "__main__":
    main()
```