const fs = require('fs');
const path = require('path');

const footerHtml = fs.readFileSync(path.join(__dirname, 'footer.html'), 'utf8');

const filesToUpdate = [
    "index.html",
    "aanbod.html",
    "product.html",
    "werkwijze.html",
    "garanties.html",
    "contact.html",
    "faq.html",
    "algemene-voorwaarden.html",
    "privacy-policy.html"
];

filesToUpdate.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('<!-- FOOTER PLACEHOLDER -->')) {
            content = content.replace('<!-- FOOTER PLACEHOLDER -->', footerHtml);
        } else if (content.includes('<footer')) {
            // Replaces EVERYTHING from <footer ...> to </footer>
            content = content.replace(/<footer[\s\S]*?<\/footer>/, footerHtml);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filename);
    } else {
        console.log('Missing ' + filename);
    }
});
