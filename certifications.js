// =============================================
// CERTIFICATIONS — Modale de visionneuse PDF (version corrigée)
// Mêmes fonctions qu'avant : le HTML (onclick) ne change pas.
// Corrections : Echap seulement si la modale est ouverte, focus rendu
// au bouton d'origine, piège à Tab, nom du fichier en .pdf,
// iframe vidée avec about:blank, rôles ARIA.
// =============================================
let certifLastFocus = null;

function openCertifModal(pdfPath, title) {
    const modal = document.getElementById('certifModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIframe = document.getElementById('modalIframe');
    const modalDownload = document.getElementById('modalDownload');
    if (!modal || !modalTitle || !modalIframe || !modalDownload) return;

    certifLastFocus = document.activeElement;

    modalTitle.textContent = title;
    modalIframe.title = 'Certification : ' + title;
    modalIframe.src = pdfPath;
    modalDownload.href = pdfPath;
    modalDownload.setAttribute('download', title.replace(/[^\w\- ]+/g, '').trim() + '.pdf');

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalTitle');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.focus();
    }
}

function closeCertifModal() {
    const modal = document.getElementById('certifModal');
    const modalIframe = document.getElementById('modalIframe');
    if (!modal || !modal.classList.contains('open')) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';

    // about:blank (et non '') : arrête proprement le chargement du PDF
    setTimeout(() => { if (modalIframe) modalIframe.src = 'about:blank'; }, 300);

    if (certifLastFocus && typeof certifLastFocus.focus === 'function') certifLastFocus.focus();
    certifLastFocus = null;
}

function closeCertifModalBg(event) {
    if (event.target === document.getElementById('certifModal')) closeCertifModal();
}

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('certifModal');
    if (!modal || !modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
        closeCertifModal();
        return;
    }
    // Piège à focus : Tab reste dans la modale
    if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll('button, a[href]');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});