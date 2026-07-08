import React from "react";
import "./community-testimonial.css";

export const TestimonialCard = ({ quote, authorName, authorTitle, avatarUrl }) => {
  return (
    <div className="ct-card">
      <p className="ct-quote">"{quote}"</p>
      <div className="ct-author-row">
        <img
          src={avatarUrl}
          alt={authorName}
          className="ct-avatar"
        />
        <div>
          <h4 className="ct-author-name">{authorName}</h4>
          <p className="ct-author-title">{authorTitle}</p>
        </div>
      </div>
    </div>
  );
};

export const HorizontalScroller = ({ children, speed = "40s", direction = "left" }) => {
  return (
    <div className="ct-scroller-wrap">
      <div className={`ct-scroller-track ${direction}`} style={{ "--scroll-duration": speed }}>
        <div className="ct-scroller-inner">{children}</div>
        <div className="ct-scroller-inner" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection({ data }) {
  return (
    <section className="ct-section">
      <div className="ct-header">
        <span className="eyebrow" style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.1s forwards" }}>{data.eyebrow}</span>
        <h2
          className="ct-title"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.2s forwards" }}
        >
          {data.title}
        </h2>
        <p
          className="ct-subtitle"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.4s forwards" }}
        >
          {data.subtitle}
        </p>
      </div>

      <div className="ct-rows">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.testimonials.map((t, index) => (
              <TestimonialCard
                key={`${t.id}-${index}`}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      <div className="ct-bg-gradient" aria-hidden="true" />
    </section>
  );
}
