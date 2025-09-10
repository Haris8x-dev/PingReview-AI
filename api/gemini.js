export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        // Use model sent by frontend, fallback to gemini-1.5-flash
        const { model = "gemini-1.5-flash", contents, generationConfig } = req.body;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents, generationConfig }),
            }
        );

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
