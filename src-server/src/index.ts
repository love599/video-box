import { Elysia } from "elysia";
import { runMigrations } from "./plugins/migrate";
// 路由
import folderWebRoutes from "@/routers/folder/web";
import sourceWebRoutes from "@/routers/source/web";
import sourceTvRoutes from "@/routers/source/tv";
import pluginWebRoutes from "@/routers/plugin/web";
import myVideoItemRoutes from "@/routers/my/video-item";
import proxyRoutes from "@/routers/proxy";
import authRoutes from "@/routers/auth";
import adminRouters from "@/routers/admin";
import { registerJob } from "./modules/job";
import { registerElysiaPlugin } from "./plugins/elysia_plugin";
import { registerElysiaHook } from "./plugins/elysia_hook";

const app = new Elysia({
  serve: {
    idleTimeout: 30,
  }
});

// 注册插件
registerElysiaPlugin(app);
// 注册定时任务
registerJob(app);
// 全局钩子
registerElysiaHook(app);

// 注册路由
app
  .use(adminRouters)
  .use(folderWebRoutes)
  .use(sourceWebRoutes)
  .use(sourceTvRoutes)
  .use(pluginWebRoutes)
  .use(myVideoItemRoutes)
  .use(proxyRoutes)
  .use(authRoutes);

runMigrations()
  .then(() => {
    console.log("✅ migrations applied");
  })
  .catch((e) => {
    console.error("❌ migrations failed", e);
  })
  .finally(() => {
    app.listen(52411);
    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    );
  });
