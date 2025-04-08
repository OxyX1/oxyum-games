const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Proxy route to forward game URLs with query parameters
app.get('/proxy', async (req, res) => {
    const { url } = req.query; // Expect a 'url' query parameter

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        // Make sure the URL includes the query parameters, so we forward them correctly
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                // Optionally add more headers to handle CORS, referrer, etc.
            },
            responseType: 'stream', // We stream the response for large files or games
        });

        // Forward the headers and content of the response
        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res); // Pipe the game content directly to the client
    } catch (error) {
        console.error('Error fetching the game:', error);
        res.status(500).json({ error: 'Failed to fetch the URL' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
