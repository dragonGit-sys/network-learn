import { FOOTER_HTML } from "@/lib/parts";

export default function Footer() {
  return <footer dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />;
}
