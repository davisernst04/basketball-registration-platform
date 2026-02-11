import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Shadow Basketball",
  description: "Terms of Service for Shadow Basketball Club",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-widest font-bold">
            Back to Home
          </span>
        </Link>

        <div className="flex items-center gap-4 mb-12">
          <Image
            src="/logo.jpg"
            alt="Shadow Basketball Logo"
            width={50}
            height={50}
            className="rounded-xl"
          />
          <h1 className="font-impact text-4xl md:text-5xl uppercase tracking-wider">
            Terms of Service
          </h1>
        </div>

        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mb-12">
          Last Updated: February 11, 2026
        </p>

        <div className="space-y-12 text-zinc-300">
          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using the Shadow Basketball Club website and services,
              you agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              2. Registration and Eligibility
            </h2>
            <p className="leading-relaxed">
              To register for Shadow Basketball programs, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Be of eligible age for the selected program or have parental consent</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized account access</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              3. Program Participation
            </h2>
            <p className="leading-relaxed">By participating in our programs, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Follow all club rules, policies, and code of conduct</li>
              <li>Treat coaches, players, officials, and spectators with respect</li>
              <li>Attend scheduled practices and games or provide advance notice of absence</li>
              <li>Wear appropriate athletic attire and required equipment</li>
              <li>Report any injuries or health concerns to coaching staff</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              4. Payment and Refunds
            </h2>
            <p className="leading-relaxed">
              Registration fees are due at the time of enrollment. Refund policies:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Full refund if requested before the program start date</li>
              <li>Partial refund (50%) within the first two weeks of the program</li>
              <li>No refunds after two weeks from program start</li>
              <li>Medical exceptions may be considered with documentation</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              5. Assumption of Risk
            </h2>
            <p className="leading-relaxed">
              Basketball is a physical sport that carries inherent risks of injury.
              By participating, you acknowledge and accept these risks. We recommend
              all participants have appropriate medical insurance coverage.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              6. Media Release
            </h2>
            <p className="leading-relaxed">
              By registering, you grant Shadow Basketball Club permission to use
              photographs and videos taken during club activities for promotional
              purposes, including social media, website, and marketing materials.
              You may opt out of this by notifying us in writing.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              7. Code of Conduct
            </h2>
            <p className="leading-relaxed">
              Shadow Basketball maintains a zero-tolerance policy for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bullying, harassment, or discrimination of any kind</li>
              <li>Unsportsmanlike conduct or violent behavior</li>
              <li>Use of alcohol, drugs, or tobacco at club events</li>
              <li>Damage to facilities or equipment</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Violations may result in suspension or expulsion from the program
              without refund.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              8. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              Shadow Basketball Club, its coaches, volunteers, and affiliates shall
              not be liable for any indirect, incidental, or consequential damages
              arising from participation in our programs or use of our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              9. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use
              of our services after changes constitutes acceptance of the updated terms.
              We will notify registered users of significant changes via email.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              10. Contact Us
            </h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 mt-4">
              <p className="font-bold text-white">Shadow Basketball Club</p>
              <p>Saskatoon, Saskatchewan, Canada</p>
              <a
                href="mailto:info@shadowbasketball.ca"
                className="text-primary hover:underline"
              >
                info@shadowbasketball.ca
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
