const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const imgInput = document.getElementById("files");

imgInput.addEventListener("change", imageInput);

function imageInput(_event) {
    let files = _event.target.files;
    if (!files || !files.length) return;

    files = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));
    console.log(files);
    putImages(files);
}

let canvasResized = false;
async function putImages(_files) {
    const images = [];
    for (let file of _files) {
        images.push(await loadImage(file));
    }

    let gridSize = Math.ceil(Math.sqrt(images.length));
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            await drawImage(images[y * gridSize + x], x, y, gridSize);
        }
    }
    canvasResized = false;
    downloadImage();
}

async function loadImage(file) {
    return new Promise((resolve, reject) => {
        if (file.type && !file.type.startsWith("image/")) {
            return reject();
        }
        const fr = new FileReader();
        fr.addEventListener("load", (_e) => {
            resolve(_e.target.result);
        });
        fr.readAsDataURL(file);
    })
}

async function drawImage(image, x, y, gridSize) {
    if(!image) return;
    return new Promise((resolve) => {
        let img = new Image();
        img.addEventListener("load", () => {
            if (!canvasResized) {
                ctx.canvas.width = gridSize * img.width;
                ctx.canvas.height = gridSize * img.height;
                canvasResized = true;
            }
            ctx.drawImage(img, x * img.width, y * img.height)
            resolve();
        });
        img.src = image;
    })
}

function downloadImage(){
    let link = document.createElement("a");
    link.setAttribute("download", "spritesheet.png");
    link.setAttribute("href", canvas.toDataURL("image/png"));
    link.click();
}