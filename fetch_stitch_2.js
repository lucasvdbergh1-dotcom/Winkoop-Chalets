const fs = require('fs');

const urls = [
    "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2QyYjg3YTJlNTZkZDQ0ZDI5MjBiMTU1NTJjZTU4YmY5EgsSBxDqypaiqxEYAZIBIwoKcHJvamVjdF9pZBIVQhM5NzQxNDY2OTY3MjI0NTkxNTAx&filename=&opi=89354086",
    "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzg5YjYxODQxYTQ5ZjRlYWQ5YTQyNzRjZTY5ZTRlOWUzEgsSBxDqypaiqxEYAZIBIwoKcHJvamVjdF9pZBIVQhM5NzQxNDY2OTY3MjI0NTkxNTAx&filename=&opi=89354086"
];
const files = ["process_raw.html", "faq_raw.html"];

async function download() {
    for (let i = 0; i < urls.length; i++) {
        console.log("Fetching", files[i]);
        const res = await fetch(urls[i], {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            }
        });
        if (!res.ok) {
            console.log("Error fetching", files[i], res.status);
            continue;
        }
        const text = await res.text();
        fs.writeFileSync(files[i], text);
        console.log("Saved", files[i]);
        await new Promise(r => setTimeout(r, 10000));
    }
}
download();
