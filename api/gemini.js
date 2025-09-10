export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        let { model = "gemini-1.5-flash", contents, generationConfig } = req.body;

        // 🔍 Detect if request has inline_data (image input)
        const hasImage = contents?.some(c =>
            c.parts?.some(p => p.inline_data)
        );

        // 🚨 If an image is present, force switch to multimodal model
        if (hasImage) {
            model = "gemini-2.5-flash";
            // Or "gemini-2.5-flash-image-preview" if you want image outputs too
        }

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
