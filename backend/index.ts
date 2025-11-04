
import { readFile } from "fs/promises";
import { FastifyRequest, FastifyReply } from "fastify";

export const any = {
  async bundle(req: FastifyRequest, res: FastifyReply) {
    const bundlePath = `${__dirname}/../data/${req.url.split("/").pop()}`;
    try {
      const buffer = await readFile(bundlePath);
      res.header("Content-Type", "application/zip");
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to load bundle" });
    }
  },
  async fileDosDirectRead(req: FastifyRequest, res: FastifyReply) {
    const bundlePath = `${req.url.split("/fileDosDirectRead/")[1]}`;
    try {
      const buffer = await readFile(bundlePath);
      res.header("Content-Type", "application/zip");
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to load bundle" });
    }
  },
  async modules(req: FastifyRequest, res: FastifyReply) {
    const bundlePath = `${__dirname}/../frontend/node_modules${req.url.split("/modules")[1]}`;
    try {
      const buffer = await readFile(bundlePath);
      res.header("Content-Type", "application/octet");
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to load bundle" });
    }
  },
};
