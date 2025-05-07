// pages/api/fetch-html.js

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        res.status(200).send(html);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch HTML content' });
    }
}
