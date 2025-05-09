export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL' });
    }

    try {
        const apiUrlKeywords = `https://test-dileesh-evgfccd4ffayf6bx.canadacentral-01.azurewebsites.net/api/keywords/GetTrendingWords?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrlKeywords);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch keywords' });
    }
}
