import express from "express";
import { exec } from "child_process";
import path from "path";
import archiver from "archiver";
import cors from "cors";
import { config } from "dotenv";
import { fileURLToPath } from "url";
config();

const PORT = process.env.VITE_SERVER_PORT || 8800;
const SYNTHEA_EXECUTABLE = path.resolve(process.env.SYNTHEA_EXECUTABLE_PATH);
const app = express();

const distDir = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(
    cors({
        origin: "*",
        exposedHeaders: ["Content-Disposition"],
    })
);

app.post("/generate", (req, res) => {
    const { seed, populationSize, clinicianSeed, gender, location } = req.body;
    const outputDir = `${seed}-${location.state}-${Date.now()}`;

    const command = `${SYNTHEA_EXECUTABLE} -s ${Number(seed)} -p ${Number(
        populationSize
    )} -cs ${Number(clinicianSeed)} -g ${gender[0].toUpperCase()} ${
        location.state
    } ${location.city} --exporter.baseDirectory="${distDir}/${outputDir}"`;

    exec(command, (error, _, stderr) => {
        if (error) {
            res.status(500).json({ error: `${stderr}` });
        } else {
            res.set({
                "Content-Disposition": `attachment; filename="${outputDir}.zip"`,
                "Content-Type": "application/zip",
            });

            const archive = archiver("zip", { zlib: { level: 9 } });
            archive.pipe(res);

            archive.directory(path.join(distDir, outputDir), false);

            archive.finalize();

            archive.on("error", (err) => {
                res.status(500).json({ error: `ARCHIVE-ERROR: ${err}` });
            });

            archive.on("finish", () => {
                // Dangerous !!!
                exec(
                    `rm -rf ${path.join(distDir, outputDir)}`,
                    (error, _, stderr) => {
                        if (error) console.error(`Error: ${stderr}`);
                    }
                );
            });
        }
    });
});

app.listen(PORT);
