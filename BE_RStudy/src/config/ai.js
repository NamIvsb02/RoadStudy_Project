const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

class AiError extends Error {
    constructor(message, status = null) {
        super(message);
        this.name = "AiError";
        this.status = status;
    }
}

// AI_PROVIDER=gemini: Google Gemini (GEMINI_API_KEY, GEMINI_MODEL)
// AI_PROVIDER=openai: mọi dịch vụ tương thích OpenAI như Groq, OpenRouter, Mistral (AI_API_KEY, AI_BASE_URL, AI_MODEL)
// Không đặt AI_PROVIDER: tự chọn gemini nếu chỉ có GEMINI_API_KEY, ngược lại dùng openai
const getConfig = () => ({
    provider: (process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY && !process.env.AI_API_KEY ? "gemini" : "openai")).toLowerCase(),
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 20000,
    openai: {
        apiKey: process.env.AI_API_KEY,
        baseUrl: (process.env.AI_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, ""),
        model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
        jsonMode: process.env.AI_JSON_MODE !== "false",
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    },
});

// Thông tin cấu hình đang dùng (không gồm API key), phục vụ tests/ai-check.js
const describeConfig = () => {
    const config = getConfig();
    const active = config.provider === "gemini" ? config.gemini : config.openai;
    return {
        provider: config.provider,
        model: active.model,
        baseUrl: config.provider === "gemini" ? GEMINI_BASE_URL : config.openai.baseUrl,
        hasKey: Boolean(active.apiKey),
    };
};

// Mô hình đôi khi bọc JSON trong ```json ... ```
const parseJson = (text) => {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    try {
        return JSON.parse(cleaned);
    } catch {
        throw new AiError("Phản hồi của AI không phải JSON hợp lệ");
    }
};

const failIfNotOk = async (res, provider) => {
    if (res.ok) return;
    const detail = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 300);
    throw new AiError(`${provider} trả về lỗi HTTP ${res.status}${detail ? `: ${detail}` : ""}`, res.status);
};

const buildOpenAiBody = ({ system, prompt, temperature }, model, { mergeSystem, jsonMode }) => ({
    model,
    temperature,
    messages: mergeSystem
        ? [{ role: "user", content: `${system}\n\n${prompt}` }]
        : [
            { role: "system", content: system },
            { role: "user", content: prompt },
        ],
    ...(jsonMode && { response_format: { type: "json_object" } }),
});

// Một số model miễn phí không nhận vai trò system hoặc response_format (trả HTTP 400):
// thử lại tối đa 2 lần với cách gửi đơn giản hơn.
const callOpenAiCompatible = async (request, { apiKey, baseUrl, model, jsonMode }) => {
    if (!apiKey) throw new AiError("Chưa cấu hình AI_API_KEY");
    const attempts = [
        { mergeSystem: false, jsonMode },
        { mergeSystem: true, jsonMode },
        ...(jsonMode ? [{ mergeSystem: true, jsonMode: false }] : []),
    ];

    let res;
    for (const attempt of attempts) {
        res = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify(buildOpenAiBody(request, model, attempt)),
            signal: request.signal,
        });
        if (res.status !== 400) break;
    }
    await failIfNotOk(res, "Dịch vụ AI");
    const body = await res.json();
    return body.choices?.[0]?.message?.content ?? "";
};

const callGemini = async ({ system, prompt, temperature, signal }, { apiKey, model }) => {
    if (!apiKey) throw new AiError("Chưa cấu hình GEMINI_API_KEY");
    const res = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature, responseMimeType: "application/json" },
        }),
        signal,
    });
    await failIfNotOk(res, "Gemini");
    const body = await res.json();
    return (body.candidates?.[0]?.content?.parts ?? []).map((part) => part.text ?? "").join("");
};

// Gọi mô hình AI và nhận về một object JSON. Mọi lỗi (thiếu key, quá thời gian, HTTP lỗi, sai định dạng) đều ném AiError.
const generateJson = async ({ system, prompt, temperature = 0.2 }) => {
    const config = getConfig();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);
    const request = { system, prompt, temperature, signal: controller.signal };

    try {
        const text = config.provider === "gemini" ? await callGemini(request, config.gemini) : await callOpenAiCompatible(request, config.openai);
        if (!text) throw new AiError("AI không trả về nội dung");
        return parseJson(text);
    } catch (err) {
        if (err instanceof AiError) throw err;
        throw new AiError(err.name === "AbortError" ? "AI phản hồi quá thời gian chờ" : `Không gọi được dịch vụ AI: ${err.message}`);
    } finally {
        clearTimeout(timer);
    }
};

module.exports = { generateJson, describeConfig, AiError };