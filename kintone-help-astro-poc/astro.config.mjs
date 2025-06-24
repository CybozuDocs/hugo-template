// @ts-check
import { defineConfig } from "astro/config";
import dotenv from "dotenv";
import mdx from "@astrojs/mdx";

const envMap = new Map();
envMap.set("jp", ".env.jp");
envMap.set("us", ".env.us");
envMap.set("cn", ".env.cn");
envMap.set("jp_staging", ".env.jp_staging");
envMap.set("us_staging", ".env.us_staging");
envMap.set("cn_staging", ".env.cn_staging");
envMap.set("dev", ".env");

dotenv.config({
  path: envMap.get(process.env.ENV) || envMap.get("dev"),
});

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  base: "/k/",
  outDir: "./dist/k/",
});
