import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config.js";

const app = express();
const PORT = process.env.PORT || 3001;
const TOKEN = process.env.LANGFLOW_TOKEN || "MISSING_TOKEN";
const RUN_URL =
    "https://aws-us-east-2.langflow.datastax.com/lf/c4b7f723-5198-4ff8-8976-d691c6ca5797/api/v1/run/08d3c5f8-d2ab-40b7-9c17-7a6da04c1bfc";

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/runFlow", async (req, res) => {
    try {
        const lfRes = await fetch(RUN_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-DataStax-Current-Org': 'cb58dd92-7527-4ebc-beb3-274c25e924fd',
                'Authorization': TOKEN,
            },
            body: JSON.stringify({
                input_value: req.body.message,
                input_type: "chat",
                output_type: "chat",
                session_id: "user_1",
            }),
        });

        const raw = await lfRes.text();

        if (!lfRes.ok) {
            console.error("Langflow error", lfRes.status, raw);
            return res.status(lfRes.status).json({
                error: "Langflow error",
                details: raw || lfRes.statusText,
            });
        }

        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.log("JSON parse fail:", err, raw);
            return res.status(500).json({ error: "Bad JSON from Langflow" });
        }

        const output = data.outputs?.[0]?.outputs?.[0]?.artifacts?.message;
        console.log("Langflow message:", output);

        res.json({ result: output ?? "[empty reply]" });
    } catch (e) {
        console.log("Proxy crashed:", e);
        res.status(500).json({ error: "Proxy failed", details: e.message });
    }
});

app.listen(PORT, () =>
    console.log(`Langflow proxy running → http://localhost:${PORT}`)
);
