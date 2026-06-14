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


## lc394. 给定一个编码字符串，格式为 k[encoded_string]，表示方括号内的 encoded_string 重复 k 次（k 为正整数）。字符串中可能包含多层嵌套括号，需将其解码为原始字符串。

示例：
● 输入：s = "3[a]2[bc]" → 输出："aaabcbc"
● 输入：s = "3[a2[c]]" → 输出："accaccacc"

核心方法：双栈法
1. 数据结构：
   ○ 数字栈 num_stack：存储重复次数 k。
   ○ 字符串栈 str_stack：存储括号前的字符串片段。
   ○ 当前字符串 current_str：动态记录正在解析的字符串。
   ○ 当前数字 current_num：动态记录当前数字（多位数字需拼接）。

```python
class Solution:
    def decodeString(self, s: str) -> str:
        string_stack = []
        num_stack = []
        current_string = ""
        current_num = 0
        for c in s:
            if c.isdigit():
                current_num = current_num * 10 + int(c)
            elif c == '[':
                num_stack.append(current_num)
                string_stack.append(current_string)
                current_string = ""
                current_num = 0
            elif c == ']':
                num = num_stack.pop()
                pre_string = string_stack.pop()
                current_string = pre_string + current_string * num
            else:
                current_string += c

        return current_string
```

## lc121. 给定一个数组 prices，其中 prices[i] 表示股票第 i 天的价格。你只能选择 某一天买入 并 在未来的某一天卖出，求能获得的 最大利润。若无法获利，返回 0。

核心思路
1. 动态更新最低价：遍历过程中记录截至当前的最低价格 min_price。
2. 计算最大利润：对每个价格 p，用 p - min_price 更新最大利润 max_profit。
   关键点
   ● 时间复杂度 O(n)：仅需一次遍历。
   ● 空间复杂度 O(1)：只使用两个变量。
   ● 边界处理：空数组直接返回 0。

```python
class Solution:
   def maxProfit(self, prices: List[int]) -> int:
      ans = 0
      n = len(prices)
      f = [0] * n
      f[0] = prices[0]
      for i in range(1, n):
         f[i] = min(f[i-1], prices[i])
         ans = max(ans, prices[i] - f[i])
      return ans
```

##  lc337. 小偷发现一个地区房屋布局为二叉树结构（根节点为入口），相邻房屋（直接相连节点）被打劫会触发警报。给定二叉树根节点 root，求不触发警报时的最大盗取金额。
关键思路
● 树形动态规划：每个节点返回两个状态值（偷/不偷时的最大值）
● 状态定义：
○ rob: 偷当前节点时的最大金额
○ skip: 不偷当前节点时的最大金额
● 状态转移：
○ 偷当前节点 → 跳过直接子节点
rob = node.val + left_skip + right_skip
○ 不偷当前节点 → 子节点可偷/不偷
skip = max(left_rob, left_skip) + max(right_rob, right_skip)

```python
class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        f = {}
        g = {}
        def _dfs(root: Optional[TreeNode]):
            if root == None:
                return
            _dfs(root.left)
            _dfs(root.right)
            f[root] = root.val + g.get(root.left, 0) + g.get(root.right, 0)
            g[root] = max(g.get(root.left, 0), f.get(root.left, 0)) + max(g.get(root.right, 0), f.get(root.right, 0))
        _dfs(root)
        return max(g.get(root,0), f.get(root,0))
```

##  lc338. 给定一个非负整数 n，要求计算 0 到 n 之间每个数字的二进制表示中 1 的个数，并返回结果数组。

核心解法：动态规划 + 位运算
1. 奇偶规律：
   ○ 偶数 i：二进制中 1 的个数等于 i/2 的个数（右移一位后结果相同）。
   例：6（二进制 110）的 1 的个数 = 3（二进制 11）的个数。
   ○ 奇数 i：二进制中 1 的个数等于 i-1 的个数加 1（末尾 0 变 1）。
   例：7（二进制 111）的个数 = 6 的个数 2 + 1 → 3。

```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        f = [0] * (n + 1)
        f[0] = 0
        for i in range(1, n + 1):
            j = i - (i&-i)
            f[i] = f[j] + 1
        return f
```

## lc312. 有 n 个气球，索引从 0 到 n-1，每个气球标有数字 nums[i]。戳破气球 i 可获得 nums[left] × nums[i] × nums[right] 硬币，其中 left 和 right 是 i 的相邻气球（戳破后相邻关系动态变化）。求戳破所有气球能获得的最大硬币数。


