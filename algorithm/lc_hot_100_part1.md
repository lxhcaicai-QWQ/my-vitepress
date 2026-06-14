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


## lc207. 给定课程总量 numCourses 和先修课程要求数组 prerequisites，判断是否能完成所有课程（即图中无环）。
解题思路（拓扑排序）
关键步骤：
1. 构建邻接表：记录每个节点的后续课程
2. 入度数组：统计每个节点的前置条件数量
3. BFS初始化：将入度为0的节点加入队列
4. 遍历节点：
   ○ 取出节点，减少相邻节点的入度
   ○ 若相邻节点入度变为0，加入队列
5. 结果判断：已访问节点数 == 总节点数 → 无环
```python
import collections

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        deg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            deg[a] += 1
        deque = collections.deque()
        for i in range(numCourses):
            if deg[i] == 0:
                deque.append(i)
        cnt = 0
        while len(deque) > 0:
            x = deque.popleft()
            cnt += 1
            for y in graph[x]:
                deg[y] -= 1
                if deg[y] == 0:
                    deque.append(y)
        return cnt == numCourses

```

## lc206. 反转一个单链表
1. ‌迭代法‌：使用三个指针(prev, curr, next)逐个反转节点指向
2. ‌递归法‌：递归到链表末端，然后逐层反转节点指向

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        master = ListNode(0)
        while head:
            p = head
            head = head.next
            p.next = master.next
            master.next = p
        return master.next
```

## lc200. 给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，计算岛屿数量。  岛屿通过水平或垂直连接相邻陆地形成。
解题思路（DFS/BFS）
核心逻辑：
1. 遍历网格：遇到'1'时启动搜索
2. 标记已访问：将访问过的陆地改为'0'（避免重复计数）
3. 四方向扩散：递归/队列处理上下左右相邻节点

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        n = len(grid)
        m = len(grid[0])

        def _dfs(x, y: int, grid: List[List[str]]):
            if x < 0 or x >= n or y < 0 or y >= m or grid[x][y] == '0':
                return
            grid[x][y] = '0'
            _dfs(x, y + 1, grid)
            _dfs(x + 1, y, grid)
            _dfs(x- 1, y, grid)
            _dfs(x, y - 1, grid)

        ans = 0
        for i in range(n):
            for j in range(m):
                if grid[i][j] == '1':
                    _dfs(i, j, grid)
                    ans += 1

        return ans
```

## lc198. 给定一个非负整数数组 nums，表示每个房屋存放的金额。不能同时偷相邻两间房屋，求能偷窃的最高金额。
解题思路（动态规划）
状态定义：
● f[i][0]：不偷第i个房屋时的最高金额
● f[i][1]：偷到第i个房屋时的最高金额
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [[0,0] for _ in range(n + 2)]
        for i in range(1, n + 1):
            dp[i][0] = max(dp[i - 1][0], dp[i - 1][1])
            dp[i][1] = dp[i - 1][0] + nums[i - 1]
        return max(dp[n][0], dp[n][1])
```

## lc169. 给定一个大小为 n 的数组，找到其中的多数元素。多数元素指出现次数 大于 ⌊n/2⌋ 的元素（假设数组非空且总存在多数元素）
解题思路（摩尔投票法）
核心逻辑：
1. 候选人+计数器：
   ○ 遍历数组，若计数器为0，设当前元素为候选人
   ○ 当前元素等于候选人时计数器+1，否则-1
2. 数学保证：由于多数元素数量过半，最终候选人必为结果


```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        now = nums[0]
        res = 1
        for i in range(1, len(nums)):
            if now == nums[i]:
                res += 1
            else:
                res -= 1
                if res < 0:
                    res = 1
                    now = nums[i]
        return now
