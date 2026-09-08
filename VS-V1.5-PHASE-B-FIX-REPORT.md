# Vértice Sino — V1.5 Phase B 精准修复记录

日期：2026-09-08。记录本轮低风险修改和已完成的本地验收；本次获准选择性发布，生产验收结果以部署后的检查为准。Phase A Passed 保持不变，没有重新发送邮件或重复其投递验收。

## 修改范围及审计依据

| 文件 | 本轮修改 | 审计依据 |
| --- | --- | --- |
| `app/site-page.tsx` | 复用三语页脚字典；接入最小菜单交互；本地化语言选择器；键盘跳到正文；Organization、Service、WebSite 分立并以稳定 @id 关联 | M4、M5、L2、L7 |
| `app/seo-service-page.tsx` | 相同菜单/辅助功能增强；中文入口标明返回中文首页，未创建对应服务页 | M4、M5、L7 |
| `app/mobile-menu.tsx`（新增） | 保留原生 details，选择链接后收起，Escape 关闭并归还焦点 | M5 |
| `app/interface-copy.ts`（新增） | 三语辅助功能标签 | L7 |
| `app/phase-b.css`（新增） | 桌面语言目标至少 24px；仅键盘聚焦时显示 skip link；去除无目的页 related 文本的链接下划线 | M6、L6、L7 |
| `app/layout.tsx` | 上一轮已完成的 CSS 导入及全局西语 keywords 清理；本轮恢复后未再改动。根 layout、html lang 和路由结构均保持 | L4、L7及审计第7节 |
| `app/[locale]/page.tsx` | OG 图片尺寸修正为实际 1733×908，首页 image alt 使用对应语言字典 | L1 |
| `app/[locale]/[serviceSlug]/page.tsx` | 仅修正 OG 图片尺寸；slug、dynamicParams、canonical、hreflang 不变 | L1 |
| `app/i18n.ts` | 替换过时的“打开邮件客户端”说明，准确说明团队评估/回复用途及通过 Resend 发送 | M10、L4 |
| `app/contact-form.tsx` | 只新增 privacy 文案属性及显示，未修改字段、POST、验证、限流、honeypot、超时或投递状态处理 | M10 |
| `app/sitemap.ts` | 删除每次构建变化的 lastModified，不编造内容更新日期；既有 URL 与 alternates 不变 | L5 |
| `next.config.ts` | nosniff、strict-origin-when-cross-origin、DENY、防摄像头/麦克风/定位 Permissions-Policy；既有本地 dev 初始化不纳入本次提交 | M9 |
| `lib/admin-auth.ts` | cookie URI 解码失败返回空值，按未授权处理。此文件原本未跟踪、未发布，本轮没有将 Admin 纳入生产范围 | L8 |

未改 `app/globals.css` 的历史改动、`.env.example`、`wrangler.jsonc`、Phase A API/共享验证/限流模块、OpenNext 缓存配置、依赖版本及 lockfile。Phase B 基线副本位于 `work/phase-b/baseline/`，用于区别原有未提交内容。

## 验证

- typecheck、完整 lint：中断前已通过，lint 为 0 errors、2 个原有 warnings（业务 logo img 1；PostCSS 1）。未重新安装依赖。
- production Next.js build：恢复后通过，仍预渲染三首页及两个服务页，contact API 动态。独立验证目录只包含已提交生产基线与本轮网站修改，不纳入既有 Admin/D1、历史全站样式或本地 dev 初始化。
- 浏览器专项：5 个页面全部通过。检查桌面点击面积、键盘 skip link、移动菜单点击后收起、Escape/焦点、手机无横向溢出、无页面 JS 异常、三语用途说明、OG 尺寸和 JSON-LD 可解析。没有提交表单。
- 本地内容响应确认 nosniff、DENY、Referrer-Policy；没有将本地 Next 响应等同于尚未部署的 Worker 响应。
- sitemap 无 lastmod；没有改动 Phase A URL 集合和语言对应。
- cookie 负向：畸形百分号、非法编码、无效 token、无关 cookie、空 cookie 共 5 项返回 null；网络调用为 0。只使用隔离合成配置。
- Schema 属性复核：Service 的 provider/serviceType 依据 [Schema.org Service](https://schema.org/Service)；去除新增节点上不适用的 inLanguage，补验最终源码和构建。
- 最终补验：typecheck、受影响文件 lint（0 errors / 1 个既有 warning）、production build 均通过；三语最终预渲染 JSON-LD 类型/实体关联检查通过，OG PNG 实际尺寸及构建 headers 清单一致；浏览器证据为 `work/phase-b/verification.json`，测试脚本为 `work/phase-b/verify.cjs`。

## 性能定位（M7）

本地冷缓存、390×844、CPU 4×、150ms 延迟、下载约 1.6Mbps，各语言一次。ES/PT/ZH 的最后 LCP 元素均是 header 的 `img.brand-logo`，TTFB 约 14–15ms，CLS 均为 0；LCP 分别约 9.24s、8.67s、18.03s。完整资源时序保存在上述 JSON。

这是受本机负载和限速影响的单次诊断，并非生产 CWV/p75、Lighthouse 分数，也不能与旧实验直接作性能提升比较。尚不足以确认根因或优化收益；本轮未修改 Hero、字体、动画、logo 图片或加载策略。

## 保留未处理

- 按用户最新指示，服务端 html lang 与根 layout/[locale] 结构调整单独处理；当前 PT/ZH 文档语言问题未宣称修复。
- 404 多语言（L3）随上述路由语言方案另行处理。
- OG 图像本身仍为原有共用素材；未新增语言版图片或更改品牌设计。
- CSP（含报告收集方案）、HSTS 需结合实际 Cloudflare 输出与域名策略进一步验收，本轮不机械启用 preload/includeSubDomains 或猜测白名单。已新增基础 headers 尚未进行生产部署验收。
- 未定义或编造数据留存期限、完整隐私政策；本轮仅说明已确认的数据用途和邮件流程。
- LCP 仍需多次可比 trace/真实用户数据定位；不宣称已达标。
- 没有为 related label 创建新目的页；其他原有装饰性卡片箭头未扩展处理。
- `.env.example` 的旧说明未动；GA4/Search Console、新基础设施及其他 V2 功能不属于本轮。

本轮低风险修改不代表 Phase B 全部问题已关闭。本次仅发布上述网站修改及报告；Admin cookie 修复继续保留本地，不纳入提交。
