export default async function handler(req, res) {
    // const { url } = req.query;
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required in the request body' });
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analysed description' });
    }
}