```

lc238. - 给定整数数组 nums，返回数组 answer，使得 answer[i] 等于 nums 中除 nums[i] 外所有元素的乘积。

解题思路（双遍历）
核心逻辑：
1. 前缀乘积 → 后缀乘积 → 合并结果
   ○ 第一次遍历（左→右）：计算每个位置左侧所有元素的乘积
   ○ 第二次遍历（右→左）：计算右侧乘积，并直接乘到结果数组中

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        f = [0] * (n + 2)
        g = [0] * (n + 2)
        f[0] = 1
        g[n + 1] = 1
        for i in range(1,n + 1):
            f[i] = f[i - 1] * nums[i - 1]

        for i in range(n, 0, -1):
            g[i] = g[i + 1] * nums[i - 1]

        ans = []
        for i in range(1, n + 1):
            ans.append(f[i - 1] * g[i + 1])
        return ans
```


## lc155. 最小栈 设计一个支持 push、pop、top 操作的栈，并能在 O(1) 时间内检索到最小元素。
解题思路（双栈法）
核心设计：
1. 主栈：存储所有元素
2. 辅助栈：存储每个状态下的最小值（与主栈同步更新）
   操作逻辑：
   ● push(x)：
   ○ 主栈压入x
   ○ 辅助栈压入min(x, 辅助栈顶)（若空则直接压入x）
   ● pop()：同时弹出主栈和辅助栈顶
   ● getMin()：直接返回辅助栈顶

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, value: int) -> None:
        self.stack.append(value)
        if self.min_stack:
            res = min(value, self.min_stack[-1])
            self.min_stack.append(res)
        else:
            self.min_stack.append(value)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
```

## lc152. 给定一个整数数组 nums，找出乘积最大的连续子数组，并返回该乘积。

动态规划解法
● 需要同时记录当前最大值和最小值（因为负数乘以负数会变成正数）
● 状态转移方程：
○ maxDP[i] = max(nums[i], maxDP[i-1]*nums[i], minDP[i-1]*nums[i])
○ minDP[i] = min(nums[i], maxDP[i-1]*nums[i], minDP[i-1]*nums[i])

```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        n = len(nums)
        minf = [-1] * n
        maxf = [-1] * n
        minf[0] = maxf[0] = nums[0]
        for i in range(1, n):
            minf[i] = min(nums[i], minf[i-1] * nums[i], maxf[i-1] * nums[i])
            maxf[i] = max(nums[i], minf[i-1] * nums[i], maxf[i-1] * nums[i])

        return max(maxf)
```


## lc148. 对给定的链表头节点进行升序排序，要求时间复杂度 O(n log n)，空间复杂度 O(1)（递归栈不算入空间复杂度）。
解题思路（归并排序）
核心步骤：
1. 分治法：
   ○ 快慢指针找到链表中点，拆分成两个子链表
   ○ 递归排序左右子链表
2. 合并有序链表：
   ○ 类似合并两个有序数组，但操作指针

```python
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:

        def _quicksork(head: Optional[ListNode]) -> Optional[ListNode]:
            if not head or not head.next:
                return head
            slow = head
            fast = head.next

            while fast and fast.next:
                fast = fast.next.next
                slow = slow.next

            mid = slow.next
            slow.next = None
            list1 = _quicksork(head)
            list2 = _quicksork(mid)

            master = ListNode()
            p = master
            while list1 and list2:
                if list1.val < list2.val:
                    p.next = list1
                    list1 = list1.next
                else:
                    p.next = list2
                    list2 = list2.next
                p = p.next

            p.next = list1 if list1 else list2
            return master.next

        return _quicksork(head)
```

## lc142. 给定一个链表的头节点 head，返回链表开始入环的第一个节点。如果链表无环，返回 null。

解题思路
核心逻辑：
1. 快慢指针：
   ○ 快指针每次走2步，慢指针每次走1步
   ○ 若相遇则存在环
2. 找入口点：
   ○ 相遇后，快指针重置到链表头
   ○ 两指针均每次走1步，再次相遇点即为环入口
   数学推导
   设：
   ● 链表头到入口距离为 a
   ● 入口到相遇点距离为 b
   ● 环剩余距离为 c
   当快慢指针首次相遇时：

慢指针路程 = a + b  
快指针路程 = a + b + n(b + c)  
由快指针速度是慢指针的2倍得：  
2(a + b) = a + b + n(b + c) → a = (n-1)(b+c) + c  

```python
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return None
        fast = head
        slow = head
        while fast and fast.next:
            fast = fast.next.next
            slow = slow.next
            if fast == slow:
                p = head
                while p != fast:
                    p = p.next
                    fast = fast.next
                return p

        return None
