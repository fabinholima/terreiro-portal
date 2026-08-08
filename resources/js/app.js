import '../css/admin-actions.css'
import '../css/agenda.css'
import '../css/social-contact.css'
import '../css/documents.css'
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
  open(image) {
    this.image = image
  },
  close() {
    this.image = null
  },
}))

Alpine.start()
