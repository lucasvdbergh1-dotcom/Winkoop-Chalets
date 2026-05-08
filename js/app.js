document.addEventListener("DOMContentLoaded", () => {
    // Syntax error fix requested by user (previously failing in Node, now executed safely in browser)
    const pageHTML = document.body.innerHTML;
    if (pageHTML.includes("Can't find what you're looking for?")) {
        document.body.innerHTML = pageHTML.replace("Can't find what you're looking for?", "Op de hoogte blijven van het nieuwste aanbod?");
    }

    const MOCK_DATA = [
        { id: "rec1", fields: { Title: "Forest Cabin Deluxe", Price: "€32.500", Size: "42m²", Beds: "2", Baths: "1", Year: "2018", Type: "Gerenoveerd", ImageURL: "https://placehold.co/800x600/111821/ffffff?text=Forest+Cabin" } },
        { id: "rec2", fields: { Title: "Sunny Valley Home", Price: "€28.000", Size: "38m²", Beds: "3", Baths: "1", Year: "2015", Type: "As-Is", ImageURL: "https://placehold.co/800x600/307de8/ffffff?text=Sunny+Valley" } },
        { id: "rec3", fields: { Title: "Alpine Retreat", Price: "€58.900", Size: "55m²", Beds: "2", Baths: "2", Year: "2021", Type: "Premium", ImageURL: "https://placehold.co/800x600/8b7355/ffffff?text=Alpine+Retreat" } },
        { id: "rec4", fields: { Title: "Lakeview Cottage", Price: "€41.200", Size: "45m²", Beds: "2", Baths: "1", Year: "2019", Type: "Gerenoveerd", ImageURL: "https://placehold.co/800x600/1f62c4/ffffff?text=Lakeview+Cottage" } }
    ];

    const viewLoader = document.getElementById("view-loader");
    const gridContainer = document.getElementById("grid-container");
    const gridTemplate = document.getElementById("grid-card-template");
    const viewGrid = document.getElementById("view-grid");
    const viewDetails = document.getElementById("view-details");
    const viewBezichtiging = document.getElementById("view-bezichtiging");

    async function fetchData() {
        if (typeof CONFIG !== 'undefined' && CONFIG.AIRTABLE_PAT !== "YOUR_PERSONAL_ACCESS_TOKEN" && CONFIG.AIRTABLE_BASE_ID !== "YOUR_BASE_ID") {
            const API_URL = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${CONFIG.AIRTABLE_TABLE_NAME}`;
            try {
                const response = await fetch(API_URL, {
                    headers: { 'Authorization': `Bearer ${CONFIG.AIRTABLE_PAT}` }
                });
                if (!response.ok) throw new Error("Airtable fetch failed");
                const data = await response.json();
                return data.records.filter(record => record.fields.Name).map(record => ({
                    id: record.id,
                    fields: {
                        Title: record.fields.Name || "Onbekend Chalet",
                        Price: record.fields.Prijs ? `€${record.fields.Prijs.toLocaleString('nl-NL')}` : "Prijs op aanvraag",
                        Size: record.fields.Formaat ? `${record.fields.Formaat}m²` : "-",
                        Beds: record.fields.Bedrooms || "-",
                        Baths: record.fields.Bathrooms || "-",
                        Year: record.fields.Year || "-",
                        Type: record.fields.Categorie || "Standaard",
                        ImageURL: (record.fields.Afbeeldingen && record.fields.Afbeeldingen.length > 0) ? record.fields.Afbeeldingen[0].url : "https://placehold.co/800x600/111821/ffffff?text=No+Image"
                    }
                }));
            } catch (error) {
                console.error("Live Airtable Fetch Error, falling back to mock:", error);
            }
        }
        return new Promise(resolve => setTimeout(() => resolve(MOCK_DATA), 600));
    }

    async function fetchSingleRecord(selectedProductId) {
        if (typeof CONFIG !== 'undefined' && CONFIG.AIRTABLE_PAT !== "YOUR_PERSONAL_ACCESS_TOKEN" && CONFIG.AIRTABLE_BASE_ID !== "YOUR_BASE_ID") {
            const API_URL = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${CONFIG.AIRTABLE_TABLE_NAME}/${selectedProductId}`;
            try {
                const response = await fetch(API_URL, {
                    headers: { 'Authorization': `Bearer ${CONFIG.AIRTABLE_PAT}` }
                });
                if (response.status === 404) throw new Error("not_found");
                if (!response.ok) throw new Error("Airtable fetch failed");

                const record = await response.json();
                if (!record.fields.Name) throw new Error("not_found");
                return {
                    id: record.id,
                    fields: {
                        Title: record.fields.Name || "Onbekend Chalet",
                        Price: record.fields.Prijs ? `€${record.fields.Prijs.toLocaleString('nl-NL')}` : "Prijs op aanvraag",
                        Size: record.fields.Formaat ? `${record.fields.Formaat}m²` : "-",
                        Beds: record.fields.Bedrooms || "-",
                        Baths: record.fields.Bathrooms || "-",
                        Year: record.fields.Year || "-",
                        Type: record.fields.Categorie || "Standaard",
                        Description: record.fields.Description || record.fields.Beschrijving || record.fields.Omschrijving || "Geen beschrijving beschikbaar.",
                        ImageURL: (record.fields.Afbeeldingen && record.fields.Afbeeldingen.length > 0) ? record.fields.Afbeeldingen[0].url : "https://placehold.co/1200x800/111821/ffffff?text=No+Image",
                        Spec_Bouwjaar: record.fields.Spec_Bouwjaar || "-",
                        Spec_Afmetingen: record.fields.Spec_Afmetingen || "-",
                        Spec_Verwarming: record.fields.Spec_Verwarming || "-",
                        Spec_Kozijnen: record.fields.Spec_Kozijnen || "-",
                        Spec_Isolatie: record.fields.Spec_Isolatie || "-",
                        Spec_Airco: record.fields.Spec_Airco || "-"
                    }
                };
            } catch (error) {
                if (error.message === "not_found") throw error;
                console.error("Live Airtable Fetch Error, falling back to mock:", error);
            }
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const rec = MOCK_DATA.find(r => r.id === selectedProductId);
                if (rec) resolve(rec);
                else reject(new Error("not_found"));
            }, 600);
        });
    }

    function renderGrid(records, isHomePage = false) {
        if (!gridContainer || !gridTemplate) return;

        Array.from(gridContainer.children).forEach(child => {
            if (child.id !== "grid-card-template") child.remove();
        });

        if (records.length === 0) {
            if (viewLoader) viewLoader.innerHTML = `<p class="text-text-muted font-medium">Geen chalets gevonden.</p>`;
            return;
        }

        const displayRecords = isHomePage ? records.slice(0, 4) : records;

        displayRecords.forEach(record => {
            const clone = gridTemplate.cloneNode(true);
            clone.id = `card-${record.id}`;
            clone.classList.remove("hidden");

            const setField = (selector, val) => {
                const el = clone.querySelector(selector);
                if (el) el.textContent = val;
            };

            setField('.data-bind-title', record.fields.Title);
            setField('.data-bind-price', record.fields.Price);
            setField('.data-bind-size', record.fields.Size);
            setField('.data-bind-beds', `${record.fields.Beds} Slaapk.`);
            setField('.data-bind-baths', `${record.fields.Baths} Badk.`);
            setField('.data-bind-year', record.fields.Year);
            setField('.data-bind-type', record.fields.Type);

            const img = clone.querySelector('.data-bind-image');
            if (img) img.src = record.fields.ImageURL;

            const link = clone.querySelector('.data-bind-link');
            if (link) {
                link.href = `/product?id=${record.id}`;
            } else if (clone.tagName.toLowerCase() === 'a') {
                clone.href = `/product?id=${record.id}`;
            } else {
                clone.addEventListener("click", () => {
                    window.location.href = `/product?id=${record.id}`;
                });
            }

            gridContainer.appendChild(clone);
        });

        if (viewLoader) viewLoader.classList.add(!isHomePage ? "view-hidden" : "hidden");
        if (viewGrid) viewGrid.classList.remove("view-hidden");
    }

    function renderDetailView(record) {
        if (viewLoader) viewLoader.classList.add("view-hidden");

        const setField = (selector, val) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = val;
        };

        setField('.data-bind-detail-title', record.fields.Title);
        setField('.data-bind-detail-price', record.fields.Price);
        setField('.data-bind-detail-size', record.fields.Size);
        setField('.data-bind-detail-beds', `${record.fields.Beds} Slaapk.`);
        setField('.data-bind-detail-baths', `${record.fields.Baths} Badk.`);
        setField('.data-bind-detail-ref', `Ref: #${record.id.substring(0, 8)}`);

        const img = document.querySelector('.data-bind-detail-image');
        if (img) img.src = record.fields.ImageURL;

        const desc = document.querySelector('.data-bind-detail-desc');
        if (desc) desc.innerHTML = record.fields.Description;

        setField('.data-bind-spec-bouwjaar', record.fields.Spec_Bouwjaar);
        setField('.data-bind-spec-afmetingen', record.fields.Spec_Afmetingen);
        setField('.data-bind-spec-slaapkamers', record.fields.Beds);
        setField('.data-bind-spec-badkamers', record.fields.Baths);
        setField('.data-bind-spec-verwarming', record.fields.Spec_Verwarming);
        setField('.data-bind-spec-kozijnen', record.fields.Spec_Kozijnen);
        setField('.data-bind-spec-isolatie', record.fields.Spec_Isolatie);
        setField('.data-bind-spec-airco', record.fields.Spec_Airco);

        // Set the Plan Bezichtiging button href dynamically
        const bezBtn = document.querySelector('.data-bind-detail-bez-link');
        if (bezBtn) bezBtn.href = `/bezichtiging?id=${record.id}`;

        if (viewDetails) viewDetails.classList.remove("view-hidden");
    }

    // === BEZICHTIGING VIEW ===
    function renderBezichtigingView(record) {
        if (viewLoader) viewLoader.classList.add("view-hidden");

        const setField = (selector, val) => {
            document.querySelectorAll(selector).forEach(el => el.textContent = val || '-');
        };

        setField('.data-bind-bez-title', record.fields.Title);
        setField('.data-bind-bez-price', record.fields.Price);
        setField('.data-bind-bez-size', record.fields.Size);
        setField('.data-bind-bez-beds', `${record.fields.Beds || '-'} Slaapk.`);
        setField('.data-bind-bez-baths', `${record.fields.Baths || '-'} Badk.`);
        setField('.data-bind-bez-year', record.fields.Year ? `Bj. ${record.fields.Year}` : '-');
        setField('.data-bind-bez-ref', `#${record.id.substring(0, 8)}`);

        // Set background image
        const bgEl = document.querySelector('.data-bind-bez-bg');
        if (bgEl && record.fields.ImageURL) {
            bgEl.style.backgroundImage = `url('${record.fields.ImageURL}')`;
        }

        // Form submit handler
        const form = document.getElementById('bezichtiging-form');
        const submitBtn = document.getElementById('bez-submit');
        const successEl = document.getElementById('bez-success');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const name = document.getElementById('bez-name')?.value;
                const email = document.getElementById('bez-email')?.value;
                const date = document.getElementById('bez-date')?.value;
                if (!name || !email || !date) {
                    alert('Vul alstublieft alle verplichte velden in.');
                    return;
                }
                // Hide form, show success
                if (form) form.classList.add('view-hidden');
                if (successEl) successEl.classList.remove('view-hidden');
            });
        }

        if (viewBezichtiging) viewBezichtiging.classList.remove("view-hidden");
    }

    // Router Logic Based on Page
    const path = window.location.pathname;
    if (path.includes("bezichtiging")) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedId = urlParams.get('id');
        if (!selectedId) {
            if (viewLoader) viewLoader.innerHTML = `<div class="text-center py-10"><p class="text-xl font-bold mb-4">Geen chalet ID gevonden</p><a href="/aanbod" class="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow hover:bg-primary/90">Terug naar aanbod</a></div>`;
            return;
        }
        fetchSingleRecord(selectedId).then(record => {
            renderBezichtigingView(record);
        }).catch(err => {
            if (viewLoader) viewLoader.innerHTML = `<div class="text-center"><p class="text-xl font-bold mb-4">Chalet niet gevonden</p><a href="/aanbod" class="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow hover:bg-primary/90">Terug naar aanbod</a></div>`;
        });
    } else if (path.includes("product") || viewDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedProductId = urlParams.get('id') || urlParams.get('product_id');

        if (!selectedProductId) {
            // Stay on page for debugging instead of redirecting
            if (viewLoader) viewLoader.innerHTML = `<div class="text-center py-10"><p class="text-xl font-bold mb-4">Geen product ID gevonden in de URL</p><p class="text-text-muted mb-4">URL: ${window.location.href}</p><a href="/aanbod" class="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow hover:bg-primary/90">Terug naar aanbod</a></div>`;
            return;
        }

        fetchSingleRecord(selectedProductId).then(record => {
            renderDetailView(record);
        }).catch(err => {
            if (err.message === "not_found") {
                if (viewLoader) viewLoader.innerHTML = `<div class="text-center"><p class="text-xl font-bold mb-4">Chalet niet gevonden</p><a href="/aanbod" class="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow hover:bg-primary/90">Terug naar aanbod</a></div>`;
            } else {
                if (viewLoader) viewLoader.innerHTML = `<p class="text-red-500 font-bold">Error loading data.</p>`;
            }
        });
    } else if (path.includes("aanbod") || viewGrid) {
        fetchData().then(records => {
            renderGrid(records, false);
        }).catch(err => {
            if (viewLoader) viewLoader.innerHTML = `<p class="text-red-500 font-bold">Error loading data.</p>`;
        });
    } else if (path.includes("index") || path === "/") {
        fetchData().then(records => {
            renderGrid(records, true);
        }).catch(err => {
            if (viewLoader) viewLoader.innerHTML = `<p class="text-red-500 font-bold">Error loading data.</p>`;
        });
    }
});