```

## lc141. 给定一个链表的头节点 head，判断链表中是否有环。

解题思路（Floyd判圈算法）
核心逻辑：
● 快慢指针：
○ 快指针每次移动2步，慢指针每次移动1步
○ 若两指针相遇 → 存在环；若快指针走到链表尾部 → 无环

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        if not head or not head.next:
            return False
        fast = head
        slow = head
        while fast and fast.next:
            fast = fast.next.next
            slow = slow.next
            if slow == fast:
                return True

        return False
```

##  lc139. 给定一个非空字符串 s 和单词字典 wordDict，判断 s 是否能被分割为字典中的单词。

核心逻辑：
1. 状态定义：dp[i] 表示前 i 个字符（即 s[0..i-1]）能否被分割
2. 状态转移：
   dp[i] = true 当且仅当存在 j < i，使得 dp[j] == true 且 s[j..i-1] ∈ wordDict
3. 初始条件：dp[0] = true（空字符串默认可分割）

```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        n = len(s)
        work_set = set(wordDict)
        dp = [False] * (n + 1)
        dp[0] = True
        for i in range(1, n + 1):
            for j in range(0, i):
                if dp[j] and s[j:i] in work_set:
                    dp[i] = True
        return dp[n]
```


##  lc136.给定一个非空整数数组，除了某个元素只出现一次外，其余每个元素均出现两次。找出那个只出现一次的元素。  要求：时间复杂度 O(n)，空间复杂度 O(1)

解题思路（位运算）
核心逻辑：
使用异或（XOR）运算：
相同数字异或结果为 0（a ^ a = 0）
任何数与 0 异或结果为自身（b ^ 0 = b）
遍历数组：所有元素异或后，出现两次的互相抵消，仅剩单个元素

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ans = 0
        for x in nums:
            ans ^= x
        return ans
```

## lc647. 给定一个字符串 s，统计并返回字符串中回文子串的数量。不同起始或结束位置的子串（即使内容相同）被视为不同的子串。

A: 中心扩展法（最优解）：
1. 核心思想：
   遍历每个字符，以单字符（奇数长度）或双字符（偶数长度）为中心，向两侧扩展判断回文。
2. 关键步骤：
   ○ 奇数中心：以 (i, i) 为中心，向左右扩展。
   ○ 偶数中心：以 (i, i+1) 为中心，向左右扩展。
   ○ 每次成功扩展（左右字符相同），计数 +1。
3. 复杂度：
   ○ 时间复杂度：O(n²)（遍历所有中心，每个中心扩展 O(n)）。
   ○ 空间复杂度：O(1)（无需额外空间）。

```python
class Solution:
   def countSubstrings(self, s: str) -> int:
      n = len(s)
      ans = 0
      for center in range(0, n):
         left = center
         right = center
         while left >=0 and right < n and s[left] == s[right]:
            left -= 1
            right += 1
            ans += 1

         left = center
         right = center + 1
         while left >=0 and right < n and s[left] == s[right]:
            left -= 1
            right += 1
            ans += 1

      return ans
```

## lc124. 给定一棵二叉树，找出路径的最大和。

递归遍历 + 贪心策略：
1. 后序遍历框架：
   ○ 先处理左子树 → 再处理右子树 → 最后当前节点
2. 关键变量：
   ○ 全局最大路径和：记录遍历过程中出现的最大路径
   ○ 单侧最大贡献值：以当前节点为起点的向下路径最大和
3. 策略规则：
   ○ 子树贡献值若为负则舍弃（取0）
   ○ 更新全局最大值：当前节点值 + 左贡献 + 右贡献
   ○ 向上返回值：当前节点值 + max(左贡献, 右贡献)

```python
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        global ans
        ans = -10**10
        def _dfs(root: Optional[TreeNode]) -> int:
            global ans
            if root == None:
                return  0
            left = max(_dfs(root.left), 0)
            right = max(_dfs(root.right), 0)
            ans = max(ans, root.val + left + right)
            return root.val + max(left, right)
        _dfs(root)
        return ans
