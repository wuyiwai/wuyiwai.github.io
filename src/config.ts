// 文档： https://github.com/satnaing/astro-paper/blob/main/src/data/blog/how-to-configure-astropaper-theme.md
export const SITE = {
  website: "https://wuyiwai.github.io/", // replace this with your deployed domain
  author: "Wuyiwai",
  profile: "https://wuyiwai.github.io/",
  desc: "Hello world",
  title: "Wuyiwai的blog",
  ogImage: "", // 网站的默认 OG 图片。适用于社交媒体分享。OG 图片可以是外部图片 URL，也可以放置在 /public 目录下。
  lightAndDarkMode: true,
  postPerIndex: 10, // 首页 Recent 部分要显示的帖子数量
  postPerPage: 10, // 您可以指定每个帖子页面要显示的帖子数量
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // 决定是否在每个博客帖子中显示 Go back 按钮
  editPost: {
    enabled: false,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: false,
  dir: "ltr", // "rtl" | "auto" - 新增：RTL 语言支持
  lang: "zh-cn", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
