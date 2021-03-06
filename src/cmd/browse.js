const { pipe, filter } = require('../base')
const { toRecords } = require('../keyify')
const { all, setAll } = require('../entity')
const prompt = require('../prompt')
const vmDocument = require('../vm/document')
const vmDocuments = require('../vm/documents')
const opts = require('../opts')

// Parse options
const OPTS = opts.toObj({
  save: false,
  tag:  false,
})([...process.argv.slice(3)])

// Read tags and marks
const tags = Object.values(all('tag'))

// Quit if there are not tags
if (tags.length == 0) {
  console.log('No tags available.')
  console.log(`  (use 'lit add' to add tags)`)
  return
}

// Filter out documents to tag
const docs = pipe(
  Object.values,
  vmDocuments.filter(OPTS)
)(all('document'))

// Quit if no docs
if (docs.length < 1)
  return console.log(`lit: No matching documents.`)

// Pre-fetch observation data
const observations = Object.values(all('observation'))

// Function to check if document is tagged with tag
const isMarked = (doc, tag, marks) => {
  for (let mark of marks) {
    if (mark.documentId == doc.id && mark.tagId == tag.id)
      return true // early return
  }
  return false
}

// Tag printing function
const printTags = (tags, doc, marks) => {
  const docTags = tags.map((tag, i) => ({ ...tag,
    num: i + 1,
    mark: isMarked(doc, tag, marks) ? 'x' : ' '
  }))
  console.log(docTags.map(t => `${t.num}: [${t.mark}] ${t.name}`).join('\n'))
}

async function browse (docs, idx) {
  if (idx < 0) idx = docs.length - 1 // wrap left
  if (idx >= docs.length) idx = 0 // wrap right
  prompt.clear()
  printTimeline(docs, idx)
  vmDocument.print(docs[idx])
  console.log()
  printTags(tags, docs[idx], Object.values(all('mark')))
  if (OPTS.tag)
    retag(docs, idx)
  else
    navigate(docs, idx)
}

// Define tagging function
async function retag (docs, idx) {
  const doc = docs[idx]
  const marks = Object.values(all('mark'))

  // Print instructions and parse output
  console.log()
  console.log('Retag using numbers. Separate with comma. End with enter.')
  const alts = tags.map((_, i) => i + 1)
  const picks = await prompt.checkbox(alts)
  const indexPicks = picks.map(pick => parseInt(pick - 1))

  // Compute new marks
  const newMarks = indexPicks.map(i => ({
    id: tags[i].id + doc.id,
    tagId: tags[i].id,
    documentId: doc.id
  }))

  // Filter out old marks
  const filteredMarks = marks.filter(m => m.documentId != doc.id)

  // Merge to compute new marks
  const mergedMarksArr = filteredMarks.concat(newMarks)
  const mergedMarksObj = toRecords(mergedMarksArr)

  // Print changes if any
  if (newMarks.length > 0) {
    prompt.clear()
    printTimeline(docs, idx)
    vmDocument.print(doc)
    console.log()
    printTags(tags, doc, mergedMarksArr)

    // Confirm changes and move to next or back to the same
    const doNothing = () => console.log('Nothing changed.')
    const doSave = () => setAll('mark')(mergedMarksObj)
    if (OPTS.save) {
      doSave()
    } else {
      console.log()
      await prompt.save(doSave, doNothing)
    }
  } else {
    console.log('Nothing changed.')
  }

  // Back to browsing screen
  if (OPTS.tag) {
    await browse(docs, idx + 1)
  } else {
    await browse(docs, idx)
  }
}

async function navigate (docs, idx) {
  const doNext = () => browse(docs, idx+1)
  const doPrev = () => browse(docs, idx-1)
  const doTag  = () => retag(docs, idx)
  console.log()
  await prompt.pick(
`Go to next (n), previous (p) or choose tags (t) for this document?`,
    { n:doNext, f:doNext, p:doPrev, b:doPrev, t:doTag })
}

function printTimeline (docs, idx) {
  const width = 60
  const str = "-".repeat(docs.length)
  const xs = str.split('')
  xs[idx] = '*'
  const timeline = xs.join('')
  const num = `${idx+1} / ${docs.length}`
  console.log(num)
  console.log(timeline)
}

browse(docs, 0)
