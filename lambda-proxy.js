const https = require('https');
const http = require('http');

exports.handler = async (event) => {
    const { path, httpMethod, body, headers } = event;
    
    // Remove the /api prefix and forward to backend
    const backendPath = path.replace('/api', '');
    const backendUrl = `http://54.227.68.44:8000${backendPath}`;
    
    console.log(`Proxying ${httpMethod} ${path} to ${backendUrl}`);
    
    try {
        const response = await makeRequest(backendUrl, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            body: body
        });
        
        return {
            statusCode: response.statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Proxy error', message: error.message })
        };
    }
};

function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            });
        });
        
        req.on('error', reject);
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}
