import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shadow Basketball",
  description: "Privacy Policy for Shadow Basketball Club",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
        </div>

        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mb-12">
          Last Updated: February 11, 2026
        </p>

        <div className="space-y-12 text-zinc-300">
          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              Shadow Basketball Club (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) collects information you provide directly to us
              when registering for tryouts, programs, or creating an account.
              This may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Date of birth and age verification</li>
              <li>Parent/guardian information for minors</li>
              <li>Emergency contact information</li>
              <li>Athletic history and skill assessments</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process registrations and manage team rosters</li>
              <li>Communicate about practices, games, and club events</li>
              <li>Send important safety and emergency notifications</li>
              <li>Process payments and issue receipts</li>
              <li>Improve our programs and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              3. Information Sharing
            </h2>
            <p className="leading-relaxed">
              We do not sell, trade, or rent your personal information to third
              parties. We may share information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                League administrators and tournament organizers as required
              </li>
              <li>
                Service providers who assist in our operations (payment
                processors, email services)
              </li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              4. Data Security
            </h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              5. Your Rights
            </h2>
            <p className="leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>
                Request deletion of your data (subject to legal requirements)
              </li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              6. Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed">
              We collect information about minors only with parental or guardian
              consent. Parents/guardians may review, update, or request deletion
              of their child&apos;s information by contacting us directly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-impact text-2xl text-white uppercase tracking-wider">
              7. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at:
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
