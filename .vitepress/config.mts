import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '个人知识库',
  description: '面向长期积累的个人知识库',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [
    /yy-auth/,
    /zhinao-clue-standard/,
    /knowledge-base-repo\//,
    /package\.json/,
    /^\.\/01-basics$/,
    /^\.\/02-web-backend$/,
    /^\.\/03-project-practice$/
  ],
  themeConfig: {
    siteTitle: '个人知识库',
    nav: [
      { text: '首页', link: '/' },
      { text: 'Python', link: '/01-python/' }
    ],
    sidebar: {
      '/01-python/': [
        {
          text: '总览',
          items: [
            { text: 'Python 主题总览', link: '/01-python/' },
            { text: '学习地图', link: '/01-python/learning-map' },
            { text: '术语表', link: '/01-python/glossary' },
            { text: '维护规则', link: '/01-python/update-rules' }
          ]
        },
        {
          text: '基础入门',
          items: [
            { text: '后端思维入门', link: '/01-python/01-basics/backend-thinking' },
            { text: '前端视角的 Python 最小语法', link: '/01-python/01-basics/python-syntax-for-frontend' },
            { text: 'Python 常用命令', link: '/01-python/01-basics/common-commands' }
          ]
        },
        {
          text: 'Web 后端',
          items: [
            { text: 'FastAPI 基础认知', link: '/01-python/02-web-backend/fastapi-basics' }
          ]
        },
        {
          text: '项目实战',
          items: [
            { text: 'yy-auth 项目整体认知', link: '/01-python/03-project-practice/yy-auth-overview' },
            { text: 'yy-auth 请求链路初识', link: '/01-python/03-project-practice/yy-auth-request-flow' }
          ]
        }
      ]
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    footer: {
      message: '知识库是内容源，文档站是展示层。',
      copyright: 'Personal Knowledge Base'
    },
    search: {
      provider: 'local'
    }
  }
})
