---
outline: [2, 4]   # 当前页面显示 h2~h4
---

## DFS

### 排列数字
给定一个正整数n，请按照**字典序**输出从 1 到n这n个整数的所有排列。

1. **核心思想**：  
   按顺序（第 1 位, 第 2 位, ..., 第 n 位）枚举每一位上可能放的数字。
2. **DFS 函数设计dfs(u)**：  
   表示当前正在确定第u个位置应该放哪个数字。
```python
def main():
    n = int(input())
    nums = [0] * n
    vis =[False] * n

    def _dfs(d: int):
        if d == n:
            print(*nums)
        for i in range(n):
            if vis[i]:
                continue
            nums[d] = i + 1
            vis[i] = True
            _dfs(d + 1)
            vis[i] = False

    _dfs(0)
if __name__ == "__main__":
    main()
```

### n-皇后问题
在一个n x n的棋盘上放置n个皇后，要求任意两个皇后都不能处于**同一行**、**同一列**或**同一条对角线**上。
输出所有合法的棋盘布局方案。


**题解思路:** **深度优先搜索 (DFS) + 回溯**
1. **搜索顺序:**  
   按**行**进行搜索。从第 0 行到第 n-1 行，依次决定每一行皇后的摆放位置（在哪一列）。

**关键优化 (如何快速判断合法性):**
- **列:**使用布尔数组col[n]记录某一列是否被占用。
- **副对角线 (右上到左下):**同一条线上的点(x, y)，x + y的值相等。用布尔数组dg[2n]记录。
- **主对角线 (左上到右下):**同一条线上的点(x, y)，y - x的值相等。为防止负数下标，加上偏移量n。用布尔数组udg[2n]记录y - x + n。
```python
def main():
    n = int(input())

    grid = [['.'] * n for _ in range(n)]

    col = [False] * n
    sta1 = [False] * (2 * n)
    sta2 = [False] * (2 * n)

    def _dfs(d: int):
        if d == n:
            for i in range(n):
                print(''.join(grid[i]))
            print()
            return
        for i in range(n):
            if col[i] or sta1[d + i] or sta2[d - i + n]:
                continue
            col[i] = sta1[d + i] = sta2[d - i + n] = True
            grid[d][i] = 'Q'
            _dfs(d + 1)
            grid[d][i] = '.'
            col[i] = sta1[d + i] = sta2[d - i + n] = False

    _dfs(0)
if __name__ == "__main__":
    main()

```

## BFS
### 走迷宫
- **输入:** 一个 N x M 的 01 矩阵，0 代表通路，1 代表障碍。
- **目标:** 求从左上角(1, 1)走到右下角(N, M)的最短路径长度。
- **移动:** 每次只能走到上、下、左、右四个相邻的格子。


- **核心算法:** **广度优先搜索 (BFS)**。
- **原因:**在所有边的权重都为 1 的图中（即每次移动算一步），BFS 能够保证第一次搜索到终点时，所经过的路径就是最短路径。

```python
import collections

def bfs(n, m: int, g: list[list[int]]):
    deque = collections.deque()
    deque.append((0, 0, 0))
    dx = [0, 0, 1, -1]
    dy = [1, -1, 0, 0]
    vis = [[False] * m for _ in range(n)]
    while len(deque) > 0:
        x, y, dis = deque.popleft()
        if vis[x][y]:
            continue
        vis[x][y] = True
        if x == n - 1 and y == m - 1:
            return dis
        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]
            if 0 <= nx < n and 0 <= ny < m and g[nx][ny] != 1:
                deque.append((nx, ny, dis + 1))

    return -1


def main():
    n, m = map(int, input().split())
    g = [list(map(int, input().split())) for _ in range(n)]
    print(bfs(n, m, g))

if __name__ == "__main__":
    main()
```

## 树与图的深度优先遍历

### 树的重心
在一棵树中，删除某个节点后，树会分裂成若干个连通块（子树）。
**重心** 是指这样一个节点：删除它之后，所形成的最大连通块的节点数最小。
**目标：** 求解这个最大连通块节点数的最小值。

**题解思路：** **DFS (深度优先搜索)**
1. **一次遍历：** 从任意节点（如1）开始，对整棵树进行一次DFS。
2. **计算子树大小：** 在DFS的回溯（后序）过程中，可以计算出以当前节点u为根的子树大小，记为size[u]。

**计算最大连通块：** 对于节点u，删除它后产生的连通块包括：
- 它的各个子节点v所在的子树，大小为size[v]。
- 它的父节点方向的连通块，大小为n - size[u]。
- 因此，删除u后的最大连通块大小为max(size[v1], size[v2], ..., n - size[u])。
```python
ans = 10 ** 10
def main():
    n = int(input())
    g = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        a,b = map(int,input().split())
        g[a].append(b)
        g[b].append(a)

    def dfs(x, fa: int) -> int:
        global ans
        size, sums = 0, 0
        for y in g[x]:
            if y == fa:
                continue
            s = dfs(y, x)
            size = max(size, s)
            sums += s

        size = max(size, n - 1 - sums)
        ans = min(ans, size)
        return sums + 1
    dfs(1, 0)
    print(ans)
if __name__ == "__main__":
    main()
```

## 树与图的广度优先遍历
### 图中点的层次
在一个n个点m条边的有向图中，求从**1 号点**走到**n 号点**的**最短距离**（即最少经过几条边）。

**核心算法:**广度优先搜索 (BFS)
思路简介:
题目本质是在**无权图**中求**单源最短路径**，这是 BFS 的经典应用。BFS 按层次遍历图，能保证第一次到达某个节点时，所经过的路径一定是边数最少的。
```python
import collections

def bfs(n:int, g: list[list[int]]) -> int:
    dis = [-1] * (n + 1)
    dis[1] = 0
    deque = collections.deque()
    deque.append(1)
    while len(deque) > 0:
        x = deque.popleft()
        for y in g[x]:
            if dis[y] == -1:
                dis[y] = dis[x] + 1
                deque.append(y)

    return dis[n]

def main():
    n, m = map(int, input().split())

    g = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        g[a].append(b)

    print(bfs(n, g))

if __name__ == "__main__":
    main()
```