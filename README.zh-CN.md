# Skins Pro — **下一代 Home Assistant 仪表盘**

[English Version](README.md)

**下一代 Home Assistant 仪表盘**——多皮肤、沉浸式、开箱即用。

Skins Pro 是一款社区 Lovelace 卡片，采用多皮肤架构。内置 **modern** 皮肤，并通过皮肤商店提供更多皮肤。自带中英文双语，从 HACS 安装后无需配置即可使用。

- 从 HACS 自定义仓库添加
- 多皮肤自由切换
- 全屏 Kiosk 模式，沉浸式体验
- 按房间区域展示设备
- 图标自动从 Home Assistant 获取
- 非管理员强制全屏锁定

> 说明 — 我们常因喜爱而制作自己喜欢的皮肤，但不经意间可能会触及版权问题。建议尽量使用 AI 生成图片以规避风险。当前所有主题图片资源均由 AI 生成，部分图片可能会出现 AI 水印或类似生成痕迹；如果你不喜欢 AI 生成的图片，可以在设置里自由上传背景图和房间图片。如果您认为某些皮肤侵犯了您的版权，请在 Issue 区留言，我们会及时删除对应皮肤。

## 设计理念

保持简单，保持易用。

Skins Pro 的设计围绕简单和易用展开。从 HACS 安装，选择皮肤，在卡片编辑器里调整几个设置，就可以开始使用。每个功能都力求直观，让你专注于享受智能家居。

## 安装

[![Open your Home Assistant instance and add this repository in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ha-china&repository=Skins-Pro&category=plugin)

点上面的按钮一键添加，或者手动操作：

1. HACS → Custom Repositories → Add `https://github.com/ha-china/Skins-Pro`, category: Dashboard
2. 安装 Skins Pro
3. 刷新 Home Assistant 前端
4. 设置 → 仪表盘 → 添加新仪表盘 → 选 "Skins Pro"

![New Dashboard](https://github.com/ha-china/Skins-Pro/raw/screenshot-assets/add_dashboard.png)

![Settings](https://github.com/ha-china/Skins-Pro/raw/screenshot-assets/settings.png)

## 皮肤商店

![商店](https://github.com/ha-china/Skins-Pro/raw/screenshot-assets/store.gif)

可在卡片编辑器中直接下载额外皮肤。点击**下载**时，卡片通过 CDN 获取皮肤包，并通过 [`skins-pro-hass`](https://github.com/ha-china/skins-pro-hass) 集成安装到 HA 的 `www/` 目录。

> 集成仅在从商店下载皮肤时需要。如果只用内置的 **modern** 皮肤，可以不安装。

## 内置皮肤

| 皮肤 | 风格 | 特点 |
|---|---|---|
| **modern**（默认） | 白色玻璃 | 毛玻璃效果，高分辨率图片，温润蓝白配色，内置深色模式 |

> 其他皮肤（AEON、AEON_glass、visionOS、minecraft 及社区投稿）均通过卡片编辑器中的**皮肤商店**下载使用。点击商店按钮浏览并下载。

## 预览

![modern](https://github.com/ha-china/Skins-Pro/raw/screenshot-assets/modern.png)

![modern 深色模式](https://github.com/ha-china/Skins-Pro/raw/screenshot-assets/modern-dark.png)

![Advanced Feature](https://github.com/ha-china/Skins-Pro/raw/screenshot-assets/Advanced_Feature.png)

### 皮肤切换演示

<video src="https://github.com/ha-china/Skins-Pro/raw/master/screenshots/skin.mp4" controls width="100%" preload="metadata"></video>
[⬇ Download MP4](screenshots/skin.mp4)

## 功能

- ☀️ 天气与问候
- 💬 信息展示
- 📱 设备控制面板（按房间或按类型）— 灯、开关、窗帘、空调、热水器、风扇、加湿器、扫地机
- 🚪 房间快照，附带场景快捷按钮
- 🎬 场景按钮
- 🤖 自动化页面
- ⚡ 能源面板（含昨日对比）
- 🛡️ 安全页面 — 摄像头、门锁、安防面板（自动检测，点击可布撤防）
- 🎵 媒体播放器卡片 — 专辑封面、播放控制、上下曲切换、音量条
- 📷 首页摄像头实时快照
- 🌡️ 环境传感器展示 — 图标自动从 HA 获取
- 🗺️ 按楼层分组设备
- 🌐 中英文双语自动切换
- 🌙 深色模式 — 日落日出自动切换，点击时钟可手动切换（modern 皮肤）
- 🔍 全局搜索 — 模糊搜索设备，按类型筛选
- ↔️ 全屏 Kiosk 模式
- 🔒 非管理员全屏锁定 — 强制全屏、屏蔽右键及开发者工具
- 🖼️ 使用 HA 区域图片作为房间背景
- 🎨 自定义背景图片上传
- 📱 移动端自适应布局
- 🎭 多皮肤架构 — 从内置商店下载社区皮肤

首次添加时会自动扫描你的 Home Assistant，按区域和设备类型组织页面。

## 开发

皮肤开发指南、构建说明和贡献指南已移至 [Wiki](https://github.com/ha-china/Skins-Pro/wiki/Home-zh-CN)。([English](https://github.com/ha-china/Skins-Pro/wiki))

## 致谢

- 架构启发自 [dwains-dashboard-next](https://github.com/dwainscheeren/dwains-dashboard-next)
- 设计启发自 [html-card-pro Discussions](https://github.com/ha-china/html-card-pro/discussions/11)
- 全屏模式启发自 [kiosk-mode](https://github.com/NemesisRE/kiosk-mode)
- 核心渲染框架 Lit
- 图片处理 sharp
- 零运行时依赖，保持精简