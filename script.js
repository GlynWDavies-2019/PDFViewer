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
        console.log(page);
    });
};

pdfjsLib.getDocument(url).promise.then(pdfDoc => {
    pdfDocument = pdfDoc;
    // console.log(pdfDocument);
    document.querySelector('#page-count').textContent = pdfDocument.numPages;
    renderPage(pageNumber);
});