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

## 拓扑排序

### 拓扑排序
给定一个n个点m条边的有向无环图 (DAG)，请求出该图的一个拓扑序列。
- **输入:** 点数 n, 边数 m, 以及 m 条有向边 (x, y)。
- **输出:** 一个长度为 n 的整数序列，表示一个合法的拓扑排序结果。
  (拓扑序列：图中顶点的一种线性排序，使得对于任何从 u 到 v 的有向边，u 总是在 v 之前。)

不断将**入度为 0**的点加入队列并输出，然后“删除”其所有出边（即将其指向的邻接点入度减一）。
```python
import collections


def main():
    n,m = map(int, input().split())

    g = [[] for _ in range(n + 1)]
    deg = [0] * (n +  1)
    for _ in range(m):
        a, b = map(int, input().split())
        g[a].append(b)
        deg[b] += 1


    def _topo():
        deque = collections.deque()
        for i in range(1, n + 1):
            if deg[i] == 0:
                deque.append(i)

        res = []
        while len(deque) > 0:
            x = deque.popleft()
            res.append(x)
            for y in g[x]:
                deg[y] -= 1
                if deg[y] == 0:
                    deque.append(y)

        if len(res) != n:
            print(-1)
        else:
            print(*res)
    _topo()

if __name__ == "__main__":
    main()
```

## Dijkstra

### Dijkstra求最短路 I
给定一个n个点m条边的**正权有向图**，求从 1 号点到n号点的最短距离。
**输入:**
- 点数n, 边数m
- m条边x, y, z(表示从x到y有一条权重为z的边)

朴素 Dijkstra 算法**
**核心思想:**  
一个基于贪心策略的算法。每次从未被确定最短路径的点中，选择一个距离源点最近的点，并将其“确定”下来，然后用这个点去更新它所有邻居的距离。
```python

INF = 10 ** 10

def main():
    n,m = map(int, input().split())

    g = [[INF] * (n + 1) for _ in range(n + 1)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        g[a][b] = min(g[a][b],c)

    dis = [INF] * (n + 1)
    def _dijkstra(st: int) -> None:
        dis[st] = 0
        vis = [False] * (n + 1)
        for _ in range(n):
            t: int = -1
            for j in range(1,n + 1):
                if not vis[j] and (t == -1 or dis[t] > dis[j]):
                    t = j
            vis[t] = True
            for j in range(1, n + 1):
                dis[j] = min(dis[j], dis[t] + g[t][j])

    _dijkstra(1)
    print(-1 if dis[n] == INF else dis[n])


if __name__ == "__main__":
    main()
```

### Dijkstra求最短路 II
在一个包含n个点、m条边的**正权有向图**中，求源点1到其余所有点的最短路径。

这是一个**稀疏图**问题，n和m的数据范围很大（例如达到1.5 × 10^5），朴素的O(n²)Dijkstra算法会超时。
**核心算法：**使用**优先队列（小根堆）**优化的Dijkstra算法。

```python
import heapq


def main():
    n,m = map(int, input().split())

    graph = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        graph[a].append((b,c))


    INF = float('inf')
    dis = [INF] * (n + 1)
    def _dijkstra(st: int) -> None:
        dis[st] = 0
        heap = [(0, 1)]
        vis = [False] * (n + 1)
        while heap:
            d, x = heapq.heappop(heap)
            if vis[x]:
                continue
            vis[x] = True
            for y, z in graph[x]:
                if dis[y] > dis[x] + z:
                    dis[y] = dis[x] + z
                    heapq.heappush(heap, (dis[y], y))

    _dijkstra(1)
c


if __name__ == "__main__":
    main()
```

## bellman-ford

### 有边数限制的最短路
在一个包含n个点m条边的有向图中，求从起点1到终点n，**最多**经过k条边的最短距离。

Bellman-Ford 算法的循环松弛操作天然地符合边数限制。第i轮迭代更新后，dist[x]的值代表了从起点到x最多经过i条边的最短路。因此，我们只需执行k轮迭代。
**关键步骤：**
1. **初始化：** dist数组，dist[起点] = 0，其余为无穷大。
2. **迭代k次：** for循环k次。
3. **备份：** 在每次迭代开始时，复制dist数组到backup数组。
4. **松弛：** 遍历所有m条边(a, b, w)，使用backup数组的值进行松弛操作：  
   dist[b] = min(dist[b], backup[a] + w)  
   (使用backup是为了防止在同一次迭代中发生“串联”更新，从而严格保证路径长度不超过当前迭代次数)
5. **结果：** k次迭代后，dist[终点]即为答案。若值仍为无穷大，则表示不可达。
```python
import copy
INF = 10**10

def main():
    n, m, k = map(int, input().split())
    edges = []
    for _ in range(m):
        x, y, z = map(int,input().split())
        edges.append((x, y, z))

    dis = [INF] * (n + 1)
    dis[1] = 0
    def _bellmanford(k: int):

        for _ in range(k):
            last = copy.deepcopy(dis)
            for j in range(m):
                x, y, z = edges[j]
                dis[y] = min(dis[y], last[x] + z)

    _bellmanford(k)
    if dis[n] > INF//2:
        print("impossible")
    else:
        print(dis[n])

if __name__ == "__main__":
    main()
```

## bellman-ford

### spfa求最短路
给定一个n个点m条边的**有向图**，图中可能包含**负权边**。
求从 1 号点到n号点的最短距离。如果无法从 1 到达n，则输出 "impossible"。

