// =============================================
// CERTIFICATIONS — Modal PDF Viewer
// =============================================

function openCertifModal(pdfPath, title) {
    const modal = document.getElementById('certifModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIframe = document.getElementById('modalIframe');
    const modalDownload = document.getElementById('modalDownload');

    if (!modal || !modalTitle || !modalIframe || !modalDownload) return;

    modalTitle.textContent = title;
    modalIframe.src = pdfPath;
    modalDownload.href = pdfPath;
    modalDownload.download = title;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertifModal() {
    const modal = document.getElementById('certifModal');
    const modalIframe = document.getElementById('modalIframe');

    if (!modal) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';

    // Vider l'iframe pour stopper le chargement PDF
    setTimeout(() => {
        if (modalIframe) modalIframe.src = '';
    }, 300);
}

function closeCertifModalBg(event) {
    if (event.target === document.getElementById('certifModal')) {
        closeCertifModal();
    }
}

// Fermer avec la touche Echap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertifModal();
});