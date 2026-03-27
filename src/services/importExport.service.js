import yaml from 'js-yaml';

/**
 * Triggers a file download in the browser.
 * @param {string} filename
 * @param {string} content
 * @param {string} mimeType
 */
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export data as a JSON file download.
 * @param {unknown} data
 * @param {string} filename - Without extension
 */
export function exportJSON(data, filename) {
  downloadFile(`${filename}.json`, JSON.stringify(data, null, 2), 'application/json');
}

/**
 * Export data as a YAML file download.
 * @param {unknown} data
 * @param {string} filename - Without extension
 */
export function exportYAML(data, filename) {
  downloadFile(`${filename}.yaml`, yaml.dump(data, { lineWidth: 120 }), 'application/x-yaml');
}

/**
 * Read and parse a JSON or YAML file selected by the user.
 * @param {File} file
 * @returns {Promise<unknown>}
 */
export function importFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const isYaml = file.name.endsWith('.yaml') || file.name.endsWith('.yml');
        resolve(isYaml ? yaml.load(text) : JSON.parse(text));
      } catch (err) {
        reject(new Error(`Parse error: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}
