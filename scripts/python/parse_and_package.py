#!/usr/bin/env python3
"""
parse_and_package.py
Reads mapper.csv and data.csv and writes work/package.json
Usage:
  python parse_and_package.py --mapper examples/mapper.csv --data examples/data.csv --out work/package.json
"""

import csv, json, argparse, os, sys

def read_csv_as_dicts(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = [r for r in reader]
    return rows

def validate_mapper(mapper_rows):
    required = {"LayerName","ColumnName","LayerType"}
    for i,m in enumerate(mapper_rows):
        keys = set(k.strip() for k in m.keys())
        if not required.issubset(keys):
            raise ValueError(f"Mapper row {i+1} missing required columns. Found: {keys}")
        # normalize
        m['LayerName'] = m['LayerName'].strip()
        m['ColumnName'] = m['ColumnName'].strip()
        m['LayerType'] = m['LayerType'].strip().lower()
        if m['LayerType'] not in ('text','image'):
            raise ValueError(f"Invalid LayerType '{m['LayerType']}' in mapper row {i+1}")
    return mapper_rows

def build_package(mapper_rows, data_rows):
    package = []
    for ridx, row in enumerate(data_rows):
        # build mapping set for this row
        mappings = []
        for m in mapper_rows:
            col = m['ColumnName']
            value = row.get(col, "")
            mappings.append({
                "layerName": m['LayerName'],
                "columnName": col,
                "layerType": m['LayerType'],
                "value": value
            })
        package.append({
            "rowIndex": ridx,
            "data": row,
            "mappings": mappings
        })
    return package

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--mapper", required=True)
    p.add_argument("--data", required=True)
    p.add_argument("--out", required=True)
    args = p.parse_args()

    if not os.path.exists(args.mapper):
        print("Mapper not found:", args.mapper); sys.exit(2)
    if not os.path.exists(args.data):
        print("Data not found:", args.data); sys.exit(2)

    mapper_rows = read_csv_as_dicts(args.mapper)
    data_rows = read_csv_as_dicts(args.data)

    mapper_rows = validate_mapper(mapper_rows)

    package = build_package(mapper_rows, data_rows)

    os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump({"packageVersion":1, "rows": package}, f, ensure_ascii=False, indent=2)

    print(f"Wrote package: {args.out}  (mapper rows={len(mapper_rows)}, data rows={len(data_rows)})")

if __name__ == "__main__":
    main()