关键思路与算法
区间 DP（动态规划）
1. 修改数组：首尾添加 1（虚拟气球），新数组为 arr = [1] + nums + [1]，长度 n+2。
2. DP 定义：
   ○ dp[i][j]：戳破 开区间 (i, j) 内所有气球 的最大硬币数（i 和 j 不戳破）。
   ○ 最终目标：dp[0][n+1]（戳破整个 [1, 2, ..., n] 区间）。

```python
class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        nums = [1] + nums + [1]
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n + 1):
            for i in range(0, n - length + 1):
                j = i + length - 1
                for k in range(i + 1, j):
                    dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])

        return dp[0][n - 1]
```


##  lc347. 给定整数数组 nums 和整数 k，返回出现频率前 k 高的元素。
核心思路
1. 统计频率：用哈希表记录每个数字出现的次数。
2. 维护Top K堆：
   ○ 使用最小堆（频率越小越先出堆），保持堆大小不超过 k。
   ○ 遍历哈希表，将元素按 (频率, 元素) 加入堆，堆满时弹出最小频率元素。
3. 提取结果：倒序输出堆中所有元素（堆中频率从小到大，需反转）。

```python
import heapq
from collections import Counter
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        heap = []
        for num, freq in count.items():
            heapq.heappush(heap, (freq, num))
            if len(heap) > k:
                heapq.heappop(heap)

        return [num for _, num in heap]
```

## lc300. 给定一个整数数组 nums，返回最长严格递增子序列（不连续）的长度。

动态规划解法（O(n²)）
● 定义状态：dp[i] 表示以 nums[i] 结尾的最长递增子序列长度。
贪心 + 二分查找解法（O(n log n)） ✅
● 维护数组 tails：
tails[k] 表示长度为 k+1 的递增子序列的最小末尾元素。
● 遍历数组：
○ 若当前元素 num > tails[-1]：扩展序列（tails.append(num)）。
○ 否则：二分查找 tails 中第一个 ≥num 的位置并替换。
● 结果：tails 的长度即为最长递增子序列长度。

```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        f = []
        for num in nums:
            if not f or f[-1] < num:
                f.append(num)
            else:
                l = 0
                r = len(f) - 1
                pos = 0
                while l <= r:
                    mid = (l + r) // 2
                    if f[mid] >= num:
                        r = mid - 1
                        pos = mid
                    else:
                        l = mid + 1
                f[pos] = num
        return len(f)
```

## lc309. 给定整数数组 prices，其中 prices[i] 表示第 i 天的股票价格。设计算法计算最大利润，约束如下：
1. 可多次交易，但再次买入前必须卖出之前的股票（不能同时参与多笔交易）。
2. 卖出股票后，无法在第二天买入股票（冷冻期为 1 天）。

核心思路：状态机 DP
   使用 三个状态 表示每天结束后的情况：
   ● sell（状态 0）：当天卖出股票（下一天是冷冻期）。
   ● hold（状态 1）：持有股票（可能是当天买入或之前持有）。
   ● cool（状态 2）：不持有股票，且当天未卖出（非冷冻期，可买入）。

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        n = len(prices)
        f = [[0,0,0] for _ in range(n + 1)]
        f[0][1] = -10 ** 10
        for i in range(1, n + 1):
            w = prices[i - 1]
            f[i][0] = f[i-1][1] + w
            f[i][1] = max(f[i-1][2] - w, f[i-1][1])
            f[i][2] = max(f[i-1][2], f[i-1][0])

        return max(f[n][0], f[n][2])
```

##  lc240. 在一个 m x n 的矩阵中查找目标值 target。矩阵具有以下特性：
● 每行的元素从左到右升序排列
● 每列的元素从上到下升序排列

● 核心思路
从右上角（或左下角）开始搜索：
● 右上角元素是当前行最大和当前列最小
● 比较 matrix[i][j] 与 target：
○ 等于 → 直接返回 true
○ 大于 → 目标值可能在左侧列，列索引 j--
○ 小于 → 目标值可能在下方的行，行索引 i++
● 时间复杂度：O(m+n)（最多遍历一行+一列）
● 空间复杂度：O(1)

```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        n = len(matrix)
        m = len(matrix[0])

        x = 0
        y = m - 1
        while x < n and y >= 0:
            if matrix[x][y] == target:
                return True
            elif matrix[x][y] > target:
                y -= 1
            else:
                x += 1

        return False
