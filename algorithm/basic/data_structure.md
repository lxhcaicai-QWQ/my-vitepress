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