```

##  lc128给定一个未排序的整数数组 nums，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。要求时间复杂度为 O(n)。

解题思路（哈希集合）
核心逻辑：
1. 构建哈希集合：存储所有数字（O(1)查找）
2. 寻找连续序列起点：
   ○ 仅当 num-1 不在集合中时，以 num 为起点探索连续序列
3. 扩展序列：
   ○ 从起点开始，依次检查 num+1、num+2... 是否在集合中
   ○ 更新最大长度

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        nums_set = set(nums)
        ans = 0
        # 注意从set开始避免重复计算
        for num in nums_set:
            if num - 1 not in nums_set:
                x = num
                res = 1
                while x + 1 in nums_set:
                    x += 1
                    res += 1
                ans = max(ans, res)

        return ans
```

## lc322.给定不同面额的硬币 coins 和一个总金额 amount，计算凑成总金额所需的最少硬币个数。如果无法凑出，返回 -1。硬币数量无限。

01背包
1. DP数组含义：
   dp[i] = 凑齐i金额的最小硬币数
2. 初始化铁律：
   ○ dp[0]=0（基准条件）
   ○ 其他初始为无穷大（inf）
3. 双重循环顺序：
   ○ 外循环：金额 i 从 1 到 amount
   ○ 内循环：遍历硬币面值 coin
4. 状态转移核心：
   dp[i] = min(自身, dp[i-coin]+1)

```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = 10 ** 10
        dp = [INF] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for j in range(coin, amount + 1):
                dp[j] = min(dp[j], dp[j - coin] + 1 )

        return -1 if dp[amount] == INF else dp[amount]
```

## lc494.给定一个整数数组 nums 和目标整数 target，通过在每个整数前添加 '+' 或 '-' 组合表达式，返回运算结果等于 target 的 不同表达式数目

解题思路（动态规划 + 数学转化）
核心推导：
设添加 '+' 的数字和为 P，添加 '-' 的数字和为 N：

```text
P - N = target  
P + N = sum(nums)  
→ 2P = sum(nums) + target  
→ P = (sum(nums) + target) / 2
```
关键条件：
1. (sum + target) 必须为 偶数且非负，否则无解（返回0）
2. 问题转化为 求子集和为P的方案数（0-1背包问题）

```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        diff = sum(nums) + target
        if diff < 0 or diff % 2!=0:
            return 0

        neg = diff // 2
        dp = [0] * (neg + 1)
        dp[0] = 1
        for num in nums:
            for i in range(neg, num - 1, -1):
                dp[i] += dp[i - num]

        return dp[neg]
```

## lc448. 给定一个长度为 n 的整数数组 nums，其中所有元素的值都在 [1, n] 范围内。有些元素出现两次，其他出现一次。找出 [1, n] 中没有出现在数组中的所有数字。

核心思路：原地标记法
1. 标记出现过的数字：
   ○ 遍历数组，对每个元素 nums[i]：
   ■ 取绝对值 x = nums[i]。
   ■ 定位到索引 pos = x - 1。
   ■ 如果 nums[pos] <= n，将其加上n（标记为出现）。
2. 检查缺失的数字：
   ○ 再次遍历数组：
   ■ 若 nums[i] <= n，说明 i + 1 未出现。
   ■ 将这些数字加入结果列表。

```python
class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        n = len(nums)
        for item in nums:
            x = (item - 1) % n
            nums[x] += n

        ans = []
        for i in range(n):
            if nums[i] <= n:
                ans.append(i + 1)
        
        return ans
```

## lc438.给定两个字符串 s 和 p，找到 s 中所有是 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。异位词 指由相同字母重排列形成的字符串（包括相同的字符串）。

核心方法：滑动窗口 + 固定长度频次匹配
关键思路
1. 固定窗口大小：异位词长度与 p 相同，窗口长度固定为 len(p)。
2. 频次数组：用长度 26 的数组统计 p 中字母频次（p_count），并动态维护窗口的频次（s_count）。
3. 滑动更新：窗口每次向右滑动 1 位，更新频次数组并比较是否匹配。

