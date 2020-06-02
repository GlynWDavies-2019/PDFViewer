const url = './SSE-Bill.pdf';
const scale = 1.5;
const canvas = document.querySelector('#pdf-render');
const context = canvas.getContext('2d');

let pdfDocument = null;
let pageNumber = 1;
let pageIsRendering = false;
let pageNumberIsPending = null;

const renderPage = number => {
    pageIsRendering = true;
    pdfDocument.getPage(number).then(page => {
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
            pageIsRendering = false;
            if(pageNumberIsPending !== null) {
                renderPage(pageNumberIsPending);
                pageNumberIsPending = null;
            }
        });
        document.querySelector('#page-number').textContent = number;
    });
};

const queueRenderPage = number => {
    if(pageIsRendering) {
        pageNumberIsPending = number;
    } else {
        renderPage(number);
    }
};

const showPreviousPage = () => {
    if(pageNumber <= 1) {
        return;
    }
    pageNumber--;
    queueRenderPage(pageNumber);
};

const showNextPage = () => {
    if(pageNumber >= pdfDocument.numPages) {
        return;
    }
    pageNumber++;
    queueRenderPage(pageNumber);
};

pdfjsLib.getDocument(url).promise.then(pdfDoc => {
    pdfDocument = pdfDoc;
    // console.log(pdfDocument);
    document.querySelector('#page-count').textContent = pdfDocument.numPages;
    renderPage(pageNumber);
}).catch(error => {
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(error.message));
    document.querySelector('body').insertBefore(div,canvas);
    document.querySelector('.top-bar').style.display = 'none';
});

document.querySelector('#previous-page').addEventListener('click', showPreviousPage);

document.querySelector('#next-page').addEventListener('click', showNextPage);