```

## lc279. 给定正整数 n，找到若干个完全平方数（如 1、4、9、16...）使它们的和等于 n。返回所需完全平方数的最小数量。
将问题转化为完全背包问题：
● 物品：所有不超过 n 的完全平方数（1, 4, 9, ..., (√n)^2）
● 背包容量：目标整数 n
● 目标：恰好装满背包所需的最小物品数量（每个物品可重复使用）

```python
class Solution:
    def numSquares(self, n: int) -> int:
        f = [100] * (n + 1)
        f[0] = 0
        x = 1
        while x * x <= n:
            w = x * x
            for j in range(w, n + 1):
                f[j] = min(f[j], f[j - w] + 1)
            x += 1
        return f[n]
```

## lc239. 滑动窗口最大值

核心数据结构：双端队列 (Deque)
● 存储数组元素的下标（非值本身）
● 维护队列单调递减：队头是当前窗口最大值的下标
核心原理：
● 队头始终是窗口内的最大值下标
● 队列的单调性确保后续元素不影响当前最大值判断
● 时间复杂：O(n)（每个元素入队、出队各一次）

```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        deque = collections.deque()
        ans = []
        for i in range(len(nums)):
            while deque and i - deque[0] >= k:
                deque.popleft()

            while deque and nums[i] >= nums[deque[-1]]:
                deque.pop()

            deque.append(i)
            if i >= k - 1:
                ans.append(nums[deque[0]])
        return ans
```

## lc283. 给定一个数组 nums，将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
要求：
1. 原地操作（不能复制数组）
2. 最小化操作次数
   示例：
   输入: [0,1,0,3,12]
   输出: [1,3,12,0,0]

双指针
   ● 指针分工：
   ○ 慢指针 slow：标记下一个非零元素应放置的位置。
   ○ 快指针 fast：遍历数组，寻找非零元素。
   ● 操作逻辑：
   a. 当 fast 遇到非零元素时，将其与 slow 位置的元素交换。
   b. 交换后 slow 向右移动一位（确保左侧全是非零元素）。
   c. 无论是否交换，fast 每次向右移动一位。
   ● 结果：所有 0 被“推”到数组末尾，非零元素顺序不变。

```python
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        slow = 0
        for fast in range(0, len(nums)):
            if nums[fast] != 0:
                nums[fast], nums[slow] = nums[slow], nums[fast]
                slow += 1
```


## lc287. 给定一个包含 n + 1 个整数的数组 nums，其数字都在 [1, n] 范围内。假设只有一个重复的整数（但可能重复多次），找出这个重复数。

1. 数值范围二分：不是对数组索引二分，而是对数值范围 [1, n] 二分。
2. 鸽笼原理：统计数组中 ≤ mid 的元素个数：
   ○ 若个数 > mid → 重复数在 [left, mid] 中。
   ○ 否则 → 重复数在 [mid+1, right] 中。
3. 终止条件：当 left == right 时，找到重复数。

```python
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        n = len(nums)
        l,r = 1, n
        ans = -1
        while l <= r:
            mid = (l + r) // 2
            count = sum(1 for x in nums if x <= mid)
            if count > mid:
                ans = mid
                r = mid - 1
            else:
                l = mid + 1
        return ans
```

## lc22. 题目描述：数字 n 代表生成括号的对数，设计一个函数，生成所有可能的且有效的括号组合。

示例
n = 3 → ["((()))","(()())","(())()","()(())","()()()"]
n = 1 → ["()"]

1. 终止条件：当前字符串长度 = 2 × n
2. 限制条件：
   ○ 左括号数量 < n → 添加左括号 (
   ○ 右括号数量 < 左括号数量 → 添加右括号 )

```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        ans = []
        def _dfs(x, y: int, ss: str, n: int):
            if x == n and y == n:
                ans.append(ss)
                return
            if x == y and x <= n and y <= n:
                _dfs(x + 1, y, ss + '(', n)
            elif x > y and x <= n and y <= n:
                _dfs(x + 1, y, ss + '(', n)
                _dfs(x, y + 1, ss + ')', n)

        _dfs(0, 0, "", n)
        return ans