基于 Bellman-Ford 的队列优化。只将那些距离被成功“松弛”（变小）的顶点加入队列，因为只有它们才可能去更新其它顶点的距离。
```python
import collections

INF = 10 ** 10

def main():
    n,m = map(int, input().split())

    graph = [[] for _ in range(n + 1)]

    for _ in range(m):
        a,b,c = map(int, input().split())
        graph[a].append((b,c))

    dis = [INF] * (n + 1)

    def _spfa(st: int):
        sta = [False] * (n + 1)
        deque = collections.deque()
        deque.append(st)
        dis[st] = 0
        while len(deque) > 0:
            x = deque.popleft()
            sta[x] = False
            for y,z in graph[x]:
                if dis[y] > dis[x] + z:
                    dis[y] = dis[x] + z
                    if not sta[y]:
                        sta[y] = True
                        deque.append(y)

    _spfa(1)
    if dis[n] == INF:
        print("impossible")
    else:
        print(dis[n])

if __name__ == "__main__":
    main()
```

### spfa判断负环
给定一个包含**负权边**的有向图，判断图中是否存在**负环**。
(负环：一个边权之和为负数的环路)
**输入:** n个点,m条边的有向图。  
**输出:** Yes(存在负环) 或No(不存在负环)。

在一个含有n个节点的图中，任何不含环的简单路径最多只包含n-1条边。如果从源点到某个节点x的最短路径包含了n条或更多的边，那么这条路径上必然有重复的节点，即构成了环。由于SPFA总是在寻找更短的路径，这必然是一个**负环**。

1. **额外数组:** 使用cnt[]数组记录每个点到源点（虚拟源点）的最短路径所包含的边数。
2. **初始化:**将**所有节点**(1 to n) 加入队列。这是为了防止图不连通，确保能检测到所有可能的负环。
3. **SPFA松弛:**
    - 当更新dist[j] = dist[t] + w时，也更新边数cnt[j] = cnt[t] + 1。
4. **判断负环:**
    - 在每次更新cnt[j]后，立刻检查if (cnt[j] >= n)。
    - 如果条件成立，说明找到了一个包含至少n条边的路径，图中必定存在负环，返回Yes。
5. **正常结束:** 如果队列为空算法仍未返回，说明不存在负环，返回No。
```python
import collections

INF = 10 ** 10
def main():
    n,m = map(int,input().split())

    graph = [[] for _ in range(n + 1)]
    for _ in range(m):
        a,b,c = map(int,input().split())
        graph[a].append((b,c))

    for i in range(1, n + 1):
        graph[0].append((i, 0))

    dis = [INF] * (n + 1)
    def _spfa(st: int) -> str:
        dis[st] = 0
        cnt = [0] * (n + 1)
        sta = [False] * (n + 1)
        deque = collections.deque()
        deque.append(st)
        while len(deque) > 0:
            x = deque.popleft()
            sta[x] = False

            for y,z in graph[x]:
                if dis[y] > dis[x] + z:
                    dis[y] = dis[x] + z
                    cnt[y] = cnt[x] + 1
                    if cnt[y] > n:
                        return "Yes"
                    if not sta[y]:
                        deque.append(y)
        return "No"


    print(_spfa(0))
if __name__ == "__main__":
    main()
```

## Floyd

### Floyd求最短路
给定一个包含 n 个点和 m 条边的**有向图**。  
接下来有 k 次查询，每次查询给定两个顶点 x 和 y，求从 x 到 y 的**最短路径长度**。
如果路径不存在，则输出 "impossible"。

动态规划。d\[i]\[j]表示从i到j的最短路径。算法通过枚举一个**中间点 k**，尝试用i -> k -> j这条路径来更新i到j的最短距离。

**状态转移方程：** d\[i]\[j] = min(d\[i]\[j], d\[i]\[k] + d\[k]\[j])

**步骤：**
1. **初始化邻接矩阵d：**
   - d\[i]\[i] = 0
   - 若存在i到j的边，权重为w，则d\[i]\[j] = w
   - 其他情况d\[i]\[j] = ∞(设为一个极大值，如0x3f3f3f3f)
```python
INF = 10**10

def main():
    n,m,q = map(int,input().split())
    dis = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dis[i][i] = 0

    for _ in range(m):
        a,b,c = map(int, input().split())
        dis[a][b] = min(dis[a][b],c)

    for k in range(1,n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                dis[i][j] = min(dis[i][j],dis[i][k] + dis[k][j])

    for _ in range(q):
        x, y = map(int, input().split())
        if dis[x][y] >= INF // 2:
            print("impossible")
        else:
            print(dis[x][y])


if __name__ == "__main__":
    main()
```

## Prim

### Prim算法求最小生成树
- 给定一个 n 个点 m 条边的带权无向图。
- 求该图的最小生成树（MST）的权重和。
- 如果图不连通，无法构成生成树，则输出 "impossible"。

贪心。从一个起点开始，每次选择一个离「已选点的集合」最近的「未选点」加入生成树，直到所有点都被选中。
```python
INF = 10 ** 10
def main():
    n, m = map(int, input().split())
    g = [[INF] * (n + 1) for _ in range(n + 1)]
    for _ in range(m):
        x,y,z = map(int, input().split())
        g[x][y] = g[y][x] = min(g[x][y], z)

    def _prime():
        dis = [INF] * (n + 1)
        vis = [False] * (n + 1)
        res = 0
        for i in range(n):
            t = -1
            for j in range(1, n + 1):
                if not vis[j] and (t == -1 or dis[t] > dis[j]):
                    t = j

            if i > 0 and dis[t] == INF:
                return INF

            if i > 0:
                res += dis[t]
            vis[t] = True

            for j in range(1, n + 1):
                dis[j] = min(dis[j], g[t][j])

        return res

    res = _prime()

    if res == INF:
        print("impossible")
    else:
        print(res)
if __name__ == "__main__":
    main()
```