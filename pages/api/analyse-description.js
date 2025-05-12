// export default async function handler(req, res) {
//     debugger
//     const { url } = req.query;
//     if (req.method !== 'POST') {
//         return res.status(405).end('Only POST allowed');
//     }
//
//     const { productName, productDescription, keywords } = req.body;
//
//     if (!productName || !productDescription || !keywords) {
//         return res.status(400).json({ error: 'Missing required fields' });
//     }
//
//     try {
//         // const apiResponse = await fetch('https://seo-optimzer-api.azurewebsites.net/api/ai/suggestproductdescription', {
//         const apiResponse = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'accept': '*/*',
//                 'subscriptionKey': '1e918fa3-859a-4920-944f-ac98b305dc23',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 productName,
//                 productDescription,
//                 commaDelimitedKeywords: keywords
//             })
//         });
//
//         const result = await apiResponse.json();
//         res.status(200).json(result);
//
//     } catch (err) {
//         console.error('API call failed', err);
//         res.status(500).json({ error: 'Failed to fetch AI suggestion' });
//     }
// }
