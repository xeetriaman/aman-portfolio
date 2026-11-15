"""Builds data/nsw-retail.json for the dashboard from the data-projects outputs.

Usage: python scripts/build_nsw_retail_json.py <path to data-projects/nsw-retail-forecast>
"""
import json
import sys
from pathlib import Path

import pandas as pd


def main(src: Path) -> None:
    out = src / "outputs"
    growth = pd.read_csv(out / "01_yearly_growth.csv")
    total = growth[growth["industry"] == "Total retail"]
    forecasts = pd.read_csv(out / "forecasts.csv")
    metrics = json.loads((out / "metrics.json").read_text())

    data = {
        "years": [
            {"year": int(r.fin_year), "turnover_bn": r.turnover_bn, "growth_pct": None if pd.isna(r.growth_pct) else r.growth_pct}
            for r in total.itertuples()
        ],
        "christmas": pd.read_csv(out / "02_christmas_peak.csv").to_dict("records"),
        "lockdown": pd.read_csv(out / "03_lockdown_change.csv").to_dict("records"),
        "metrics": metrics,
        "forecasts": {
            industry: {
                "months": rows["month"].tolist(),
                "actual": rows["actual"].tolist(),
                "model": rows["holt_winters"].tolist(),
                "baseline": rows["seasonal_naive"].tolist(),
            }
            for industry, rows in forecasts.groupby("industry", sort=False)
        },
    }
    Path("data/nsw-retail.json").write_text(json.dumps(data, separators=(",", ":")))
    print(f"{len(data['years'])} years, {len(data['forecasts'])} store types")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
