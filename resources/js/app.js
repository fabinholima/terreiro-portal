import '../css/admin.css'
import '../css/admin-actions.css'
import '../css/agenda.css'
import '../css/social-contact.css'
import '../css/documents.css'
import '../css/gallery.css'
import '../css/cms-navigation.css'
import '../css/site-adjustments.css'
import '../css/documents.css'
import Alpine from 'alpinejs'

Alpine.data('alert', function () {
  return { isVisible:false, dismiss(){this.isVisible=false}, init(){setTimeout(()=>{this.isVisible=true},80);setTimeout(()=>{this.dismiss()},5000)} }
})
Alpine.data('mobileMenu',()=>({open:false,toggle(){this.open=!this.open},close(){this.open=false}}))
Alpine.data('lightbox',()=>({image:null,images:[],index:-1,init(){this.images=Array.from(this.$root.querySelectorAll('[data-lightbox-image]')).map((e)=>e.getAttribute('data-lightbox-image')).filter(Boolean)},open(image){this.image=image;this.index=this.images.indexOf(image);document.documentElement.style.overflow='hidden'},close(){this.image=null;this.index=-1;document.documentElement.style.overflow=''},next(){if(!this.images.length)return;this.index=this.index<0?0:(this.index+1)%this.images.length;this.image=this.images[this.index]},previous(){if(!this.images.length)return;this.index=this.index<0?0:(this.index-1+this.images.length)%this.images.length;this.image=this.images[this.index]},get counter(){return !this.image||this.index<0?'':`${this.index+1} / ${this.images.length}`}}))
Alpine.data('galleryViewer', () => ({
  photos: [], index: -1, touchX: null, trigger: null, previousOverflow: '', favorites: [],
  init() {
    this.photos = Array.from(this.$root.querySelectorAll('[data-gallery-photo]')).map((el) => ({ ...el.dataset, element: el }));
    try { this.favorites = JSON.parse(localStorage.getItem('terreiro-gallery-favorites') || '[]'); } catch { this.favorites = []; }
  },
  get current() { return this.photos[this.index] || {}; },
  get counter() { return this.index < 0 ? '' : `${this.index + 1} / ${this.photos.length}`; },
  get favoriteCount() { return this.photos.filter((photo) => this.favorites.includes(photo.src)).length; },
  isFavorite(src) { return this.favorites.includes(src); },
  toggleFavorite(src) { this.favorites = this.isFavorite(src) ? this.favorites.filter((item) => item !== src) : [...this.favorites, src]; localStorage.setItem('terreiro-gallery-favorites', JSON.stringify(this.favorites)); },
  open(button) {
    this.index = this.photos.findIndex((photo) => photo.element === button.closest('[data-gallery-photo]'));
    if (this.index < 0) return;
    this.trigger = button;
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    this.$refs.viewer.showModal();
  },
  close() {
    this.$refs.viewer.close();
    document.documentElement.style.overflow = this.previousOverflow;
    this.trigger?.focus();
  },
  next() { if (this.photos.length) this.index = (this.index + 1) % this.photos.length; },
  previous() { if (this.photos.length) this.index = (this.index - 1 + this.photos.length) % this.photos.length; },
  swipe(event) {
    if (this.touchX === null) return;
    const distance = event.changedTouches[0].clientX - this.touchX;
    if (Math.abs(distance) > 60) distance < 0 ? this.next() : this.previous();
    this.touchX = null;
  },
}))
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('[data-nav-link]').forEach((link) => {
  const href = link.getAttribute('href')?.replace(/\/$/, '') || '/';
  const active = href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`);
  if (active) link.setAttribute('aria-current', 'page');
});
document.querySelectorAll('[data-contact-email]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    event.preventDefault();
    form.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.querySelector('input[name="name"]')?.focus({ preventScroll: true });
  });
});
document.querySelectorAll('[data-contact-close]').forEach((button) => {
  button.addEventListener('click', () => {
    const form = button.closest('[data-contact-form]');
    if (form) form.hidden = true;
    document.querySelector('[data-contact-email]')?.setAttribute('aria-expanded', 'false');
  });
});
document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const status = form.querySelector('[data-contact-status]');
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    if (status) status.textContent = 'Enviando mensagem…';
    fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) })
      .then(async (response) => { const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message || 'Não foi possível enviar agora.'); return payload; })
      .then((payload) => { if (status) status.textContent = payload.message || 'Mensagem enviada com sucesso.'; form.reset(); })
      .catch((error) => { if (status) status.textContent = error.message; })
      .finally(() => { submit.disabled = false; });
  });
});
document.querySelectorAll('input[type="password"]').forEach((input) => {
  if (input.dataset.passwordToggle) return;
  input.dataset.passwordToggle = 'true';
  const wrapper = document.createElement('div');
  wrapper.className = 'password-field';
  input.parentNode?.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'password-field__toggle';
  toggle.setAttribute('aria-label', 'Mostrar senha');
  toggle.textContent = '◉';
  toggle.addEventListener('click', () => {
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
    toggle.textContent = visible ? '◉' : '◌';
  });
  wrapper.appendChild(toggle);
});
const documentSearch = document.querySelector('[data-document-search]');
if (documentSearch) {
  const cards = [...document.querySelectorAll('[data-document-card]')];
  const count = document.querySelector('[data-document-count]');
  const updateDocuments = () => { const term = documentSearch.value.trim().toLocaleLowerCase(); let visible = 0; cards.forEach((card) => { const match = !term || card.dataset.documentText.toLocaleLowerCase().includes(term); card.hidden = !match; if (match) visible += 1; }); if (count) count.textContent = `${visible} documento${visible === 1 ? '' : 's'}`; };
  documentSearch.addEventListener('input', updateDocuments); updateDocuments();
}
Alpine.start()
