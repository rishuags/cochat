import { useApiKey } from "./context/ApiKeyContext";

export function ApiKeyInput() {
    const { apiKey, setApiKey } = useApiKey();

    // console.log(apiKey); Do no uncomment !!! Security Breach

    return (
        <div className="p-4 bg-gray-100 border rounded mb-4">
            <label className="block mb-1 font-medium">Your OpenAI API Key:</label>
            <input
                type="password"
                className="p-2 border rounded w-full"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
            />
        </div>
    );
}