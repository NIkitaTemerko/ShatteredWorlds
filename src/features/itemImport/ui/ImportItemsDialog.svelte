<script lang="ts">
  import { parseItemCores, validateItemCores, importItemCores } from "../model";
  import type { ValidationReport, ImportReport } from "../model";

  interface Props {
    onClose: () => void;
  }

  const { onClose }: Props = $props();

  let jsonText = $state("");
  let validationReport: ValidationReport | null = $state(null);
  let importReport: ImportReport | null = $state(null);
  let skipImages = $state(false);
  let isProcessing = $state(false);
  let errorMessage = $state("");

  function handleFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      jsonText = ev.target?.result as string;
      errorMessage = "";
    };
    reader.readAsText(file);
  }

  async function runImport(dryRun: boolean) {
    try {
      errorMessage = "";
      validationReport = null;
      importReport = null;

      const items = parseItemCores(jsonText);
      const report = validateItemCores(items);
      if (!report.valid) {
        validationReport = report;
        return;
      }

      isProcessing = true;
      importReport = await importItemCores(items, { dryRun, skipImages });

      if (!dryRun) {
        const msg =
          importReport.errors === 0
            ? `✓ Импорт: ${importReport.created} создано, ${importReport.updated} обновлено`
            : `⚠ Импорт завершён с ${importReport.errors} ошибками`;
        ui.notifications?.[importReport.errors ? "warn" : "info"](msg);
      }
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : "Ошибка";
    } finally {
      isProcessing = false;
    }
  }

  function handleValidate() {
    try {
      errorMessage = "";
      importReport = null;
      validationReport = validateItemCores(parseItemCores(jsonText));
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : "Ошибка парсинга";
      validationReport = null;
    }
  }
</script>

