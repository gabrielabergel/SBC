const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const ffmpeg = require('fluent-ffmpeg')

const VIDEO_NAME = 'SBC_Showreel_Home.mp4'
const VIDEO_PATH = path.join(__dirname, '../public/video', VIDEO_NAME)
const OUTPUT_DIR = path.join(__dirname, '../public/thumbs')
const HASH_FILE = path.join(__dirname, '.video-hash.json')
const NUM_THUMBS = 51

function getVideoHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)
    stream.on('data', (data) => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
  })
}

async function generateThumbnails() {
  if (!fs.existsSync(VIDEO_PATH)) {
    console.error('⛔️ Vidéo introuvable :', VIDEO_PATH)
    process.exit(1)
  }

  const newHash = await getVideoHash(VIDEO_PATH)
  const oldHash = fs.existsSync(HASH_FILE)
    ? JSON.parse(fs.readFileSync(HASH_FILE, 'utf-8')).hash
    : null

  if (newHash === oldHash) {
    console.log('✔️ Vidéo inchangée. Aucune génération nécessaire.')
    return
  }

  console.log('🔁 Nouvelle vidéo détectée. Génération des vignettes...')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Supprimer les anciennes vignettes
  fs.readdirSync(OUTPUT_DIR)
    .filter((f) => f.startsWith('thumb_') && f.endsWith('.jpg'))
    .forEach((f) => fs.unlinkSync(path.join(OUTPUT_DIR, f)))

  // Lire la durée
  ffmpeg.ffprobe(VIDEO_PATH, async (err, metadata) => {
    if (err) {
      console.error('Erreur metadata :', err)
      return
    }

    const duration = metadata.format.duration
    const interval = duration / NUM_THUMBS

    console.log(`📽 Vidéo : ${duration.toFixed(2)}s — ${NUM_THUMBS} vignettes`)

    const generateAt = async (index) => {
      return new Promise((resolve, reject) => {
        const time = index * interval
        const filename = `thumb_${String(index + 1).padStart(3, '0')}.jpg`

        ffmpeg(VIDEO_PATH)
          .seekInput(time)
          .frames(1)
          .output(path.join(OUTPUT_DIR, filename))
          .size('150x?')
          .on('end', () => {
            console.log(`🖼 ${filename}`)
            resolve()
          })
          .on('error', reject)
          .run()
      })
    }

    for (let i = 0; i < NUM_THUMBS; i++) {
      await generateAt(i)
    }

    fs.writeFileSync(HASH_FILE, JSON.stringify({ hash: newHash }, null, 2))
    console.log('✅ Vignettes générées avec succès.')
  })
}

generateThumbnails()
