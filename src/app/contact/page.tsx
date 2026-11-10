import SocialMediaLinks from '../components/SocialMediaLinks';
import EditorialPageShell from '../components/EditorialPageShell';

export default function ContactPage() {
  return (
    <EditorialPageShell
      kind="contact"
      eyebrow="THE CODE & TECH JOURNAL / CONTACT"
      title="Start a conversation"
      description="Questions about an article, suggestions for the journal, or a collaboration idea? I'd like to hear from you."
    >
      <section className="ct-p3-contact-grid" aria-label="Ways to get in touch">
        <div className="ct-p3-contact-primary">
          <p className="ct-editorial-eyebrow">DIRECT CONTACT / 01</p>
          <h2>Send an email.</h2>
          <p>For questions, editorial feedback and collaboration enquiries, email is the easiest place to start.</p>
          <a className="ct-p3-email-link" href="mailto:hi@halilyesilyurt.com">
            hi@halilyesilyurt.com <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="ct-p3-contact-secondary">
          <p className="ct-editorial-eyebrow">STAY CONNECTED / 02</p>
          <h2>Find me elsewhere.</h2>
          <p>Follow my writing, open-source work and other projects.</p>
          <div className="ct-p3-contact-social">
            <SocialMediaLinks variant="footer" />
          </div>
        </div>
      </section>
    </EditorialPageShell>
  );
}
