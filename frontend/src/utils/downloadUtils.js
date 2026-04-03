import { jsPDF } from 'jspdf'

export function downloadAsMarkdown(data) {
  const md = `# AI Code Review Results

## Issues & Bugs

${data.issues}

## Refactored Code

\`\`\`
${data.refactoredCode}
\`\`\`

## Explanation

${data.explanation}
`

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'code-review.md'
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadAsPdf(data) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const maxWidth = pageWidth - margin * 2
  let y = 20

  const addSection = (title, content) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(title, margin, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const lines = doc.splitTextToSize(content || 'N/A', maxWidth)

    for (const line of lines) {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += 5
    }

    y += 10
  }

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('AI Code Review Results', margin, y)
  y += 15

  addSection('Issues & Bugs', data.issues)
  addSection('Refactored Code', data.refactoredCode)
  addSection('Explanation', data.explanation)

  doc.save('code-review.pdf')
}
