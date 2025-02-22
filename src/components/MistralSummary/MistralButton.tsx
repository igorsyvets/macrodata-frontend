import { useState } from 'react';
import { mistralService } from '../../services/mistral.service';

export default function MistralButton() {
    const [summary, setSummary] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleSummarize = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await mistralService.summarizeTweets();
            const formattedSummary = result.themes
            .map(theme => `${theme.name}\nCount: ${theme.count}`)
            .join('\n\n');
        setSummary(formattedSummary);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={handleSummarize}
                disabled={loading}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                {loading ? 'Analyzing Chants...' : 'Analyze Arsenal Chants'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {summary && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-3">Chants Analysis:</h2>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="whitespace-pre-wrap">{summary}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

