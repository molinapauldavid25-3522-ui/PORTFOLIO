const images = {
    wedding:[],
    birthday:[],
    christening:[],
    prenup:[],
    preshoot:[]
};

let subfoldersData = {};

function getSubfolderName(parentSlug, childSlug) {
    if (subfoldersData[parentSlug]) {
        const found = subfoldersData[parentSlug].find(sf => sf.slug === childSlug);
        if (found) return found.name;
    }
    return childSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function loadImages(){
    for (let category in images) {
        let exactGallery = document.getElementById(category + "-gallery");
        
        if (exactGallery) {
            // General photos matching exactly
            images[category].forEach(src => {
                const img = document.createElement("img");
                img.src = src;
                exactGallery.appendChild(img);
                observer.observe(img);
            });
            continue;
        }

        // Subfolders
        if (category.includes("_")) {
            const parts = category.split("_");
            const parentCategory = parts[0];
            const childSlug = parts[1];

            const parentGallery = document.getElementById(parentCategory + "-gallery");
            
            if (parentGallery) {
                const humanName = getSubfolderName(parentCategory, childSlug);

                const subHeader = document.createElement("h3");
                subHeader.className = "sub-folder-title";
                subHeader.textContent = humanName;

                const subGallery = document.createElement("div");
                subGallery.className = "gallery sub-gallery";

                images[category].forEach(src => {
                    const img = document.createElement("img");
                    img.src = src;
                    subGallery.appendChild(img);
                    observer.observe(img);
                });

                parentGallery.parentNode.appendChild(subHeader);
                parentGallery.parentNode.appendChild(subGallery);
            }
        }
    }
}

const observer = new IntersectionObserver(entries =>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

// INITIALIZE APP FROM FIREBASE (COMPAT V8)
function initApp() {
    if (typeof db === 'undefined') {
        console.error("Firebase not loaded correctly.");
        return;
    }
    
    // Fetch photos
    db.ref('photos').get().then((snapshot) => {
        if (snapshot.exists()) {
            const savedPhotos = snapshot.val();
            
            // Handle Migration if needed locally
            if (savedPhotos["john-roberts"]) {
                savedPhotos["concert-shoots_john-roberts"] = (savedPhotos["concert-shoots_john-roberts"] || []).concat(savedPhotos["john-roberts"]);
                delete savedPhotos["john-roberts"];
            }
            
            for(let category in savedPhotos){
                const catData = savedPhotos[category] || [];
                // Support both arrays and push objects
                images[category] = Array.isArray(catData) ? catData : Object.values(catData);
            }
        }
        
        // Fetch subfolders
        db.ref('subfolders').get().then((subfoldersSnap) => {
            if (subfoldersSnap.exists()) {
                subfoldersData = subfoldersSnap.val();
            }
            
            // Fetch backgrounds
            db.ref('site_backgrounds').get().then((bgSnap) => {
                if (bgSnap.exists()) {
                    const storedBackgrounds = bgSnap.val();
                    const classListStr = document.body.className;
                    for (let bgKey in storedBackgrounds) {
                        if (classListStr.includes(bgKey)) {
                            document.body.style.backgroundImage = `url('${storedBackgrounds[bgKey]}')`;
                            break;
                        }
                    }
                }
                
                // Finally, populate UI
                loadImages();
            });
        });
    }).catch((error) => {
        console.error("Firebase Read Error:", error);
    });
}

initApp();