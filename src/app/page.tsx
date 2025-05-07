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
  const [htmlInput, setHtmlInput] = useState('');
  const [productSchema, setProductSchema] =
      useState<ProductSchemaType | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiImprovedDescription, setAiImprovedDescription] = useState('');

  const handleExtractSchema = () => {
    const match = htmlInput.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        setProductSchema(parsed);
      } catch (e) {
        alert(`Failed to parse JSON-LD${e}`);
      }
    } else {
      alert('No JSON-LD script found');
    }
  };

  const handleAnalyze = async () => {
    //     const prompt = `
    // Analyze this product description for tone, clarity, keyword richness, and uniqueness.
    // Flag any issues. Then rewrite it to be SEO-optimized.
    //
    // Description: "${productSchema?.description}"
    // `;

    // Replace with actual OpenAI API call
    // const response = await fetch(...);
    // const aiResponse = await response.json();
    // setAiAnalysis(aiResponse.analysis);
    // setAiImprovedDescription(aiResponse.suggestedDescription);

    // TEMP MOCK
    setAiAnalysis('The description is clear but lacks keyword richness.');
    setAiImprovedDescription(
        `Introducing the ${productSchema?.name}, a top-rated, eco-friendly solution for daily use. Now with improved features and unmatched value.`
    );
  };

  const handleCopy = () => {
    const updated = {
      ...productSchema,
      description: aiImprovedDescription
    };
    navigator.clipboard.writeText(JSON.stringify(updated, null, 2));
    alert('Updated JSON-LD copied to clipboard');
  };

  return (
      <div className="p-6 max-w-4xl mx-auto font-sans">
        <h1 className="text-3xl font-bold mb-4">
          SEO Product Schema Analyzer
        </h1>

        <label className="block mb-2 font-semibold">
          Paste HTML with JSON-LD:
        </label>
        <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={10}
            className="w-full p-3 border border-gray-300 rounded mb-3 font-mono"
        />

        <button
            onClick={handleExtractSchema}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Extract Schema
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
              <p>
                <strong>Price:</strong>{' '}
                {productSchema.offers?.price || 'N/A'}
              </p>
              <button
                  onClick={handleAnalyze}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Analyze & Improve
              </button>
            </div>
        )}

        {aiAnalysis && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">AI Analysis</h2>
              <p>{aiAnalysis}</p>
            </div>
        )}

        {aiImprovedDescription && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Improved Description
              </h2>
              <div className="bg-gray-100 p-3 rounded mb-2">
                <p>{aiImprovedDescription}</p>
              </div>
              <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Copy Updated JSON-LD
              </button>
            </div>
        )}
      </div>
  );
}
