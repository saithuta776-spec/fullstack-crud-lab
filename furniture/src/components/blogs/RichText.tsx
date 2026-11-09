import Dompurify from "dompurify";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  body: string;
}

export default function RichText({ body, className }: Props) {
  const sanitizedContent = Dompurify.sanitize(body);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className={className}
    ></div>
  );
}
