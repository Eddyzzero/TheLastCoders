import { createServer } from "http";
import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import bootstrap from "../src/main.server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distFolder = resolve(__dirname, "../dist/the-last-coders/browser");

export default async function handler(req, res) {
  const commonEngine = new CommonEngine();

  // Get the html file created during SSR build
  const indexHtml = join(distFolder, "index.html");

  // Render the app
  const html = await commonEngine.render({
    bootstrap,
    documentFilePath: indexHtml,
    url: req.url,
    publicPath: distFolder,
    providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
  });

  // Send the rendered HTML back
  res.send(html);
}