<div class="shw-import-dialog">
  <div class="import-section">
    <h3>JSON Данные</h3>
    <div class="file-upload">
      <input type="file" accept=".json" onchange={handleFileSelect} />
    </div>
    <textarea placeholder="Или вставьте JSON массив итемов здесь..." bind:value={jsonText} class="json-input"
    ></textarea>
  </div>

  <div class="options-section">
    <label class="checkbox-label">
      <input type="checkbox" bind:checked={skipImages} /> Пропустить изображения
    </label>
  </div>

  {#if errorMessage}
    <div class="error-box">
      <strong>Ошибка:</strong>
      {errorMessage}
    </div>
  {/if}

  {#if validationReport}
    <div class="validation-box">
      {#if validationReport.valid}
        <div class="success">
          ✓ Валидация успешна ({validationReport.errors.length === 0 ? "ошибок не найдено" : "но есть дубликаты"})
        </div>
      {:else}
        <div class="error">✗ Ошибки валидации ({validationReport.errors.length})</div>
        <ul class="error-list">
          {#each validationReport.errors.slice(0, 5) as err}
            <li>
              [{err.index}]
              {#if err.baseId}
                <code>{err.baseId}</code>
              {/if}
              {err.message}
            </li>
          {/each}
          {#if validationReport.errors.length > 5}
            <li>...и ещё {validationReport.errors.length - 5}</li>
          {/if}
        </ul>
      {/if}
    </div>
  {/if}

  {#if importReport}
    <div class="report-box">
      <div class="report-header">
        {#if importReport.dryRun}
          <strong>Сухой прогон:</strong>
        {:else}
          <strong>Результат импорта:</strong>
        {/if}
      </div>
      <div class="report-stats">
        <div>✓ Создано: <strong>{importReport.created}</strong></div>
        <div>↻ Обновлено: <strong>{importReport.updated}</strong></div>
        <div>⊘ Пропущено: <strong>{importReport.skipped}</strong></div>
        {#if importReport.errors > 0}
          <div class="error-count">✗ Ошибок: <strong>{importReport.errors}</strong></div>
        {/if}
      </div>
      {#if importReport.results.some((r) => r.error)}
        <details class="error-details">
          <summary>
            Детали ошибок ({importReport.results.filter((r) => r.error).length})
          </summary>
          <ul>
            {#each importReport.results.filter((r) => r.error).slice(0, 5) as result}
              <li>
                <code>{result.baseId}</code>: {result.error}
              </li>
            {/each}
          </ul>
        </details>
      {/if}
    </div>
  {/if}

  <div class="button-group">
    <button onclick={handleValidate} disabled={!jsonText || isProcessing} class="btn-secondary">Проверить</button>
    <button onclick={() => runImport(true)} disabled={!jsonText || isProcessing} class="btn-secondary">
      {isProcessing ? "..." : "Сухой прогон"}
    </button>
    <button onclick={() => runImport(false)} disabled={!jsonText || isProcessing} class="btn-primary">
      {isProcessing ? "..." : "Импортировать"}
    </button>
    <button onclick={onClose} disabled={isProcessing} class="btn-cancel">Закрыть</button>
  </div>
</div>

<style>
  .shw-import-dialog {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #1a1820;
  }

  .import-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .import-section h3 {
    margin: 0;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #fff;
    background: rgba(180, 179, 186, 0.6);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px 4px 0 0;
  }

  .file-upload {
    margin-bottom: 0.5rem;
  }

  .file-upload input[type="file"] {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    color: #1a1820;
    font-size: 0.85rem;
  }

  .json-input {
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    color: #1a1820;
    font-family: "Courier New", monospace;
    font-size: 0.8rem;
    min-height: 200px;
    resize: vertical;
  }

  .json-input::placeholder {
    color: rgba(26, 24, 32, 0.5);
  }

  .options-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: #1a1820;
  }

  .checkbox-label input[type="checkbox"] {
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"]:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .error-box,
  .validation-box,
  .report-box {
    padding: 1rem;
    border-radius: 4px;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .error-box {
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.3);
    color: #c62828;
  }

  .validation-box {
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .validation-box .success {
    color: #2e7d32;
    font-weight: 500;
  }

  .validation-box .error {
    color: #c62828;
    font-weight: 500;
  }

  .error-list {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
    list-style: disc;
    color: #1a1820;
  }

  .error-list li {
    margin-top: 0.25rem;
  }

  .error-list code {
    background: rgba(0, 0, 0, 0.08);
    padding: 0.2rem 0.4rem;
    border-radius: 2px;
    font-size: 0.8rem;
    color: #1a1820;
  }

  .report-box {
    background: rgba(76, 175, 80, 0.08);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }

  .report-header {
    margin-bottom: 0.75rem;
    color: #1a1820;
    font-weight: 600;
  }

  .report-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .report-stats div {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    font-size: 0.85rem;
    color: #1a1820;
  }

  .report-stats strong {
    color: #2e7d32;
    font-weight: 600;
  }

  .report-stats .error-count {
    color: #c62828;
  }

  .report-stats .error-count strong {
    color: #c62828;
  }

  .error-details {
    margin-top: 0.75rem;
    cursor: pointer;
  }

  .error-details summary {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    font-size: 0.85rem;
    user-select: none;
    color: #1a1820;
  }

  .error-details ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
    list-style: disc;
  }

  .error-details li {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #1a1820;
  }

  .error-details code {
    background: rgba(0, 0, 0, 0.08);
    padding: 0.2rem 0.4rem;
    border-radius: 2px;
    font-size: 0.75rem;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .btn-primary,
  .btn-secondary,
  .btn-cancel {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: #4caf50;
    color: #fff;
  }

  .btn-primary:hover:not(:disabled) {
    background: #43a047;
  }

  .btn-secondary {
    background: rgba(100, 150, 200, 0.5);
    color: #1a1820;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(100, 150, 200, 0.7);
  }

  .btn-cancel {
    background: rgba(0, 0, 0, 0.1);
    color: #1a1820;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .btn-cancel:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.15);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
