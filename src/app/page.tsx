'use client';
import React, { useState } from 'react';

type ProductSchemaType = {
  description: string;
  name: string;
  brand: {
    name: string;
  };
  offers: {
    price: number;
  };
};

export default function Home() {
  const [htmlInput] = useState('');
  const [productSchema, setProductSchema] =
      useState<ProductSchemaType | null>(null);
  const [aiImprovedDescription, setAiImprovedDescription] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  // const [approved, setApproved] = useState(false);
  const [approvedIndex, setApprovedIndex] = useState(null);

  const handleFetchAndExtract= async () => {
    let html = htmlInput;

    // Step 1: Fetch HTML if URL provided
    if (urlInput) {
      try {
        const res = await fetch(`/api/fetch-html?url=${encodeURIComponent(urlInput)}`);
        html = await res.text();
      } catch (e) {
        alert(`Failed to fetch HTML from URL - ${e}`);
        return;
      }
    }

    // Step 2: Extract and parse schema
    const scriptRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let foundProduct = null;

    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        const json = JSON.parse(match[1]);
        const schemas = Array.isArray(json) ? json : [json];
        const product = schemas.find(s => s['@type'] === 'Product');
        if (product) {
          foundProduct = product;
          break;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (foundProduct) {
      setProductSchema(foundProduct);
    } else {
      alert('No valid Product schema found.');
    }

    // Step 3: Fetch keywords based on product name (Replace here with API once ready)
    try {
      const res = await fetch(`/api/keywords?url=${encodeURIComponent(urlInput)}`);
      const keywords = await res.json();
      setKeywords(keywords || []);
    } catch (err) {
      console.error('Failed to fetch keywords:', err);
    }

  };

  const handleAnalyze = async () => {

    // Replace with actual API call
    try {
      const res = await fetch(`https://seo-optimzer-api.azurewebsites.net/api/Ai/SuggestProductDescription`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'subscriptionKey': '1e918fa3-859a-4920-944f-ac98b305dc23',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName: productSchema?.name,
          productDescription: productSchema?.description,
          commaDelimitedKeywords: keywords.join(', ')
        })
      });
      if (!res.ok) {
        throw new Error('Failed to get AI description');
      }
      const description = await res.json();
      setAiImprovedDescription(description || []);
      // setApproved(false); // reset on each fetch
    } catch (err) {
      console.error('Could not fetch improved description', err);
    }

    // TEMP MOCK
    // setAiImprovedDescription(
    //     `Introducing the ${productSchema?.name}, a top-rated, eco-friendly solution for daily use. Now with improved features and unmatched value.`
    // );
  };

  // const handleCopy = () => {
  //   const updated = {
  //     ...productSchema,
  //     description: aiImprovedDescription
  //   };
  //   navigator.clipboard.writeText(JSON.stringify(updated, null, 2));
  //   setApproved(true);
  //   alert('Copied the Improved Description to clipboard');
  // };

  const handleApprove = (index) => {
    const selected = aiImprovedDescription[index];
    const updatedSchema = {
      ...productSchema,
      name: selected.title,
      description: selected.description.replace(/<b>/g, '').replace(/<\/b>/g, '')
    };
    navigator.clipboard.writeText(JSON.stringify(updatedSchema, null, 2));
    setApprovedIndex(index);
    // setApproved(true);
  };

  const handleReject = (index) => {
    setApprovedIndex(null);
    console.log(index);
    // setApproved(false);// You can also filter them out if needed
  };

  return (
      <div className="p-6 max-w-4xl mx-auto font-sans">
        <h1 className="text-3xl font-bold mb-4">
          SEO Product Schema Analyzer
        </h1>

        <label className="block mb-2 font-semibold">
          Paste HTML with JSON-LD:
        </label>

        <input
            type="text"
            placeholder="Or enter a product URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-3"
        />

        <button
            onClick={handleFetchAndExtract}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Extract Schema and Keywords
        </button>

        {productSchema && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Product Info</h2>
              <p>
                <strong>Name:</strong> {productSchema.name}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {productSchema.description}
              </p>
              <p>
                <strong>Brand:</strong>{' '}
                {productSchema.brand?.name || 'N/A'}
              </p>
            </div>
        )}

        {productSchema && keywords && (<div className="mt-6 bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-3">Top Trending Keywords</h2>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Keyword</th>
            </tr>
            </thead>
            <tbody>
            {keywords.map((kw, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{kw}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>)}

        {productSchema && keywords && (
            <div className="mb-6">
              <button
                  onClick={handleAnalyze}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Analyze & Improve
              </button>
            </div>
        )}

        {aiImprovedDescription.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2"> Improved Description</h2>
              <div className="space-y-6 mt-8">
                {aiImprovedDescription.map((sug, index) => (
                    <div key={index} className="border p-4 rounded shadow-sm bg-white">
                      <h3 className="text-lg font-semibold mb-2">{sug?.title}</h3>
                      <p
                          className="mb-2"
                          dangerouslySetInnerHTML={{ __html: sug?.description }}
                      />
                      {approvedIndex === index ? (
                          <p className="text-green-600 font-medium">✅ Approved & copied to clipboard</p>
                      ) : (
                          <div className="flex space-x-3">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={() => handleApprove(index)}
                            >
                              Approve
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={() => handleReject(index)}
                            >
                              Reject
                            </button>
                          </div>
                      )}
                    </div>
                ))}
              </div>

            </div>
        )}
      </div>
  );
}
