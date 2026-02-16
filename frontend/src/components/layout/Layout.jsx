import Header from './Header'
import Footer from './Footer'
import NewsletterBar from '../newsletter/NewsletterBar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NewsletterBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
