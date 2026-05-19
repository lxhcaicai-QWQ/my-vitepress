import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  base: '/my-vitepress/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'algorithm',
        items: [
          { text: 'ACM输入输出模板', link: '/algorithm/acm-python-io.md' },
          { text: '基础算法', link: '/algorithm/basic/basic_algorithms.md' },
          { text: '数据结构', link: '/algorithm/basic/data_structure.md' },
          { text: '贪心', link: '/algorithm/basic/greedy_problem.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lxhcaicai-QWQ/my-vitepress.git' }
    ]
  }
})
