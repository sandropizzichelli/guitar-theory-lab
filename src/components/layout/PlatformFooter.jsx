import { siteConfig } from "../../../config/site";

export function PlatformFooter() {
  return (
    <footer className="platform-footer">
      <p>Guitar Theory Lab · Created by {siteConfig.creator}</p>
    </footer>
  );
}
