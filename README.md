# Rucoy Scammer Tracker

Daftar scammer Rucoy Online Indonesia. Dibuat dengan Angular, terinspirasi dari Boss Drop Tracker.

## 🚀 Deploy ke Vercel

1. Push repo ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project → Import repo
3. Vercel akan otomatis detect settings dari `vercel.json`
4. Done! Auto-deploy setiap push ke main

## 🛠️ Development

```bash
npm install
npm start
```

## 📦 Build

```bash
npm run build
```

Output ada di `dist/rucoy-scammer-tracker/browser/`

## 📋 Update Data Scammer

Edit file `src/assets/scammer_list.json` — format per huruf alfabet:

```json
{
  "A": [
    { "name": "Nama Scammer", "tag": "S", "detail": "Keterangan" }
  ]
}
```

**Tag:**
- `"S"` = Scammer
- `"W"` = Waspada
