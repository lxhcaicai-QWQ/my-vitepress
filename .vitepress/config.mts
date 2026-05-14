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
          { text: 'ACM输入输出模板', link: '/algorithm/acm-python-io.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lxhcaicai-QWQ/my-vitepress.git' }
    ]
  }
})
