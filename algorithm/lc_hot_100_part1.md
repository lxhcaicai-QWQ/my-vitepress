---
outline: [2, 4]   # 当前页面显示 h2~h4
---

## lc236. 给定一棵二叉树和两个节点 p、q，如何找到它们的最近公共祖先（LCA）？
1. 递归法‌:
- 从根节点开始遍历
- 如果当前节点是p或q，返回当前节点
- 递归查找左右子树
- 如果左右子树都找到节点，当前节点就是LCA
- 如果只有一边找到，返回找到的那边

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        def _dfs(root, p, q):
            if not root or root == p or root == q:
                return root
            left = _dfs(root.left, p,q)
            right = _dfs(root.right, p,q)

            if left and right:
                return root
            return left if left else right
        return _dfs(root, p, q)
```

## lc234.判断一个单链表是否为回文链表（时间复杂度 O(n)，空间复杂度 O(1)）。

1. ‌快慢指针法‌：
2. ‌栈方法‌：
3. 递归(自己想的，类似字符串hash)：

```python
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        stack = []
        def solve(head: Optional[ListNode]):
            p = head
            while p:
                stack.append(p.val)
                p = p.next
        solve(head)
        p = head
        while p:
            x = stack.pop()
            if x != p.val:
                return False
            p = p.next
        return True
        
```

## lc739. 给定一个整数数组 temperatures 表示每日温度，返回数组 answer 其中 answer[i] 是第 i 天后需要等待多少天才能遇到更温暖的温度。若没有则为 0。
核心解法：单调递减栈
1. 初始化：栈（保存索引），结果数组全初始化为 0
2. 遍历数组：比较当前温度与栈顶元素对应的温度
3. 维护单调性：
 - 若当前温度 > 栈顶日温度 → 弹出栈顶，计算天数差（当前索引 - 弹出索引）
 - 重复直到栈顶温度 ≥ 当前温度或栈空
```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        stack = []
        res = [0] * len(temperatures)
        for i in range(len(temperatures)):
            while stack and temperatures[i] > temperatures[stack[-1]]:
                x = stack.pop()
                res[x] = i - x
            stack.append(i)
        return res
```

## lc226. 翻转一棵二叉树。
1. ‌递归法‌：交换左右子树，然后递归翻转左右子树
2. ‌迭代法‌：使用栈或队列进行层序遍历，交换每个节点的左右子树
```python
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        def _dfs(root: Optional[TreeNode]) -> Optional[TreeNode]:
            if not root:
                return None
            left = _dfs(root.left)
            right = _dfs(root.right)
            root.left = right
            root.right = left
            return root
        return _dfs(root)
```

## lc221. 在由 '0' 和 '1' 组成的二维矩阵中，找到仅包含 '1' 的最大正方形的面积。
关键解法：动态规划
1. 状态定义
   dp[i][j] 表示以 (i, j) 为右下角的最大正方形的边长。
2. 转移方程
   ○ 若 matrix[i][j] == '1'：
   dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
   ○ 否则：dp[i][j] = 0
   解释：正方形需要左、上、左上三个方向同时支持，取最小值保证所有方向均满足条件。
3. 初始化
   ○ dp 数组初始化为全 0。
   ○ 边界处理：当 i == 0 或 j == 0 时，若当前值为 '1'，则 dp[i][j] = 1。
4. 记录最大值
   遍历过程中维护 max_side（最大边长），最终返回 max_side。

```python
class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        n = len(matrix)
        m = len(matrix[0])
        dp = [[0] * (m + 1) for _ in range(n)]
        max_side = 0
        for i in range(n):
            for j in range(m):
                if matrix[i][j] == '1':
                    if i == 0 or j == 0:
                        dp[i][j] = 1
                    else:
                        dp[i][j] = min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]) + 1
                    max_side = max(max_side, dp[i][j])


        return max_side * max_side
```
## lc215. 在未排序的数组中找到第 k 个最大的元素。
● 基于快速排序的分治思想，每次分区后根据pivot位置判断目标在左/右子数组。
● 优化：随机选择pivot避免最坏情况（O(n²) → 平均O(n)）。
● 关键步骤：
a. 随机选pivot，将数组分为 >pivot、=pivot、<pivot 三部分。
b. 若右半部分长度≥k，则在右半部分继续查找。
c. 否则在左半部分查找，调整k值。
方法2：最小堆（Min-Heap）

维护大小为k的最小堆，堆顶即为第k大元素。

```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        def _find_k(nums: List[int], l, r, k: int) -> int:
            if l >= r:
                return nums[l]
            mid = nums[(l + r) // 2]
            i = l - 1
            j = r + 1
            while i < j:
                while True:
                    i += 1
                    if nums[i] >= mid:
                        break

                while True:
                    j -= 1
                    if nums[j] <= mid:
                        break
                if i < j:
                    nums[i], nums[j] = nums[j], nums[i]

            if j - l + 1 >= k:
                return _find_k(nums, l, j, k)
            else:
                return _find_k(nums, j + 1, r, k - (j - l + 1))

        n = len(nums)
        return _find_k(nums, 0, n - 1, n - k + 1)
```

## lc208. 实现包含以下功能的Trie（前缀树）：
实现包含以下功能的Trie（前缀树）：
1. void insert(String word)
2. boolean search(String word)
3. boolean startsWith(String prefix)

方法逻辑：
1. 插入
   ○ 遍历单词字符，逐层创建缺失的节点
   ○ 最后一个字符的节点标记isEnd = true
2. 搜索
   ○ 遍历单词字符，若中间缺失节点则返回false
   ○ 检查最后一个节点的isEnd标记
3. 前缀匹配
   ○ 仅需遍历前缀字符，中间无缺失节点即返回true
```python
class Trie:

    def __init__(self):
        self.trie = [[0] * 26]
        self.tot = 0
        self.end = [False]

    def insert(self, word: str) -> None:
        p = 0
        for c in word:
            ch :int = ord(c) - ord('a')
            if self.trie[p][ch] == 0:
                self.trie.append([0] * 26)
                self.tot += 1
                self.trie[p][ch] = self.tot
                self.end.append(False)
            p = self.trie[p][ch]
        self.end[p] = True
        

    def search(self, word: str) -> bool:
        p = 0
        for c in word:
            ch :int = ord(c) - ord('a')
            p = self.trie[p][ch]
            if p == 0:
                return False
        return self.end[p]


    def startsWith(self, prefix: str) -> bool:
        p = 0
        for c in prefix:
            ch :int = ord(c) - ord('a')
            p = self.trie[p][ch]
            if p == 0:
                return False
        return True
```