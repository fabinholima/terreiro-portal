import '../css/admin-actions.css'
import '../css/agenda.css'
import '../css/social-contact.css'
import '../css/documents.css'
import '../css/gallery.css'
import Alpine from 'alpinejs'

Alpine.data('alert', function () {
  return {
    isVisible: false,
    dismiss() {
      this.isVisible = false
    },
    init() {
      setTimeout(() => {
        this.isVisible = true
      }, 80)
      setTimeout(() => {
        this.dismiss()
      }, 5000)
    },
  }
})

Alpine.data('mobileMenu', () => ({
  open: false,
  toggle() {
    this.open = !this.open
  },
  close() {
    this.open = false
  },
}))

Alpine.data('lightbox', () => ({
  image: null,
  images: [],
  index: -1,
  init() {
    this.images = Array.from(this.$root.querySelectorAll('[data-lightbox-image]'))
      .map((element) => element.getAttribute('data-lightbox-image'))
      .filter(Boolean)
  },
  open(image) {
    this.image = image
    this.index = this.images.indexOf(image)
    document.documentElement.style.overflow = 'hidden'
  },
  close() {
    this.image = null
    this.index = -1
    document.documentElement.style.overflow = ''
  },
  next() {
    if (!this.images.length) return
    this.index = this.index < 0 ? 0 : (this.index + 1) % this.images.length
    this.image = this.images[this.index]
  },
  previous() {
    if (!this.images.length) return
    this.index = this.index < 0 ? 0 : (this.index - 1 + this.images.length) % this.images.length
    this.image = this.images[this.index]
  },
  get counter() {
    if (!this.image || this.index < 0) return ''
    return `${this.index + 1} / ${this.images.length}`
  },
}))

Alpine.start()
