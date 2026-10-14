import { FOOTER_HTML } from "@/lib/data";

export default function Footer() {
  return <footer dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />;
}