```

## lc48. 给定一个 n × n 的二维矩阵 matrix，表示一个图像。要求原地将图像顺时针旋转 90 度（不创建额外矩阵）。
两步操作（数学性质）
1. 转置矩阵：交换行和列（matrix[i][j] ↔ matrix[j][i]）。
2. 水平翻转每一行：将每行元素对称交换（matrix[i][j] ↔ matrix[i][n-1-j]）。


无论怎么转，第一步永远是“转置”，第二步永远是“翻转”。

顺时针旋转 90° = 转置 + 水平翻转（向左转头，身体跟着向左右翻）
逆时针旋转 90° = 转置 + 垂直翻转（向左转头，身体跟着向上下翻）
(注：如果你先做翻转，再做转置，那么对应的翻转方向刚好反过来，即 顺时针 = 垂直翻转 + 转置；逆时针 = 水平翻转 + 转置)

```python
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        n = len(matrix)
        for i in range(n):
            for j in range(i + 1):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

        for i in range(n):
            matrix[i].reverse()
```

## lc46. 给定一个不含重复数字的数组 nums，返回其所有可能的全排列。

回溯法（DFS）
关键思想：
通过递归遍历所有可能的路径，使用交换实现排列生成（无需额外存储空间）。

```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        ans = []
        now = []
        vis = [False] * (n + 1)

        def _dfs(d: int, now: list[int]):
            if d == n:
                res = [x for x in now]
                ans.append(res)
                return
            for i in range(n):
                if vis[i]:
                    continue
                vis[i] = True
                now.append(nums[i])
                _dfs(d + 1, now)
                now.pop()
                vis[i] = False

        _dfs(0, now)
        return ans
```

## lc39. 给定一个无重复元素的整数数组 candidates 和一个目标整数 target，找出所有能组成 target 的唯一组合（每个数字可无限次使用），组合不能重复（例如 [2,2,3] 和 [2,3,2] 视为相同）。

核心思路
1. 回溯法（DFS）：
   ○ 关键操作：递归遍历所有可能的组合，通过回溯撤销无效选择。
   ○ 避免重复：通过固定遍历起点（start 索引），确保组合中的数字非递减排列（如 [2,2,3] 有效，[2,3,2] 因乱序被跳过）。
2. 剪枝优化：
   ○ 先对数组排序（candidates.sort()）。
   ○ 当 remain < candidates[i] 时，提前结束循环（后续数字更大，无需尝试）。

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        ans = []
        n = len(candidates)
        def _dfs(now: List[int],last: int, candidates: List[int], sums, target: int):
            if sums == target:
                res = [x for x in now]
                ans.append(res)
                return
            for i in range(last, n):
                if sums + candidates[i] <= target:
                    now.append(candidates[i])
                    _dfs(now,i, candidates, sums + candidates[i], target)
                    now.pop()

        _dfs([],0, candidates, 0, target)
        return ans
```

## lc42. 给定 n 个非负整数表示宽度为 1 的柱子高度图，计算下雨后这些柱子之间能接多少雨水。

核心思路
动态规划解法（最优空间：双指针；逻辑清晰：动态规划）
1. 每个位置的雨水 = min(左侧最高柱, 右侧最高柱) - 当前高度
2. 需计算每个位置的左侧最大高度 left_max 和右侧最大高度 right_max。
3. 总雨水 = 所有位置的雨水高度之和（只取正值）。

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        lmax = [0] * n
        rmax = [0] * n
        lmax[0] = height[0]
        rmax[n-1] = height[n-1]

        for i in range(1, n):
            lmax[i] = max(lmax[i-1], height[i])

        for i in range(n - 2, -1, -1):
            rmax[i] = max(rmax[i + 1], height[i])

        ans = 0
        for i in range(1, n - 1):
            #遵循木桶效应
            h = min(lmax[i - 1], rmax[i + 1])
            if h >= height[i]:
                ans += h - height[i]

        return ans
```

##  lc34. 给定一个升序整数数组 nums 和目标值 target，返回 target 在数组中的起始位置和结束位置。如果不存在，返回 [-1, -1]。时间复杂度需为 O(log n)。

核心思路
两次二分查找：
1. 查找起始位置：第一个等于 target 的位置
2. 查找结束位置：最后一个等于 target 的位置

```python
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        x = -1
        y = - 1

        l, r = 0, len(nums) - 1
        while l <= r :
            mid = (l + r) // 2
            if nums[mid] >= target:
                x = mid
                r = mid - 1
            else:
                l = mid + 1
        if x != -1 and nums[x] != target:
            x = -1

        l, r = 0, len(nums) - 1
        while l <= r :
            mid = (l + r) // 2
            if nums[mid] <= target:
                y = mid
                l = mid + 1
            else:
                r = mid - 1
        if y != -1 and nums[y] != target:
            y = -1

        return [x,y]
