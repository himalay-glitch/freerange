import { Fragment } from "react";
import Link from "next/link";
import "@/styles/jobs.css";
import {
  JOB_LISTINGS,
  JOB_VALUES,
  JOBS_HEADLINE,
  JOBS_INTRO,
  JOBS_OUTRO,
  type JobListing,
} from "@/lib/data/jobs";

/**
 * /jobs listing template (HubSpot "custom blog index" with the `jobs` modifier):
 * `.blog-header > .blog-header__inner.container` holds the hero rich text (headline ending in
 * an orange highlight, intro copy, a bulleted list of values, closing paragraph), then
 * `.content-wrapper > section.blog-index` holds the "Available Jobs" title and one
 * `.job-card` per opening (title link, skill chips, excerpt, "Apply to this job" button).
 */
export default function JobsListingPage({ jobs = JOB_LISTINGS }: { jobs?: JobListing[] }) {
  return (
    <main id="main-content" className="body-container-wrapper">
      <div className="body-container body-container--blog-index body-container--custom-blog-index jobs">
        <div className="blog-header">
          <div className="blog-header__inner container">
            <div className="hero-no-animation container blog-hero-module">
              <h2>
                {JOBS_HEADLINE.lead} <strong>{JOBS_HEADLINE.highlight}</strong>
              </h2>
              {/* The editor left an empty paragraph under the headline; it is part of the measured spacing. */}
              <p>&nbsp;</p>
              {JOBS_INTRO.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <ul>
                {JOB_VALUES.map((value) => (
                  <li key={value.label}>
                    <strong>{value.label}</strong>
                    <br />
                    {value.text}
                  </li>
                ))}
              </ul>
              <p>{JOBS_OUTRO}</p>
            </div>
          </div>
        </div>

        <div className="content-wrapper container">
          <section className="blog-index">
            <h2 className="title">Available Jobs</h2>
            {jobs.map((job) => (
              <div className="job-card" key={job.slug}>
                <h4 className="job-title">
                  <Link href={job.href}>{job.title}</Link>
                </h4>
                <div className="tags">
                  {job.skills.map((skill, i) => (
                    <Fragment key={skill}>
                      {/* chips are inline-blocks; the whitespace between them is the visible gap */}
                      {i > 0 ? " " : null}
                      <span>{skill}</span>
                    </Fragment>
                  ))}
                </div>
                <div className="excerpt">
                  <p>{job.excerpt}</p>
                </div>
                <Link className="hs-button" href={job.href}>
                  Apply to this job
                </Link>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
