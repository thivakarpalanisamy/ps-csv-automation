# CSV ↔ Photoshop Layer Mapper (Design)

## 1. Purpose 🎯
Provide a dynamic system to map **CSV fields** → **Photoshop layers** (text, image, shape).  
Enables bulk automation: certificates, posters, badges, etc.

---

## 2. Inputs 📥
- `mapper.csv` → Defines rules for mapping
- `template.psd` → Photoshop source file with named layers
- `data.csv` → Actual dataset (names, scores, photos…)

---

## 3. Mapper Spec (mapper.csv) 🗂
| csv_field   | layer_name     | type   | transform             |
|-------------|----------------|--------|-----------------------|
| name        | student_name   | text   | UPPERCASE             |
| photo_url   | profile_photo  | image  | FIT:200x200, CIRCLE   |
| score       | score_text     | text   | APPEND:" Marks"       |
| qr_code     | qr_layer       | image  | SCALE:50%             |

---

## 4. Core Flow 🔄
1. **Load Config** → Parse `mapper.csv`
2. **Load Data** → Parse `data.csv`
3. **For each row in data.csv**:
   - Duplicate template
   - For each mapping:
     - If type = `text` → replace layer text
     - If type = `image` → place image, apply transform
     - If type = `shape` → apply color/resize rules
4. **Export** → Save as PNG/JPEG/PDF

---

## 5. Extensibility 🧩
- Add custom transformers (`UPPERCASE`, `FIT`, `CIRCLE`, `SCALE`) as modular functions.
- Support JSON instead of CSV for complex mappings.
- Future: Multi-template support (per grade/branch).

---

## 6. Example Workflow 🖼
1. `mapper.csv` defines rules  
2. `data.csv` has 100 rows  
3. Script runs → outputs 100 personalized images

---

## 7. Next Step 🚀
- Implement **mapper.csv parser** (Phase 02, Step 1)
- Draft Photoshop JSX to apply mappings
