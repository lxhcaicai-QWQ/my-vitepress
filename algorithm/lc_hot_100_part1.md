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