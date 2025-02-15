// Function to generate relative paths based on the page's depth
function generatePath(basePath) {
  const depth = window.location.pathname.split("/").filter(Boolean).length;
  const prefix = "../".repeat(depth - 1) || "./";
  return prefix + basePath;
}

// Function to update all service links (case-insensitive)
function updateServiceLinks() {
  const links = {
    services: "en/services/index.html",
    faq: "en/services/faq/index.html",
    "catalogues and brochures":
      "en/services/catalogues-and-brochures/index.html",
    "instruction manuals": "en/services/instruction-manuals/index.html",
    "planning tools": "en/services/planning-tools/index.html",
    "wish list": "en/services/wish-list/index.html",
    "media centre": "en/services/media-centre/index.html",
  };

  // Find all <a> tags and update them if title matches
  document.querySelectorAll("a[title]").forEach((link) => {
    const title = link.getAttribute("title").toLowerCase().trim();
    if (links[title]) {
      link.href = generatePath(links[title]);
    }
  });
}

// Automatically update links on page load
window.addEventListener("DOMContentLoaded", updateServiceLinks);
