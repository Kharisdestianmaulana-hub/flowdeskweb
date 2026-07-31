const fs = require('fs');

let content = fs.readFileSync('app/dashboard/portal-update/page.tsx', 'utf8');

// Replace alert( with customAlert(
content = content.replace(/\balert\(/g, 'customAlert(');

// Replace confirm( with await customConfirm(
// e.g. `if (!confirm('Are you sure?'))` -> `if (!(await customConfirm('Are you sure?')))`
// The regex: `!confirm\((.*?)\)` -> `!(await customConfirm($1))`
content = content.replace(/!confirm\((.*?)\)/g, '!(await customConfirm($1))');

// And `confirm(` without `!` for `if(confirm('Delete this update?'))`
// The regex: `if\(confirm\((.*?)\)\)` -> `if(await customConfirm($1))`
content = content.replace(/if\(confirm\((.*?)\)\)/g, 'if(await customConfirm($1))');

// Now we need to inject the modal state and functions at the top of the component.
// Find the start of the component: `export default function DashboardPortal() {`
const componentStart = content.indexOf('export default function DashboardPortal() {');
if (componentStart !== -1) {
  const insertIndex = content.indexOf('{', componentStart) + 1;
  
  const modalCode = `
  // Custom Modal State
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'alert' | 'confirm', message: string, onConfirm?: () => void, onCancel?: () => void }>({ isOpen: false, type: 'alert', message: '' });

  const customAlert = (message: string) => {
    setModalConfig({ isOpen: true, type: 'alert', message });
  };

  const customConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        type: 'confirm',
        message,
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };
`;
  
  content = content.slice(0, insertIndex) + modalCode + content.slice(insertIndex);
}

// Now inject the UI for the Custom Modal at the very end of the component, just before the last `</div>`
const modalUI = `
      {/* CUSTOM MODAL */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => modalConfig.type === 'alert' && setModalConfig(prev => ({ ...prev, isOpen: false }))}></div>
          <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              {modalConfig.type === 'confirm' ? 'Confirmation' : 'Notification'}
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-8">
              {modalConfig.message}
            </p>
            <div className="flex items-center justify-center gap-4">
              {modalConfig.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => modalConfig.onCancel && modalConfig.onCancel()}
                    className="px-6 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold rounded-xl hover:bg-[var(--color-surface-raised)] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => modalConfig.onConfirm && modalConfig.onConfirm()}
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition shadow-sm"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className="px-8 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition shadow-sm"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
`;

const lastDivIndex = content.lastIndexOf('</div>\n  );\n}');
if (lastDivIndex !== -1) {
  content = content.slice(0, lastDivIndex) + modalUI + content.slice(lastDivIndex);
}

fs.writeFileSync('app/dashboard/portal-update/page.tsx', content);
console.log('Done refactoring');