```python
from collections import Counter
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        p_counter = Counter(p)
        s_counter = Counter(s[:len(p)])
        ans = []
        if s_counter == p_counter:
            ans.append(0)

        for i in range(0, len(s) - len(p)):
            s_counter[s[i]] -= 1
            s_counter[s[i + len(p)]] += 1
            if s_counter == p_counter:
                ans.append(i + 1)
        return ans
```

## lc437. 给定二叉树的根节点 root 和目标整数 targetSum，求路径和等于 targetSum 的路径数目。路径必须向下（父→子），不需从根开始，也不需在叶节点结束。

核心思路：前缀和 + 回溯
1. 前缀和：记录从根节点到当前节点的路径和 curr_sum。
2. 哈希表：存储路径上各前缀和出现的次数（prefix_sum_count）。
3. 核心公式：curr_sum−targetSum=历史前缀和若历史前缀和存在，说明两节点间路径和 = targetSum。
4. 回溯：返回上一层前需将当前 curr_sum 从哈希表中移除。

```python
class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        pre_sum = {}
        pre_sum[0] = 1
        def _dfs(root: Optional[TreeNode], sum, target: int) -> int:
            if root == None:
                return 0
            sum += root.val

            res = pre_sum.get(sum - target, 0)
            pre_sum[sum] = pre_sum.get(sum, 0) + 1
            res += _dfs(root.left, sum, target)
            res += _dfs(root.right, sum, target)
            pre_sum[sum] = pre_sum.get(sum, 0) - 1

            return res

        return _dfs(root, 0, targetSum)
```

## lc416. 给定一个仅包含正整数的非空数组，判断是否能将数组分割成两个子集，使得两个子集的元素和相等。

核心思路
1. 问题转化：求是否存在子集和为 sum(nums)/2（若总和为奇数直接返回 false）
2. 0-1背包解法：
   ○ 状态定义：dp[j] 表示是否能用数组中的数凑出和 j
   ○ 初始化：dp[0] = true（空子集和为0）
   ○ 状态转移：对每个数 num，倒序遍历 j ∈ [target, num]：
   dp[j] = dp[j] || dp[j - num]
3. 优化：使用一维DP数组 + 倒序更新


```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        sums = sum(nums)
        if sums % 2 != 0:
            return False

        target = sums // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for num in nums:
            for i in range(target, num - 1, -1):
                dp[i] = dp[i - num] or dp[i]

        return dp[target]
```

## lc461. 计算两个整数之间的汉明距离。两个整数的汉明距离是指它们的二进制表示中不同位的数量。

核心思路
1. 异或操作：
   x ^ y 的结果中，每个 1 表示对应位不同。
2. 统计 1 的数量：
   利用位运算技巧快速计数（布赖恩·克尼根算法）。
```python
class Solution:
    def hammingDistance(self, x: int, y: int) -> int:
        res = x ^ y
        ans = 0
        while res != 0:
            res -= res&-res
            ans += 1
        return ans
```

##  lc406. 给定一组人，每个人用一对整数 (h, k) 表示，其中 h 是人的身高，k 是排在这个人前面且身高大于或等于 h 的人数。编写算法重建队列。

核心思想：
1. 排序预处理：
   ○ 主排序：按身高 h_i 降序（从高到矮）。
   ○ 次排序：身高相同则按 k_i 升序（前面人越少越靠前）。
   目的：确保先处理高个子，再插入矮个子不影响高个子的 k_i。
2. 贪心插入：
   ○ 将排序后的人依次插入到结果列表的 k_i 索引位置。
   解释：高个子先站定位置，矮个子插入时只需根据 k_i 插入到合适空位。

```python
class Solution:
    def reconstructQueue(self, people: List[List[int]]) -> List[List[int]]:
        
        # 排序：身高降序，身高相同时 k 值升序
        people.sort(key = lambda p:(-p[0], p[1]))

        # 使用列表进行高效插入（list.insert 等价于 Java 的 result.add(index, item)）
        ans = []
        for p in people:
            ans.insert(p[1], p)

        return ans
```