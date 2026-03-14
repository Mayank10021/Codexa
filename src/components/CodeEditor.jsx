import Editor from '@monaco-editor/react'

const langMap = {
  javascript:'javascript', js:'javascript', typescript:'typescript', ts:'typescript',
  python:'python', py:'python', java:'java', cpp:'cpp', 'c++':'cpp', c:'c',
  go:'go', rust:'rust', php:'php', ruby:'ruby', swift:'swift', kotlin:'kotlin',
  jsx:'javascript', tsx:'typescript', html:'html', css:'css', sql:'sql',
  bash:'shell', shell:'shell', json:'json',
}

export default function CodeEditor({ value='', onChange, language='javascript', height='300px', readOnly=false }) {
  const monacoLang = langMap[language?.toLowerCase()] || 'plaintext'

  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme('codexaLight', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'keyword', foreground: '4338CA', fontStyle: 'bold' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'D97706' },
        { token: 'type', foreground: '7C3AED' },
        { token: 'function', foreground: '0284C7' },
        { token: 'variable', foreground: '1C1917' },
        { token: 'operator', foreground: '6366F1' },
      ],
      colors: {
        'editor.background': '#FAFAF9',
        'editor.foreground': '#1C1917',
        'editor.lineHighlightBackground': '#F5F5F4',
        'editor.selectionBackground': '#C7D2FE',
        'editorCursor.foreground': '#4338CA',
        'editorLineNumber.foreground': '#D6D3D1',
        'editorLineNumber.activeForeground': '#78716C',
        'editor.findMatchBackground': '#FDE68A',
        'editorIndentGuide.background': '#E7E5E4',
        'editorIndentGuide.activeBackground': '#C7D2FE',
        'scrollbarSlider.background': '#E7E5E4',
        'scrollbarSlider.hoverBackground': '#D6D3D1',
        'editorWidget.background': '#FFFFFF',
        'editorSuggestWidget.background': '#FFFFFF',
        'editorSuggestWidget.border': '#E5E7EB',
        'list.hoverBackground': '#EEF2FF',
        'list.focusBackground': '#EEF2FF',
        'list.activeSelectionBackground': '#4338CA',
      },
    })
  }

  return (
    <div className="rounded-xl overflow-hidden border border-cx-border shadow-soft">
      <Editor
        height={height}
        language={monacoLang}
        value={value || ''}
        onChange={onChange}
        theme="codexaLight"
        beforeMount={handleEditorWillMount}
        options={{
          fontSize: 13,
          fontFamily: '"Fira Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          readOnly,
          padding: { top: 14, bottom: 14 },
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 2,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          suggest: { showKeywords: !readOnly },
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-stone-50">
            <div className="flex items-center gap-2 text-cx-faint text-sm">
              <div className="w-4 h-4 border-2 border-cx-border border-t-cx-indigo rounded-full animate-spin" />
              Loading editor...
            </div>
          </div>
        }
      />
    </div>
  )
}