```

## lc543. 给定一棵二叉树，计算其直径长度。二叉树的直径是任意两个结点之间的最长路径长度，这条路径可以不经过根结点。路径长度由结点之间的边数表示。
解题思路
1. 递归计算深度：
   ○ 深度 = 从当前结点到叶子结点的最长路径的结点数（包含当前结点）
   ○ 叶子结点深度 = 1（递归终止条件：空结点返回0）
2. 更新直径：
   ○ 每经过一个结点，计算：
   当前直径 = 左子树深度 + 右子树深度
   ○ 全局维护最大直径：max_diameter = max(max_diameter, 当前直径)
3. 返回值：
   ○ 递归函数返回当前子树深度 = max(左深度, 右深度) + 1

```python
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        global ans
        ans = 0
        def _dfs(root: Optional[TreeNode]) -> int:
            global ans
            if not root:
                return 0
            left = _dfs(root.left)
            right = _dfs(root.right)
            ans = max(ans, left + right)

            return max(left, right) + 1

        _dfs(root)
        return ans
```

## lc32. 给定一个只包含 '(' 和 ')' 的字符串，找出最长有效括号子串的长度。有效：格式正确且连续的括号序列。

核心思路：动态规划

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        n = len(s)
        f = [0] * (n + 1)
        stack = []
        for i in range(1, n + 1):
            if s[i-1] == '(':
                stack.append(i)
            else:
                if stack:
                    x = stack.pop()
                    f[i] = i - x + 1 + f[x - 1]
                else:
                    f[i] = 0

        return max(f)
```


## lc33. 在一个旋转后的有序数组中搜索目标值，返回其索引。若不存在则返回-1。时间复杂度要求O(log n)。

核心思路
● 核心思想：修改二分查找，判断左右区间哪个有序，再决定搜索方向
● 关键点：
✅ 通过 nums[left] <= nums[mid] 判断左区间是否有序
✅ 在有序区间内检查 target 是否在该区间内
✅ 不在有序区间则必在另一侧

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l = 0
        r = len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if nums[l] <= nums[mid]:
                if nums[l] <= target and target <= nums[mid]:
                    r = mid - 1
                else:
                    l = mid + 1
            else:
                if nums[mid] <= target and target <= nums[r]:
                    l = mid + 1
                else:
                    r = mid - 1

            if nums[mid] == target:
                return mid

        return -1
```

## lc31. 实现获取 下一个排列 的函数，需将数字序列重新排列成字典序中下一个更大的排列。若不存在更大的排列，则重新排列为最小字典序（升序）。必须原地修改，只使用额外常数空间。

核心思路
1. 字典序规则：
   ○ 排列的顺序按字典序排列，如 [1,2,3] < [1,3,2]。
2. 关键观察：
   ○ 下一个排列需在尽可能靠右的位置增大数值，然后使右侧部分升序（最小化）。
3. 算法步骤：
   ○ 步骤1：从右向左找第一个降序对 nums[i] < nums[i+1]（位置 i）。
   ○ 步骤2：从右向左找第一个大于 nums[i] 的数 nums[j]。
   ○ 步骤3：交换 nums[i] 和 nums[j]。
   ○ 步骤4：将 i+1 到末尾的部分翻转，使其升序。
   ○ 特例：若步骤1找不到降序对，说明整个序列是最大排列，直接翻转成最小排列。

```python
class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        n = len(nums)
        is_ok = False
        for i in range(n - 1, 0, -1):
            if nums[i] > nums[i-1]:
                for j in range(n - 1, i - 1, -1):
                    if nums[j] > nums[i - 1]:
                        nums[j], nums[i-1] = nums[i-1], nums[j]
                        nums[i:] = sorted(nums[i:])
                        is_ok = True
                        break
            if is_ok:
                break
        if not is_ok:
            nums.sort()
```

## lc23. 将 k 个升序链表合并为一个新的升序链表并返回。
使用分治法（Divide and Conquer）：将k个链表分成两半，然后继续分，直到只有两个链表，然后合并两个链表。

```python
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:

        if not lists:
            return None
        def _mergesort(lists: List[Optional[ListNode]], l, r: int) -> Optional[ListNode]:
            if l >= r:
                return lists[l]
            mid = (l + r) // 2
            list1 = _mergesort(lists, l, mid)
            list2 = _mergesort(lists, mid + 1, r)

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

        return _mergesort(lists, 0, len(lists) - 1)
```

## lc538. 给定一个二叉搜索树（BST），将其转换为累加树（Greater Tree），使得每个节点的值等于原始值加上所有大于它的节点值之和。

核心思路
1. 逆中序遍历（右 → 根 → 左）：
   二叉搜索树的中序遍历是升序（左→根→右）。而逆中序遍历（右→根→左）可得到降序序列，使节点值从大到小排列。
2. 累加和传递：
   维护一个全局累加和 sum。遍历时，对每个节点执行：
   ○ 将 sum 累加到当前节点值：node.val += sum
   ○ 更新 sum 为当前节点的新值（即 sum = node.val）

```python
class Solution:
    def convertBST(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        sums = 0
        def _bst(root: Optional[TreeNode]) -> Optional[TreeNode]:
            nonlocal sums
            if not root:
                return None
            _bst(root.right)
            sums += root.val
            root.val = sums
            _bst(root.left)
            return root

        return _bst(root)
```

## lc20. 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。

有效条件：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确顺序闭合。
3. 每个右括号必须有对应相同类型的左括号。
   A: 核心思路
   使用栈（Stack） 处理括号匹配：
4. 遍历字符：
   ○ 遇 左括号：压入栈中（等待匹配）。
   ○ 遇 右括号：检查栈顶是否匹配的左括号（不匹配或栈空则无效）。
5. 最终检查：栈必须为空（无未闭合括号）。

```python
class Solution:
    def isValid(self, s: str) -> bool:
        if len(s) % 2 != 0:
            return False
        stack = []
        for char in s:
            if char == '(':
                stack.append(')')
            elif char == '[':
                stack.append(']')
            elif char == '{':
                stack.append('}')
            elif not stack or stack.pop() != char:
                return False

        return not stack
```

##  lc560. 给定一个整数数组 nums 和一个整数 k，统计数组中和等于 k 的连续子数组的个数。
示例：
输入：nums = [1,1,1], k = 2 → 输出：2（子数组 [1,1] 和 [1,1]）

前缀和 + 哈希表优化
1. 前缀和定义：
   prefix_sum 表示从数组开头到当前元素的累加和（例如遍历到 nums[i] 时，prefix_sum = nums[0]+...+nums[i]）。
2. 数学关系：
   子数组 [j, i] 的和 = prefix_sum[i] - prefix_sum[j-1] = k
   → 需满足：prefix_sum[j-1] = prefix_sum[i] - k
3. 哈希表作用：
   存储所有前缀和的出现次数，实现 O(1) 快速查找需要的值。

```python
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        n = len(nums)
        sums = [x for x in nums]
        for i in range(1, n):
            sums[i] += sums[i -1]

        ans = 0
        sum_map = {0:1}
        for i in range(n):
            ans += sum_map.get(sums[i] - k, 0)
            sum_map[sums[i]] = sum_map.get(sums[i],0) + 1

        return ans
```

## lc19. 给定一个链表，删除其倒数第 n 个节点，返回链表头节点。

解决思路：
1. 创建哑节点（dummy） 指向头节点，避免处理头节点删除
2. 快指针先走 n+1 步
3. 慢指针从哑节点开始，与快指针同步移动直到快指针到末尾
4. 此时慢指针指向待删除节点的前驱，修改指针完成删除

```python
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dumpy = ListNode(0, head)
        fast = dumpy
        slow = dumpy
        for i in range(n + 1):
            fast = fast.next

        while fast:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next
        return dumpy.next
```

## lc21. 将两个升序链表合并为一个新的升序链表并返回。新链表通过拼接给定链表的节点组成。

关键思想
使用虚拟头节点（dummy node）避免边界判断，通过指针逐步合并。
算法步骤：
1. 创建虚拟头节点 dummy 和移动指针 cur
2. 遍历两链表：
   ○ 比较当前节点值，将较小节点接到 cur.next
   ○ 移动较小节点所在链表的指针
   ○ 移动 cur 指针
3. 将剩余非空链表直接拼接
4. 返回 dummy.next

```python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        master = ListNode(0)
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
```